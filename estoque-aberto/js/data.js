/* ==========================================================================
   ESTOQUE ABERTO — Dados fictícios (demo de portfólio)
   Empresas, lojas, lançamentos, equipe e convites ficam em localStorage.
   Nada aqui é real.
   ========================================================================== */

const DEMO_VERSION = 'v1';
const EA_EMPRESAS_KEY = 'ea_empresas_' + DEMO_VERSION;
const EA_SESSAO_KEY = 'ea_sessao_' + DEMO_VERSION;

const LABORATORIOS = ['NEOFARMA', 'BIOSAÚDE', 'REALFARMA', 'VITAPLUS'];
const ITENS_CATALOGO = [
  'Dipirona 500mg', 'Paracetamol 750mg', 'Losartana 50mg', 'Omeprazol 20mg',
  'Dorflex', 'Loratadina 10mg', 'Amoxicilina 500mg', 'Ibuprofeno 600mg',
  'Metformina 850mg', 'Sinvastatina 20mg', 'Cloridrato de Sertralina 50mg', 'Complexo B',
];

function seedEmpresasEA() {
  const agora = Date.now();
  const dia = 24 * 60 * 60 * 1000;
  return [
    {
      id: 'ea1',
      nome: 'Rede Saúde Popular',
      cnpj: '45.678.901/0001-33',
      emailContato: 'contato@saudepopular.exemplo.com',
      status: 'ativa', // trial | ativa | inadimplente | cancelada
      trialTerminaEm: new Date(agora + 3 * dia).toISOString().slice(0, 10),
      liberadoAte: new Date(agora + 400 * dia).toISOString().slice(0, 10),
      criadaEm: '2026-07-05',
      lojas: [
        { id: 'loja1', nome: 'Loja Centro', cnpj: '45.678.901/0002-14', ativa: true, codigoAcesso: '7K3PXQ' },
        { id: 'loja2', nome: 'Loja Norte', cnpj: '45.678.901/0003-95', ativa: true, codigoAcesso: 'M9WZTL' },
        { id: 'loja3', nome: 'Loja Sul', cnpj: '', ativa: false, codigoAcesso: 'B2FQRS' },
      ],
      gestores: [
        { id: 'g1', nome: 'Você', email: 'gestor@saudepopular.exemplo.com', telefone: '(81) 98888-1111', lojaId: null },
      ],
      convitesPendentes: [
        { id: 'c1', email: 'financeiro@saudepopular.exemplo.com', lojaId: null, expiraEm: new Date(agora + 5 * dia).toISOString().slice(0, 10) },
      ],
      lancamentos: [
        { id: 'l1', lojaId: 'loja1', tipo: 'urgencia', item: 'Dipirona 500mg', lab: 'NEOFARMA', qtdEstoque: 0, ts: new Date(agora - 2 * 60 * 60 * 1000).toISOString(), observacao: '' },
        { id: 'l2', lojaId: 'loja1', tipo: 'encomenda', item: 'Losartana 50mg', lab: 'BIOSAÚDE', qtdEncomendada: 2, clienteNome: 'Maria Souza', clienteTelefone: '(81) 99999-2222', ts: new Date(agora - 5 * 60 * 60 * 1000).toISOString(), observacao: 'Cliente prefere embalagem com 30 comprimidos' },
        { id: 'l3', lojaId: 'loja2', tipo: 'falta_comum', item: 'Omeprazol 20mg', lab: 'REALFARMA', qtdEstoque: 3, ts: new Date(agora - 26 * 60 * 60 * 1000).toISOString(), observacao: '' },
        { id: 'l4', lojaId: 'loja2', tipo: 'urgencia', item: 'Amoxicilina 500mg', lab: 'NEOFARMA', qtdEstoque: 0, ts: new Date(agora - 30 * 60 * 60 * 1000).toISOString(), observacao: 'Muito procurado essa semana' },
        { id: 'l5', lojaId: 'loja1', tipo: 'encomenda', item: 'Metformina 850mg', lab: 'VITAPLUS', qtdEncomendada: 1, clienteNome: 'José Carlos Lima', clienteTelefone: '(81) 98765-4321', ts: new Date(agora - 50 * 60 * 60 * 1000).toISOString(), observacao: '' },
      ],
    },
    {
      id: 'ea2',
      nome: 'Drogaria Vida Nova',
      cnpj: '56.789.012/0001-44',
      emailContato: 'contato@vidanova.exemplo.com',
      status: 'trial',
      trialTerminaEm: new Date(agora + 4 * dia).toISOString().slice(0, 10),
      liberadoAte: new Date(agora + 4 * dia).toISOString().slice(0, 10),
      criadaEm: '2026-09-17',
      lojas: [{ id: 'loja4', nome: 'Loja Matriz', cnpj: '', ativa: true, codigoAcesso: 'Q7VXPN' }],
      gestores: [{ id: 'g2', nome: 'Gestor Vida Nova', email: 'gestor@vidanova.exemplo.com', telefone: '', lojaId: null }],
      convitesPendentes: [],
      lancamentos: [],
    },
    {
      id: 'ea3',
      nome: 'Farmácia Estrela Sul',
      cnpj: '67.890.123/0001-55',
      emailContato: 'financeiro@estrelasul.exemplo.com',
      status: 'inadimplente',
      trialTerminaEm: '2026-08-01',
      liberadoAte: '2026-09-01',
      criadaEm: '2026-06-10',
      lojas: [
        { id: 'loja5', nome: 'Loja Única', cnpj: '', ativa: true, codigoAcesso: 'H4LKDS' },
      ],
      gestores: [{ id: 'g3', nome: 'Gestor Estrela Sul', email: 'gestor@estrelasul.exemplo.com', telefone: '', lojaId: null }],
      convitesPendentes: [],
      lancamentos: [],
    },
  ];
}

