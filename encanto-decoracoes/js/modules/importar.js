/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Importação Inteligente
   ========================================================================== */

import { supabase, cabecalhoAutenticado } from '../lib/supabase-client.js';
import { criarCliente } from './clientes.js';
import { criarEvento } from './eventos.js';

/**
 * Envia o texto colado para a função serverless, que usa IA para extrair
 * os dados estruturados da conversa.
 */
export async function interpretarConversa(texto) {
  const resposta = await fetch('/api/importar-conversa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await cabecalhoAutenticado()) },
    body: JSON.stringify({ texto }),
  });
  const json = await resposta.json();
  if (!resposta.ok) throw new Error(json.erro || 'Não foi possível interpretar a conversa.');
  return json.dados;
}

/**
 * Procura um cliente já cadastrado com o mesmo WhatsApp, para evitar
 * cadastros duplicados quando o cliente já existe na base.
 */
export async function buscarClientePorWhatsapp(whatsapp) {
  if (!whatsapp) return null;
  const numeros = whatsapp.replace(/\D/g, '');
  if (numeros.length < 8) return null;

  const { data } = await supabase
    .from('clientes')
    .select('id, nome, whatsapp')
    .ilike('whatsapp', `%${numeros}%`)
    .limit(1);

  return data?.[0] || null;
}

/**
 * Confirma a importação: cria o cliente (ou reaproveita um já existente)
 * e cria o evento vinculado a ele, em um único fluxo.
 *
 * Importante: um eventual "sinal" identificado pela IA NÃO é lançado como
 * pagamento automaticamente. Desde o ajuste de pagamentos manuais, todo
 * pagamento exige um comprovante anexado — e não há arquivo de comprovante
 * numa conversa de texto. O valor do sinal só fica anotado nas observações
 * do evento; quem confirma o pagamento de verdade (com o comprovante em
 * mãos) é a equipe, na aba Financeiro do evento.
 */
export async function confirmarImportacao({ clienteExistenteId, dadosCliente, dadosEvento }) {
  let clienteId = clienteExistenteId;

  if (!clienteId) {
    const { data: cliente, error: erroCliente } = await criarCliente(dadosCliente);
    if (erroCliente) throw new Error('Não foi possível criar o cliente.');
    clienteId = cliente.id;
  }

  const { data: evento, error: erroEvento } = await criarEvento({ ...dadosEvento, cliente_id: clienteId });
  if (erroEvento) throw new Error('Não foi possível criar o evento.');

  return { clienteId, eventoId: evento.id };
}