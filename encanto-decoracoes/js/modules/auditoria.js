/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Auditoria
   Histórico imutável de ações importantes do sistema. Qualquer módulo pode
   chamar registrarAuditoria() depois de uma ação relevante (criar/editar/
   excluir cliente, evento, pagamento, contrato, login/logout...).

   Importante: registrar auditoria NUNCA deve travar a ação principal do
   usuário. Por isso a função sempre engole erros silenciosamente (só avisa
   no console) — se o registro de auditoria falhar por algum motivo, a
   ação de negócio (ex: salvar um cliente) continua valendo normalmente.
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { getCurrentUser } from './auth.js';

/**
 * @param {string} acao - ex: 'criar', 'editar', 'excluir', 'login', 'logout', 'cancelar', 'gerar_contrato'
 * @param {string} modulo - ex: 'clientes', 'eventos', 'financeiro', 'contratos', 'autenticacao'
 * @param {string|null} registroId - id do registro afetado, quando existir
 * @param {object|null} valoresAntigos
 * @param {object|null} valoresNovos
 */
export async function registrarAuditoria(acao, modulo, registroId = null, valoresAntigos = null, valoresNovos = null) {
  try {
    const usuario = await getCurrentUser();
    await supabase.from('auditoria').insert({
      usuario_id: usuario?.id || null,
      usuario_email: usuario?.email || null,
      acao,
      modulo,
      registro_id: registroId ? String(registroId) : null,
      valores_antigos: valoresAntigos,
      valores_novos: valoresNovos,
    });
  } catch (err) {
    // Nunca deixa um erro de auditoria quebrar a ação principal do usuário.
    console.error('[Auditoria] Não foi possível registrar:', err);
  }
}

/**
 * Lista o histórico de auditoria com filtros opcionais — usado na tela do
 * Centro de Auditoria. `limite` vazio/null mostra todos os registros que
 * baterem com o filtro (sem cap).
 *
 * `busca` procura pelo nome do cliente ou pelo tipo/tema do evento dentro
 * do snapshot salvo em cada ação (valores_antigos/valores_novos) — assim
 * dá pra achar "quem mexeu em tal cliente/evento" mesmo sem saber o id.
 * Só cobre os módulos "clientes" e "eventos", que guardam esses campos
 * diretamente; ações de financeiro/contratos referenciam o evento só pelo
 * id, então não aparecem numa busca por nome.
 */
export async function listarAuditoria({ modulo = '', usuarioEmail = '', busca = '', inicio = '', fim = '', limite = 10 } = {}) {
  let query = supabase
    .from('auditoria')
    .select('*')
    .order('created_at', { ascending: false });

  if (limite) query = query.limit(limite);
  if (modulo) query = query.eq('modulo', modulo);
  if (usuarioEmail) query = query.ilike('usuario_email', `%${usuarioEmail}%`);
  if (inicio) query = query.gte('created_at', `${inicio}T00:00:00`);
  if (fim) query = query.lte('created_at', `${fim}T23:59:59`);

  const b = busca.trim();
  if (b) {
    query = query.or(
      [
        `valores_novos->>nome.ilike.%${b}%`, `valores_antigos->>nome.ilike.%${b}%`,
        `valores_novos->>tipo_evento.ilike.%${b}%`, `valores_antigos->>tipo_evento.ilike.%${b}%`,
        `valores_novos->>tema.ilike.%${b}%`, `valores_antigos->>tema.ilike.%${b}%`,
      ].join(',')
    );
  }

  return query;
}
