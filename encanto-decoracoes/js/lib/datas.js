/* ==========================================================================
   ENCANTO DECORAÇÕES — Utilitários de data
   ========================================================================== */

/**
 * Data local (YYYY-MM-DD) de uma data JS — NUNCA usar `.toISOString()`
 * pra isso. `toISOString()` converte pra UTC, e o Brasil está atrás
 * (UTC-3): da 21h à meia-noite local, o relógio em UTC já virou o dia
 * seguinte, então `new Date().toISOString()` devolve a data de AMANHÃ
 * enquanto ainda é HOJE aqui. Isso já causou bug real neste projeto —
 * pagamento registrado à noite ficando datado pra amanhã, e evento de
 * hoje sendo marcado como "concluído" antes mesmo de acontecer — por
 * isso esse utilitário existe: usa os componentes LOCAIS da data
 * (getFullYear/getMonth/getDate), nunca UTC.
 */
export function dataLocalISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

/**
 * Faz o inverso com segurança: recebe uma string "YYYY-MM-DD" (sem
 * horário) e devolve um objeto Date à MEIA-NOITE LOCAL — `new Date("2024-03-05")`
 * (string sem horário) é interpretado pelo JS como meia-noite em UTC, não
 * meia-noite local, o que pode "voltar" a data em um dia inteiro para
 * fusos atrás de UTC como o do Brasil.
 */
export function dataLocalDeISO(iso) {
  return new Date(`${iso}T00:00:00`);
}
