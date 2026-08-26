/* ==========================================================================
   ENCANTO DECORAÇÕES — Sanitização (proteção contra XSS)

   Regra de uso: sempre que um texto vindo do banco de dados (nome de
   cliente, observação, endereço, tema, etc — qualquer coisa que uma
   pessoa digitou em algum formulário) for inserido na tela via
   innerHTML/template string, ele deve passar por escapeHtml() antes.
   Sem isso, alguém poderia digitar algo como "<img src=x onerror=...>"
   num campo de texto e esse código rodaria na tela de outra pessoa que
   visualizasse esse dado depois.
   ========================================================================== */

export function escapeHtml(valor) {
  if (valor === null || valor === undefined) return '';
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
