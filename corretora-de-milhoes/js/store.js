/* ==========================================================================
   CORRETORA DE MILHÕES — "Banco de dados" local (demo de portfólio)
   Guarda imóveis, depoimentos, leads e realizações no localStorage do
   navegador. Nesta demonstração não existe servidor nem banco de dados
   real — tudo roda aqui, e qualquer alteração fica só neste navegador.
   Requer que js/data.js já tenha sido carregado antes deste arquivo.
   ========================================================================== */

const DB_VERSION = 'v1';
const DB_KEY = `cm_demo_db_${DB_VERSION}`;
const FILES_KEY = `cm_demo_files_${DB_VERSION}`;
const LIMITE_ARQUIVO_BYTES = 900 * 1024;

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function nowIso() {
  return new Date().toISOString();
}
function slugify(str) {
  return str
    .toString()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function seedInicial() {
  const imoveis = IMOVEIS_SEED.map((i) => ({
    id: uid(),
    ...i,
    slug: slugify(`${i.titulo}-${i.codigo_referencia}`),
    fotos: i.fotos.map((nome, ordem) => ({ url: `assets/imoveis/${nome}`, legenda: '', ordem })),
    criado_em: nowIso(),
    atualizado_em: nowIso(),
  }));
  const porCodigo = Object.fromEntries(imoveis.map((i) => [i.codigo_referencia, i.id]));

  const depoimentos = DEPOIMENTOS_SEED.map((d) => ({
    id: uid(),
    nome_cliente: d.nome_cliente,
    email_cliente: d.email_cliente,
    texto: d.texto,
    nota: d.nota,
    aprovado: d.aprovado,
    imovel_id: d.imovel_codigo ? porCodigo[d.imovel_codigo] : null,
    criado_em: nowIso(),
  }));

  const realizacoes = REALIZACOES_SEED.map((r) => ({
    id: uid(),
    titulo: r.titulo,
    texto: r.texto,
    foto: `assets/realizacoes/${r.foto}`,
    visivel: r.visivel,
    imovel_id: r.imovel_codigo ? porCodigo[r.imovel_codigo] : null,
    publicado_em: nowIso(),
  }));

  return { perfil: { ...PERFIL_SEED }, imoveis, depoimentos, realizacoes, leads: [] };
}

const Store = {
  _cache: null,
  load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) { this._cache = JSON.parse(raw); return this._cache; }
    } catch (e) { /* localStorage indisponível: recria do zero */ }
    this._cache = seedInicial();
    this.save();
    return this._cache;
  },
  save() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(this._cache)); } catch (e) { /* quota cheia: ignora */ }
  },
};

/** Reseta a demo para o estado inicial. */
function resetarDadosDemo() {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(FILES_KEY);
  } catch (e) { /* ignora */ }
  Store._cache = null;
}

/* ---------- Perfil ---------- */
function getPerfil() { return Store.load().perfil; }

/* ---------- Imóveis ---------- */
function getImoveis() { return Store.load().imoveis; }
function getImovel(id) { return Store.load().imoveis.find((i) => i.id === id) || null; }
function getImovelPorSlug(slug) { return Store.load().imoveis.find((i) => i.slug === slug) || null; }

