/* ==========================================================================
   VENDAPRONTA PDV — Dados fictícios compartilhados (demo de portfólio)
   Empresas, distribuidoras, promoções, destaques e observações de
   concorrência ficam em localStorage, compartilhados entre os painéis do
   Dono, do Gestor e do app do Vendedor. Nada aqui é real.
   ========================================================================== */

const DEMO_VERSION = 'v1';
const EMPRESAS_KEY = 'vp_empresas_' + DEMO_VERSION;
const SESSAO_KEY = 'vp_sessao_' + DEMO_VERSION;

function seedEmpresas() {
  return [
    {
      id: 'emp1',
      nome: 'Distribuidora Central Farma',
      cnpj: '12.345.678/0001-90',
      telefone: '(81) 98888-1234',
      email: 'contato@centralfarma.exemplo.com',
      acesso: 'ativo', // pendente | ativo | bloqueado
      pagamento: 'em_dia', // em_dia | pendente
      codigoAcesso: '482913',
      criadaEm: '2026-08-10',
      lojas: 1,
      gestores: 1,
      features: {
        levantamento: true,
        sugestao: true,
        exportarDistribuidora: true,
        observacoes: true,
        pdfUnico: true,
      },
      distribuidoras: [
        { id: 'd1', nome: 'Distribuidora Horizonte', pedidoMinimo: 500 },
        { id: 'd2', nome: 'Distribuidora União', pedidoMinimo: 300 },
        { id: 'd3', nome: 'Distribuidora Rápida', pedidoMinimo: 200 },
      ],
      promocoes: [
        { ean: '2000000000000', tipo: 'percentual', valor: 15, distribuidora: null, de: '2026-09-01', ate: '2026-10-15' },
        { ean: '2000000000010', tipo: 'fixo', valor: 8.9, distribuidora: 'Distribuidora Horizonte', de: '2026-09-10', ate: '2026-09-30' },
      ],
      destaques: [
        { ean: '2000000000002', de: '2026-09-01', ate: '2026-10-31' },
        { ean: '2000000000015', de: '2026-09-05', ate: '2026-10-05' },
      ],
      observacoes: [
        { ean: '2000000000000', produto: 'ACETILCISTEINA 600MG+VIT C+D3+ZIN 16CAPS', labConcorrente: 'FARMOL', precoConcorrente: 13.5, loja: 'Farmácia Bem Estar', cnpj: '44.555.666/0001-22', vendedor: 'Carlos Souza', observacao: 'Cliente mostrou nota fiscal', ts: '2026-09-18T14:32:00' },
        { ean: '2000000000010', produto: 'ACETILCISTEINA XPE 120ML', labConcorrente: 'MEDIQUIM', precoConcorrente: 7.9, loja: 'Drogaria Popular', cnpj: '55.666.777/0001-33', vendedor: 'Ana Paula Lima', observacao: '', ts: '2026-09-17T10:05:00' },
      ],
      catalogoImportadoEm: '2026-08-15',
      modeloPlanilha: null,
    },
    {
      id: 'emp2',
      nome: 'Farma Vale Distribuição',
      cnpj: '23.456.789/0001-11',
      telefone: '(81) 97777-5678',
      email: 'financeiro@farmavale.exemplo.com',
      acesso: 'pendente',
      pagamento: 'pendente',
      codigoAcesso: null,
      criadaEm: '2026-09-19',
      lojas: 0,
      gestores: 1,
      features: {
        levantamento: true,
        sugestao: true,
        exportarDistribuidora: true,
        observacoes: true,
        pdfUnico: true,
      },
      distribuidoras: [],
      promocoes: [],
      destaques: [],
      observacoes: [],
      catalogoImportadoEm: null,
      modeloPlanilha: null,
    },
    {
      id: 'emp3',
      nome: 'Nordeste Genéricos Ltda',
      cnpj: '34.567.890/0001-22',
      telefone: '(81) 96666-4321',
      email: 'contato@nordestegenericos.exemplo.com',
      acesso: 'bloqueado',
      pagamento: 'pendente',
      codigoAcesso: '119042',
      criadaEm: '2026-07-02',
      lojas: 3,
      gestores: 1,
      features: {
        levantamento: false,
        sugestao: true,
        exportarDistribuidora: false,
        observacoes: true,
        pdfUnico: false,
      },
      distribuidoras: [
        { id: 'd4', nome: 'Atacado Nordeste', pedidoMinimo: 400 },
      ],
      promocoes: [],
      destaques: [],
      observacoes: [],
      catalogoImportadoEm: '2026-06-20',
      modeloPlanilha: null,
    },
  ];
}

function getEmpresas() {
  try {
    const raw = localStorage.getItem(EMPRESAS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const seed = seedEmpresas();
  saveEmpresas(seed);
  return seed;
}
function saveEmpresas(empresas) {
  try { localStorage.setItem(EMPRESAS_KEY, JSON.stringify(empresas)); } catch (e) {}
}
function getEmpresa(id) {
  return getEmpresas().find((e) => e.id === id) || null;
}
function updateEmpresa(id, patch) {
  const empresas = getEmpresas();
  const idx = empresas.findIndex((e) => e.id === id);
  if (idx === -1) return;
  empresas[idx] = Object.assign({}, empresas[idx], patch);
  saveEmpresas(empresas);
}
function resetDemoData() {
  try { localStorage.removeItem(EMPRESAS_KEY); } catch (e) {}
  try { localStorage.removeItem(SESSAO_KEY); } catch (e) {}
}

/* ---------- Sessão fictícia (qualquer login funciona) ---------- */
function getSessao() {
  try {
    const raw = localStorage.getItem(SESSAO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function setSessao(sessao) {
  try { localStorage.setItem(SESSAO_KEY, JSON.stringify(sessao)); } catch (e) {}
}
function limparSessao() {
  try { localStorage.removeItem(SESSAO_KEY); } catch (e) {}
}
/* Login de demonstração: qualquer e-mail/senha entra. O papel (dono/gestor)
   é escolhido pelo botão que a pessoa clica, não pelo que ela digita. A
   empresa do gestor é sempre a "Distribuidora Central Farma" (emp1, ativa
   e com pagamento em dia), pra sempre dar pra explorar o painel completo. */
function entrarComo(papel) {
  setSessao({ papel, empresaId: papel === 'gestor' ? 'emp1' : null, nome: papel === 'dono' ? 'Você' : 'Gestor(a)' });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function formatMoeda(v) {
  return Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatData(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
