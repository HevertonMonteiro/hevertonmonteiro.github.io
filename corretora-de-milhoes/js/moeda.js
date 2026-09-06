/* Máscara de moeda para campos [data-moeda]: formata os dígitos digitados como
   "R$ 1.234,56" em tempo real, e converte de volta pro número puro no submit. */
function aplicarMascaraMoeda(el) {
  let digitos = el.value.replace(/\D/g, '');
  if (!digitos) { el.value = ''; return; }
  digitos = digitos.replace(/^0+(?=\d)/, '');
  while (digitos.length < 3) digitos = '0' + digitos;
  const inteiros = digitos.slice(0, -2);
  const centavos = digitos.slice(-2);
  el.value = `R$ ${parseInt(inteiros, 10).toLocaleString('pt-BR')},${centavos}`;
}
function moedaParaNumero(texto) {
  const digitos = String(texto || '').replace(/\D/g, '');
  if (!digitos) return null;
  return parseInt(digitos, 10) / 100;
}
function numeroParaMoeda(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  return `R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
