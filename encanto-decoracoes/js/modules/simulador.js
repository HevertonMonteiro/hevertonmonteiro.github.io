/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Simulador de Cartão
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';

export async function buscarTaxas() {
  return supabase.from('taxas_cartao').select('*').order('parcela', { ascending: true });
}

export async function atualizarTaxa(parcela, taxaPercentual) {
  return supabase.from('taxas_cartao').update({ taxa_percentual: taxaPercentual }).eq('parcela', parcela);
}

/**
 * Calcula o resultado da simulação de cartão.
 * @param {number} valor - valor total da venda
 * @param {number} parcelas
 * @param {number} taxaPercentual
 */
export function calcularSimulacao(valor, parcelas, taxaPercentual) {
  const valorTaxa = valor * (taxaPercentual / 100);
  const valorLiquido = valor - valorTaxa;
  const valorPorParcela = valor / parcelas;

  return {
    valorBruto: valor,
    valorTaxa,
    valorLiquido,
    valorPorParcela,
    taxaPercentual,
  };
}
