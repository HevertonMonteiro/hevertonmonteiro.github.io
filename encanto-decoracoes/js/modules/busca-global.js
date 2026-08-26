/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Pesquisa Global
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';

/**
 * Tenta interpretar o termo como uma data no formato dd/mm ou dd/mm/aaaa
 * e devolve no formato ISO (YYYY-MM-DD). Retorna null se não for uma data.
 */
function tentarInterpretarData(termo) {
  const m = termo.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!m) return null;

  const dia = m[1].padStart(2, '0');
  const mes = m[2].padStart(2, '0');
  let ano = m[3] || String(new Date().getFullYear());
  if (ano.length === 2) ano = `20${ano}`;

  return `${ano}-${mes}-${dia}`;
}

/**
 * Pesquisa clientes e eventos por um único termo, cobrindo: nome,
 * WhatsApp, tema, pacote, tipo de evento, endereço, data e equipe.
 * Devolve os resultados já agrupados por categoria.
 */
export async function buscarGlobal(termoOriginal) {
  const termo = termoOriginal.trim();
  if (!termo) return { clientes: [], eventos: [] };

  const dataISO = tentarInterpretarData(termo);

  const consultas = [
    supabase.from('clientes')
      .select('id, nome, whatsapp')
      .or(`nome.ilike.%${termo}%,whatsapp.ilike.%${termo}%`)
      .limit(5),

    supabase.from('eventos')
      .select('id, data, horario, tipo_evento, tema, pacote, endereco, status, clientes(nome)')
      .or(`tipo_evento.ilike.%${termo}%,tema.ilike.%${termo}%,pacote.ilike.%${termo}%,endereco.ilike.%${termo}%`)
      .order('data', { ascending: false })
      .limit(8),

    // Equipe: busca por correspondência exata de nome dentro da lista
    // (arrays de texto no Postgres não suportam ILIKE parcial de forma simples).
    supabase.from('eventos')
      .select('id, data, horario, tipo_evento, tema, pacote, endereco, status, clientes(nome)')
      .contains('equipe_responsavel', [termo])
      .limit(5),
  ];

  if (dataISO) {
    consultas.push(
      supabase.from('eventos')
        .select('id, data, horario, tipo_evento, tema, pacote, endereco, status, clientes(nome)')
        .eq('data', dataISO)
        .limit(8)
    );
  }

  const resultados = await Promise.all(consultas);
  const [clientesRes, eventosPorCampoRes, eventosPorEquipeRes, eventosPorDataRes] = resultados;

  const eventosMap = new Map();
  [...(eventosPorCampoRes.data || []), ...(eventosPorEquipeRes.data || []), ...(eventosPorDataRes?.data || [])]
    .forEach(ev => eventosMap.set(ev.id, ev));

  return {
    clientes: clientesRes.data || [],
    eventos: Array.from(eventosMap.values()).slice(0, 8),
  };
}