function gerarCodigoReferencia() {
  const imoveis = getImoveis();
  const max = imoveis.reduce((m, i) => {
    const n = parseInt((i.codigo_referencia || '').replace('CM-', ''), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `CM-${String(max + 1).padStart(4, '0')}`;
}

function criarImovel(dados) {
  const db = Store.load();
  const codigo = gerarCodigoReferencia();
  const imovel = {
    id: uid(),
    codigo_referencia: codigo,
    slug: slugify(`${dados.titulo}-${codigo}`),
    fotos: [],
    criado_em: nowIso(),
    atualizado_em: nowIso(),
    ...dados,
  };
  db.imoveis.unshift(imovel);
  Store.save();
  return imovel;
}
function atualizarImovel(id, dados) {
  const imovel = getImovel(id);
  if (!imovel) return null;
  Object.assign(imovel, dados, { atualizado_em: nowIso() });
  Store.save();
  return imovel;
}
function excluirImovel(id) {
  const db = Store.load();
  db.imoveis = db.imoveis.filter((i) => i.id !== id);
  Store.save();
}
function definirStatusImovel(id, status) {
  return atualizarImovel(id, { status });
}
function adicionarFotosImovel(id, fotos) {
  const imovel = getImovel(id);
  if (!imovel) return null;
  imovel.fotos = [...imovel.fotos, ...fotos];
  imovel.atualizado_em = nowIso();
  Store.save();
  return imovel;
}
function removerFotoImovel(id, ordem) {
  const imovel = getImovel(id);
  if (!imovel) return null;
  imovel.fotos = imovel.fotos.filter((f) => f.ordem !== ordem);
  Store.save();
  return imovel;
}

/* ---------- Depoimentos ---------- */
function getDepoimentos() { return Store.load().depoimentos; }
function criarDepoimento(dados) {
  const db = Store.load();
  const depoimento = { id: uid(), aprovado: false, criado_em: nowIso(), ...dados };
  db.depoimentos.unshift(depoimento);
  Store.save();
  return depoimento;
}
function aprovarDepoimento(id) {
  const d = getDepoimentos().find((x) => x.id === id);
  if (d) { d.aprovado = true; Store.save(); }
  return d;
}
function excluirDepoimento(id) {
  const db = Store.load();
  db.depoimentos = db.depoimentos.filter((d) => d.id !== id);
  Store.save();
}

/* ---------- Realizações ---------- */
function getRealizacoes() { return Store.load().realizacoes; }
function criarRealizacao(dados) {
  const db = Store.load();
  const realizacao = { id: uid(), visivel: true, publicado_em: nowIso(), ...dados };
  db.realizacoes.unshift(realizacao);
  Store.save();
  return realizacao;
}

/* ---------- Leads ---------- */
function getLeads() { return Store.load().leads; }
function criarLead(dados) {
  const db = Store.load();
  const lead = { id: uid(), atendido: false, criado_em: nowIso(), ...dados };
  db.leads.unshift(lead);
  Store.save();
  return lead;
}
function alternarLeadAtendido(id) {
  const lead = getLeads().find((l) => l.id === id);
  if (lead) { lead.atendido = !lead.atendido; Store.save(); }
  return lead;
}

/* ---------- Arquivos (fotos enviadas pelo painel) ---------- */
function arquivoParaDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
/** Lê um arquivo local e devolve {url, legenda, ordem} pronto para salvar numa lista de fotos. */
async function processarFotoUpload(file, ordem, legenda) {
  if (file.size > LIMITE_ARQUIVO_BYTES) {
    throw new Error('Nesta demonstração, imagens maiores que 900KB não são aceitas (o armazenamento é só o do seu navegador).');
  }
  const url = await arquivoParaDataUrl(file);
  return { url, legenda: legenda || '', ordem };
}

/* ---------- Rótulos (equivalentes aos TextChoices do Django) ---------- */
const TIPOS_NEGOCIO = { venda: 'Venda', aluguel: 'Aluguel', venda_aluguel: 'Venda ou Aluguel' };
const TIPOS_IMOVEL = {
  apartamento: 'Apartamento', casa: 'Casa', casa_condominio: 'Casa em Condomínio',
  terreno: 'Terreno / Lote', comercial: 'Sala / Ponto Comercial', rural: 'Chácara / Sítio / Fazenda',
  cobertura: 'Cobertura', outro: 'Outro',
};
const STATUS_IMOVEL = {
  disponivel: 'Disponível', reservado: 'Reservado', vendido: 'Vendido', alugado: 'Alugado', inativo: 'Inativo (rascunho)',
};

function formatoMoeda(v) {
  return Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
/* Aceita o número com ou sem o código do país: limpa tudo que não for dígito
   e, se sobrarem 10 ou 11 dígitos (DDD + número, sem o 55), prefixa com ele. */
function normalizarWhatsapp(numero) {
  const digitos = String(numero || '').replace(/\D/g, '');
  if (!digitos) return '';
  if (!digitos.startsWith('55') && (digitos.length === 10 || digitos.length === 11)) {
    return '55' + digitos;
  }
  return digitos;
}
function linkWhatsapp(perfil, texto) {
  return `https://wa.me/${normalizarWhatsapp(perfil.whatsapp)}?text=${encodeURIComponent(texto)}`;
}