function getEmpresasEA() {
  try {
    const raw = localStorage.getItem(EA_EMPRESAS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const seed = seedEmpresasEA();
  saveEmpresasEA(seed);
  return seed;
}
function saveEmpresasEA(empresas) {
  try { localStorage.setItem(EA_EMPRESAS_KEY, JSON.stringify(empresas)); } catch (e) {}
}
function getEmpresaEA(id) {
  return getEmpresasEA().find((e) => e.id === id) || null;
}
function updateEmpresaEA(id, patch) {
  const empresas = getEmpresasEA();
  const idx = empresas.findIndex((e) => e.id === id);
  if (idx === -1) return;
  empresas[idx] = Object.assign({}, empresas[idx], patch);
  saveEmpresasEA(empresas);
}

/* ---------- Sessão fictícia (qualquer login funciona) ---------- */
function getSessaoEA() {
  try {
    const raw = localStorage.getItem(EA_SESSAO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function setSessaoEA(sessao) {
  try { localStorage.setItem(EA_SESSAO_KEY, JSON.stringify(sessao)); } catch (e) {}
}
function limparSessaoEA() {
  try { localStorage.removeItem(EA_SESSAO_KEY); } catch (e) {}
}
function entrarComoEA(papel) {
  setSessaoEA({ papel, empresaId: (papel === 'gestor' || papel === 'loja') ? 'ea1' : null, lojaId: papel === 'loja' ? 'loja1' : null });
}

function escapeHtmlEA(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function formatDataEA(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function diasRestantes(isoData) {
  const ms = new Date(isoData + 'T23:59:59') - new Date();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

const STATUS_LABEL = { trial: 'Período grátis', ativa: 'Ativa', inadimplente: 'Inadimplente', cancelada: 'Cancelada' };
const STATUS_PILL = { trial: 'pill-amber', ativa: 'pill-verde', inadimplente: 'pill-vermelho', cancelada: 'pill-vermelho' };
const TIPO_LABEL = { falta_comum: 'Falta comum', urgencia: 'Urgência', encomenda: 'Encomenda' };
const TIPO_PILL = { falta_comum: 'pill-cinza', urgencia: 'pill-vermelho', encomenda: 'pill-azul' };
