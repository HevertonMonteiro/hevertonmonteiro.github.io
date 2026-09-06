/* ==========================================================================
   ENCANTO DECORAÇÕES — Backend simulado (demo de portfólio)
   Esta versão pública substitui o Supabase real por um "banco de dados"
   inteiro guardado no localStorage do navegador, mas com a MESMA interface
   encadeável do cliente Supabase (from/select/eq/order/insert/update/delete,
   storage, auth). Por isso nenhum outro arquivo do sistema precisou mudar —
   todos os módulos continuam chamando `supabase.from('eventos')...` como
   se estivessem falando com um banco real.

   Nada aqui sai do navegador de quem está testando: sem servidor, sem
   banco de dados real, sem chave de API.
   ========================================================================== */

const DEMO_VERSION = 'v4';
const DB_KEY = `encanto_demo_db_${DEMO_VERSION}`;
const SESSION_KEY = 'encanto_demo_session';
const FILES_KEY = `encanto_demo_files_${DEMO_VERSION}`;

/* ==========================================================================
   1) USUÁRIOS DE DEMONSTRAÇÃO
   ========================================================================== */
export const USUARIOS_DEMO = [
  { id: 'usr-admin-0001', email: 'admin@demo.com', senha: 'demo123', nome_completo: 'Marina Duarte', perfil_acesso: 'administrador', cargo: 'Sócia-administradora', telefone: '(81) 99111-2233' },
  { id: 'usr-equipe-0002', email: 'equipe@demo.com', senha: 'demo123', nome_completo: 'Rafael Sena', perfil_acesso: 'padrao', cargo: 'Atendimento', telefone: '(81) 99222-3344' },
];

/* ==========================================================================
   2) DADOS FICTÍCIOS (seed) — gerados uma vez, relativos à data de hoje
   ========================================================================== */
function uid() {
  return (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`);
}
function isoData(diffDias) {
  const d = new Date();
  d.setDate(d.getDate() + diffDias);
  return d.toISOString().slice(0, 10);
}
function nowIso() {
  return new Date().toISOString();
}

const NOMES_CLIENTES = [
  ['Beatriz Andrade', '(81) 98811-0011', '11144477735', 'Rua das Palmeiras, 120, Boa Viagem'],
  ['Carlos Eduardo Lima', '(81) 98822-0022', '22255588846', 'Av. Conde da Boa Vista, 540, Centro'],
  ['Fernanda Melo Costa', '(81) 98833-0033', '33366699957', 'Rua do Sol, 78, Casa Amarela'],
  ['Gustavo Ramos', '(81) 98844-0044', '44477700068', 'Rua Sete de Setembro, 210, Santo Amaro'],
  ['Juliana Prado', '(81) 98855-0055', '55588811179', 'Av. Agamenon Magalhães, 900, Espinheiro'],
  ['Larissa Nogueira', '(81) 98866-0066', '66699922280', 'Rua da Aurora, 340, Boa Vista'],
  ['Marcelo Tavares', '(81) 98877-0077', '77700033391', 'Rua Real da Torre, 55, Torre'],
  ['Patrícia Guedes', '(81) 98888-0088', '88811144402', 'Av. Rui Barbosa, 610, Graças'],
  ['Rodrigo Feitosa', '(81) 98899-0099', '99922255513', 'Rua João de Barros, 88, Boa Vista'],
];

const TIPOS_EVENTO = ['Aniversário', 'Chá revelação', 'Chá de bebê', 'Casamento', 'Ensaio fotográfico', 'Formatura', 'Batizado'];
const TEMAS = ['Jardim encantado', 'Safári', 'Circo', 'Boho chic', 'Realeza', 'Fundo do mar', 'Unicórnio', 'Astronauta', 'Clássico branco e dourado'];
const PACOTES = ['Essencial', 'Completo', 'Premium', 'Personalizado'];
const EQUIPE = ['Bianca Rocha', 'Diego Farias', 'Elaine Souza', 'Thiago Barros'];

function gerarSeed() {
  const clientes = NOMES_CLIENTES.map(([nome, whatsapp, cpf, endereco], i) => ({
    id: uid(),
    nome,
    whatsapp,
    instagram: `@${nome.split(' ')[0].toLowerCase()}.eventos`,
    observacoes: i % 3 === 0 ? 'Cliente indicado por outra festa anterior.' : '',
    cpf,
    endereco,
    email: `${nome.split(' ')[0].toLowerCase()}@exemplo.com`,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));

  const eventos = [];
  const pagamentos = [];
  const contratos = [];
  const anexos = [];

  // distribui eventos em datas passadas, próximas e futuras, com status coerente
  const plano = [
    { dias: -40, status: 'finalizado', pago: 1 },
    { dias: -28, status: 'finalizado', pago: 1 },
    { dias: -15, status: 'concluido', pago: 0.6 },
    { dias: -6, status: 'concluido', pago: 1 },
    { dias: -2, status: 'concluido', pago: 0.4 },
    { dias: 1, status: 'confirmado', pago: 0.5 },
    { dias: 4, status: 'confirmado', pago: 1 },
    { dias: 9, status: 'confirmado', pago: 0.3 },
    { dias: 16, status: 'confirmado', pago: 0 },
    { dias: 23, status: 'orcamento', pago: 0 },
    { dias: 30, status: 'orcamento', pago: 0 },
    { dias: 45, status: 'orcamento', pago: 0 },
    { dias: -20, status: 'cancelado', pago: 0 },
  ];

  plano.forEach((p, i) => {
    const cliente = clientes[i % clientes.length];
    const tipo = TIPOS_EVENTO[i % TIPOS_EVENTO.length];
    const tema = TEMAS[i % TEMAS.length];
    const pacote = PACOTES[i % PACOTES.length];
    const valor = [1800, 2400, 3200, 4200, 5600, 6800][i % 6];
    const eventoId = uid();
    const equipeSorteada = [EQUIPE[i % EQUIPE.length], EQUIPE[(i + 1) % EQUIPE.length]];

    eventos.push({
      id: eventoId,
      cliente_id: cliente.id,
      tipo_evento: tipo,
      tema,
      pacote,
      data: isoData(p.dias),
      horario: ['14:00', '15:30', '16:00', '19:00', '10:00'][i % 5],
      horario_montagem: '3 horas antes',
      endereco: cliente.endereco,
      ponto_referencia: 'Próximo ao salão de festas',
      equipe_responsavel: equipeSorteada,
      observacoes: i % 4 === 0 ? 'Cliente pediu atenção especial com o horário de montagem.' : '',
      status: p.status,
      valor_orcamento: valor,
      forma_pagamento_combinada: i % 2 === 0 ? 'pix' : 'cartao',
      idade: tipo === 'Aniversário' ? [1, 5, 15, 30][i % 4] : null,
      google_event_id: null,
      quitado_em: p.pago >= 1 ? nowIso() : null,
      created_at: nowIso(),
      updated_at: nowIso(),
    });

    if (p.pago > 0) {
      const valorPago = Math.round(valor * p.pago * 100) / 100;
      pagamentos.push({
        id: uid(),
        evento_id: eventoId,
        valor: valorPago,
        data: isoData(p.dias - 3),
        horario: '11:30:00',
        forma_pagamento: i % 2 === 0 ? 'pix' : 'cartao',
        observacao: '',
        comprovante_url: null,
        registrado_por: USUARIOS_DEMO[0].email,
        origem: 'manual',
        cobranca_id: null,
        created_at: nowIso(),
      });
    }

    if (p.status === 'finalizado' || p.status === 'concluido') {
      contratos.push({
        id: uid(),
        evento_id: eventoId,
        arquivo_url: null,
        codigo_curto: gerarCodigoCurtoDemo(),
        gerado_em: nowIso(),
      });
    }
  });

  const funcionarios = EQUIPE.map((nome, i) => ({
    id: uid(),
    nome,
    cargo: ['Decoradora líder', 'Montador', 'Decoradora', 'Motorista/Apoio'][i % 4],
    tipo_pagamento: ['mensalista', 'diarista', 'diarista', 'por_evento'][i % 4],
    valor_combinado: [2200, 150, 140, 120][i % 4],
    ativo: true,
    created_at: nowIso(),
  }));

  const funcionario_pagamentos = funcionarios.slice(0, 2).flatMap((f) => ([
    { id: uid(), funcionario_id: f.id, tipo: 'pagamento', valor: f.valor_combinado, data: isoData(-10), observacao: 'Pagamento mensal', comprovante_url: null, registrado_por: USUARIOS_DEMO[0].email, created_at: nowIso() },
  ]));

  const acervo_itens = [
    { id: uid(), nome: 'Jardim encantado', categoria: 'tema', descricao: 'Decoração com arcos florais e tons pastel.', itens_inclusos: 'Arco floral\nPainel redondo\nMesa do bolo\n2 mesas cilindro', preco_sugerido: 1200, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Safári', categoria: 'tema', descricao: 'Tema infantil com bichinhos e tons terrosos.', itens_inclusos: 'Painel temático\nBalões orgânicos\nTotens de personagens', preco_sugerido: 1400, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Realeza', categoria: 'tema', descricao: 'Decoração elegante em dourado e branco.', itens_inclusos: 'Trono decorado\nPainel de flores\nTapete vermelho', preco_sugerido: 1900, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Essencial', categoria: 'pacote', descricao: 'Pacote de entrada, ideal para eventos íntimos.', itens_inclusos: 'Painel simples\nMesa do bolo\nBalões', preco_sugerido: 1800, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Completo', categoria: 'pacote', descricao: 'Pacote intermediário com mais peças decorativas.', itens_inclusos: 'Painel temático\nMesa do bolo\n2 mesas cilindro\nBalões orgânicos', preco_sugerido: 3200, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Premium', categoria: 'pacote', descricao: 'Pacote completo com toda a estrutura decorativa.', itens_inclusos: 'Painel temático grande\nMesa do bolo\n4 mesas cilindro\nLounge decorado\nIluminação cênica', preco_sugerido: 5600, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Ensaio ao pôr do sol', categoria: 'ensaio', descricao: 'Cenário montado para ensaio fotográfico externo.', itens_inclusos: 'Painel floral\nTapete\nAcessórios para fotos', preco_sugerido: 650, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Ensaio em estúdio', categoria: 'ensaio', descricao: 'Cenário para ensaio interno, fundo neutro.', itens_inclusos: 'Fundo infinito\nIluminação\nAcessórios temáticos', preco_sugerido: 500, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
    { id: uid(), nome: 'Personalizado', categoria: 'pacote', descricao: 'Monte sua própria combinação de peças.', itens_inclusos: 'A combinar com a cliente', preco_sugerido: null, observacoes: '', fotos: [], created_at: nowIso(), updated_at: nowIso() },
  ];

  const tipos_evento = TIPOS_EVENTO.map((nome) => ({ id: uid(), nome }));
  const equipe_membros = EQUIPE.map((nome) => ({ id: uid(), nome, ativo: true, created_at: nowIso() }));

  const taxas_cartao = [
    3.5, 4.5, 5.2, 5.9, 6.6, 7.3, 8.0, 8.7, 9.4, 10.1, 10.8, 11.5,
  ].map((taxa, i) => ({ parcela: i + 1, taxa_percentual: taxa }));

  const modelo_contrato = [{
    id: 1,
    conteudo:
`1. Para a opção de pagamento parcelado, o valor total do serviço a ser prestado já deverá estar pago integralmente em até 5 dias antes da data agendada.
2. Para a opção de cartão de crédito, o pagamento poderá ser realizado com juros.
3. Valores destinados à produção de novas peças não serão ressarcidos em caso de cancelamento.
4. Em caso de cancelamento, o valor deve ser ressarcido em até 7 dias úteis após a solicitação.`,
    updated_at: nowIso(),
  }];

  const empresa_config = [{
    id: 1,
    nome: 'Encanto Decorações',
    whatsapp: '(81) 99000-1234',
    logo_url: '../assets/logo-encanto.png',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Acácias, 200, Boa Viagem, Recife - PE',
    banco: 'Banco Fictício S.A.',
    agencia: '0001',
    conta: '12.345-6',
    titular_conta: 'Encanto Decorações Ltda',
    pix_chave: 'contato@encantodecoracoes.exemplo.com',
    updated_at: nowIso(),
  }];

  const bloqueios_agenda = [
    { id: uid(), data: isoData(18), motivo: 'ferias', observacao: 'Equipe de férias coletivas.', criado_por: USUARIOS_DEMO[0].email, created_at: nowIso() },
    { id: uid(), data: isoData(-1) > isoData(0) ? isoData(0) : isoData(12), motivo: 'agenda_cheia', observacao: '', criado_por: USUARIOS_DEMO[0].email, created_at: nowIso() },
  ];

  const perfis_usuario = USUARIOS_DEMO.map((u) => ({
    id: u.id,
    email: u.email,
    nome_completo: u.nome_completo,
    telefone: u.telefone,
    cargo: u.cargo,
    perfil_acesso: u.perfil_acesso,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));

  const auditoria = [
    { id: uid(), usuario_id: USUARIOS_DEMO[0].id, usuario_email: USUARIOS_DEMO[0].email, acao: 'login', modulo: 'autenticacao', registro_id: null, valores_antigos: null, valores_novos: null, created_at: nowIso() },
  ];

  return {
    clientes, eventos, pagamentos, contratos, anexos, funcionarios, funcionario_pagamentos,
    acervo_itens, tipos_evento, equipe_membros, taxas_cartao, modelo_contrato, empresa_config,
    bloqueios_agenda, perfis_usuario, auditoria,
  };
}

const CODIGO_CURTO_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
function gerarCodigoCurtoDemo() {
  let s = '';
  for (let i = 0; i < 8; i++) s += CODIGO_CURTO_CHARSET[Math.floor(Math.random() * CODIGO_CURTO_CHARSET.length)];
  return s;
}

/* ==========================================================================
   3) PERSISTÊNCIA (localStorage) — o "banco" inteiro é um objeto único
   ========================================================================== */
const Store = {
  _cache: null,
  load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) {
        this._cache = JSON.parse(raw);
        return this._cache;
      }
    } catch (e) { /* localStorage indisponível ou corrompido: recria do zero */ }
    this._cache = gerarSeed();
    this.save();
    return this._cache;
  },
  save() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(this._cache)); } catch (e) { /* quota cheia: ignora, mantém em memória */ }
  },
  table(nome) {
    const db = this.load();
    if (!db[nome]) db[nome] = [];
    return db[nome];
  },
  setTable(nome, linhas) {
    this.load()[nome] = linhas;
    this.save();
  },
};

/** Reseta a demo para o estado inicial (usado pelo botão "Reiniciar dados de demonstração"). */
export function resetarDadosDemo() {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(FILES_KEY);
  } catch (e) { /* ignora */ }
  Store._cache = null;
}

/* ==========================================================================
   4) RELACIONAMENTOS (para resolver "clientes(nome)", "eventos!inner(...)")
   Muitos-para-um: tabela filha -> { nomeDaRelacaoNoSelect: {tabela pai, coluna FK} }
   ========================================================================== */
const RELACOES = {
  eventos: { clientes: { tabela: 'clientes', fk: 'cliente_id' } },
  pagamentos: { eventos: { tabela: 'eventos', fk: 'evento_id' } },
  contratos: { eventos: { tabela: 'eventos', fk: 'evento_id' } },
  anexos: { eventos: { tabela: 'eventos', fk: 'evento_id' } },
  funcionario_pagamentos: { funcionarios: { tabela: 'funcionarios', fk: 'funcionario_id' } },
};

const TABELAS_COM_UPDATED_AT = new Set(['clientes', 'eventos', 'acervo_itens', 'empresa_config', 'perfis_usuario']);

/* ==========================================================================
   5) PARSER DO "SELECT" (suporta relações aninhadas: a(b, c(d))
   ========================================================================== */
function splitTopLevel(str, sep) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === sep && depth === 0) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function parseSelect(str) {
  const campos = splitTopLevel(str || '*', ',');
  const colunas = [];
  const relacoes = [];
  for (const campo of campos) {
    const m = campo.match(/^(\w+)(!inner)?\((.*)\)$/s);
    if (m) relacoes.push({ nome: m[1], sub: parseSelect(m[3]) });
    else if (campo) colunas.push(campo);
  }
  return { colunas, relacoes };
}
function projetarLinha(tabela, linhaCompleta, embutidos, parsed) {
  const saida = {};
  if (parsed.colunas.includes('*')) Object.assign(saida, linhaCompleta);
  else for (const c of parsed.colunas) saida[c] = linhaCompleta[c];
  for (const rel of parsed.relacoes) {
    const paiCompleto = embutidos[rel.nome];
    const tabelaPai = RELACOES[tabela]?.[rel.nome]?.tabela;
    saida[rel.nome] = paiCompleto ? projetarLinha(tabelaPai, paiCompleto, resolverEmbutidos(tabelaPai, paiCompleto), rel.sub) : null;
  }
  return saida;
}
/** Resolve os relacionamentos muitos-para-um de uma linha (para filtro e projeção). */
function resolverEmbutidos(tabela, linha) {
  const relsDaTabela = RELACOES[tabela] || {};
  const embutidos = {};
  for (const nomeRel of Object.keys(relsDaTabela)) {
    const { tabela: tabelaPai, fk } = relsDaTabela[nomeRel];
    const valorFk = linha[fk];
    embutidos[nomeRel] = Store.table(tabelaPai).find((r) => r.id === valorFk) || null;
  }
  return embutidos;
}

/* ==========================================================================
   6) FILTROS (equivalentes aos operadores do PostgREST usados no sistema)
   ========================================================================== */
function pegarValorCampo(linha, embutidos, campo) {
  if (campo.includes('->>')) {
    const [col, chave] = campo.split('->>');
    const base = col in embutidos ? embutidos[col] : linha[col];
    return base ? base[chave] : undefined;
  }
  if (campo.includes('.')) {
    const [relNome, sub] = campo.split('.');
    const embutido = embutidos[relNome];
    return embutido ? embutido[sub] : undefined;
  }
  return linha[campo];
}
function comparar(a, b, op) {
  if (a === null || a === undefined) return op === 'neq' ? b != null : false;
  switch (op) {
    case 'eq': return a === b;
    case 'neq': return a !== b;
    case 'gt': return a > b;
    case 'gte': return a >= b;
    case 'lt': return a < b;
    case 'lte': return a <= b;
    default: return true;
  }
}
function combinarLike(valor, padrao) {
  if (valor === null || valor === undefined) return false;
  const regexStr = '^' + padrao
    .toString()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/%/g, '.*') + '$';
  return new RegExp(regexStr, 'i').test(String(valor));
}
function aplicarClausula(linha, embutidos, campo, op, valor) {
  const atual = pegarValorCampo(linha, embutidos, campo);
  switch (op) {
    case 'eq': case 'neq': case 'gt': case 'gte': case 'lt': case 'lte':
      return comparar(atual, valor, op);
    case 'ilike': case 'like':
      return combinarLike(atual, valor);
    case 'in':
      return Array.isArray(valor) ? valor.includes(atual) : false;
    case 'contains':
      return Array.isArray(atual) && Array.isArray(valor) ? valor.every((v) => atual.includes(v)) : false;
    case 'not_in': {
      const lista = String(valor).replace(/^\(|\)$/g, '').split(',');
      return !lista.includes(atual);
    }
    default:
      return true;
  }
}

/* ==========================================================================
   7) REGRAS DE NEGÓCIO (equivalentes às triggers do banco original)
   ========================================================================== */
function recalcularFinanceiroEvento(eventoId) {
  const eventos = Store.table('eventos');
  const evento = eventos.find((e) => e.id === eventoId);
  if (!evento) return;
  const recebido = Store.table('pagamentos')
    .filter((p) => p.evento_id === eventoId)
    .reduce((soma, p) => soma + Number(p.valor), 0);
  evento.quitado_em = recebido >= evento.valor_orcamento && evento.valor_orcamento > 0 ? (evento.quitado_em || nowIso()) : null;
}
function aplicarStatusAposPagamento(eventoId) {
  const evento = Store.table('eventos').find((e) => e.id === eventoId);
  if (!evento) return;
  const recebido = Store.table('pagamentos')
    .filter((p) => p.evento_id === eventoId)
    .reduce((soma, p) => soma + Number(p.valor), 0);
  if (evento.status === 'orcamento' && recebido > 0) evento.status = 'confirmado';
  if (evento.status === 'concluido' && evento.valor_orcamento > 0 && recebido >= evento.valor_orcamento) evento.status = 'finalizado';
}
function validarSaldoPagamento(eventoId, valorNovo) {
  const evento = Store.table('eventos').find((e) => e.id === eventoId);
  if (!evento) return null;
  const recebidoAtual = Store.table('pagamentos')
    .filter((p) => p.evento_id === eventoId)
    .reduce((soma, p) => soma + Number(p.valor), 0);
  if (recebidoAtual + Number(valorNovo) > Number(evento.valor_orcamento) + 0.01) {
    return 'O valor do pagamento excede o saldo restante do orçamento deste evento.';
  }
  return null;
}

/* ==========================================================================
   8) QUERY BUILDER — imita a API encadeável do supabase-js
   ========================================================================== */
class MockQueryBuilder {
  constructor(tabela, modo) {
    this._tabela = tabela;
    this._modo = modo; // 'select' | 'insert' | 'update' | 'delete'
    this._filtros = [];
    this._ordens = [];
    this._limite = null;
    this._selectStr = '*';
    this._single = null; // 'single' | 'maybe'
    this._payload = null;
    this._count = null;
    this._head = false;
    this._quisSelectAposEscrita = false;
  }

  select(colunas, opts) {
    this._selectStr = colunas || '*';
    if (this._modo !== 'select') this._quisSelectAposEscrita = true;
    if (opts) { this._count = opts.count || null; this._head = !!opts.head; }
    return this;
  }
  insert(payload) { this._payload = payload; return this; }
  update(payload) { this._payload = payload; return this; }
  delete() { return this; }

  eq(c, v) { this._filtros.push(['eq', c, v]); return this; }
  neq(c, v) { this._filtros.push(['neq', c, v]); return this; }
  gt(c, v) { this._filtros.push(['gt', c, v]); return this; }
  gte(c, v) { this._filtros.push(['gte', c, v]); return this; }
  lt(c, v) { this._filtros.push(['lt', c, v]); return this; }
  lte(c, v) { this._filtros.push(['lte', c, v]); return this; }
  in(c, v) { this._filtros.push(['in', c, v]); return this; }
  ilike(c, v) { this._filtros.push(['ilike', c, v]); return this; }
  like(c, v) { this._filtros.push(['ilike', c, v]); return this; }
  contains(c, v) { this._filtros.push(['contains', c, v]); return this; }
  not(c, op, v) { this._filtros.push([op === 'in' ? 'not_in' : `not_${op}`, c, v]); return this; }
  or(expr) { this._filtros.push(['or', null, expr]); return this; }

  order(coluna, opts) { this._ordens.push({ coluna, asc: opts?.ascending !== false }); return this; }
  limit(n) { this._limite = n; return this; }
  single() { this._single = 'single'; return this; }
  maybeSingle() { this._single = 'maybe'; return this; }

  _passaFiltros(linha, embutidos) {
    for (const [op, campo, valor] of this._filtros) {
      if (op === 'or') {
        const clausulas = String(valor).split(',');
        const algumaBateu = clausulas.some((cl) => {
          const partes = cl.split('.');
          const c = partes[0];
          const o = partes[1];
          const v = partes.slice(2).join('.');
          return aplicarClausula(linha, embutidos, c, o, v);
        });
        if (!algumaBateu) return false;
        continue;
      }
      if (!aplicarClausula(linha, embutidos, campo, op, valor)) return false;
    }
    return true;
  }

  async _executarSelect() {
    const parsed = parseSelect(this._selectStr);
    let linhas = this._tabela === 'v_eventos_financeiro' ? construirViewFinanceiro() : [...Store.table(this._tabela)];

    linhas = linhas
      .map((linha) => ({ linha, embutidos: resolverEmbutidos(this._tabela, linha) }))
      .filter(({ linha, embutidos }) => this._passaFiltros(linha, embutidos));

    for (const { coluna, asc } of [...this._ordens].reverse()) {
      linhas.sort((a, b) => {
        const va = a.linha[coluna]; const vb = b.linha[coluna];
        if (va === vb) return 0;
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        return (va > vb ? 1 : -1) * (asc ? 1 : -1);
      });
    }

    const total = linhas.length;
    if (this._limite != null) linhas = linhas.slice(0, this._limite);

    const dados = this._head
      ? null
      : linhas.map(({ linha, embutidos }) => projetarLinha(this._tabela, linha, embutidos, parsed));

    if (this._single === 'single') {
      if (!dados || dados.length === 0) return { data: null, error: { message: 'Nenhum registro encontrado.' } };
      return { data: dados[0], error: null, count: this._count ? total : undefined };
    }
    if (this._single === 'maybe') {
      return { data: dados && dados.length ? dados[0] : null, error: null, count: this._count ? total : undefined };
    }
    return { data: dados, error: null, count: this._count ? total : undefined };
  }

  async _executarInsert() {
    const linhasNovas = Array.isArray(this._payload) ? this._payload : [this._payload];
    const criadas = [];
    for (const dados of linhasNovas) {
      if (this._tabela === 'pagamentos') {
        const erro = validarSaldoPagamento(dados.evento_id, dados.valor);
        if (erro) return { data: null, error: { message: erro } };
      }
      if (this._tabela === 'bloqueios_agenda') {
        const jaExiste = Store.table('bloqueios_agenda').some((b) => b.data === dados.data);
        if (jaExiste) return { data: null, error: { message: 'Já existe um bloqueio cadastrado para esta data.' } };
      }
      const linha = { id: dados.id || uid(), ...dados };
      if (this._tabela === 'contratos') linha.gerado_em = linha.gerado_em || nowIso();
      else linha.created_at = linha.created_at || nowIso();
      if (TABELAS_COM_UPDATED_AT.has(this._tabela)) linha.updated_at = nowIso();
      Store.table(this._tabela).push(linha);
      criadas.push(linha);

      if (this._tabela === 'pagamentos') {
        recalcularFinanceiroEvento(dados.evento_id);
        aplicarStatusAposPagamento(dados.evento_id);
      }
    }
    Store.save();

    if (!this._quisSelectAposEscrita) return { data: null, error: null };
    const parsed = parseSelect(this._selectStr);
    const projetadas = criadas.map((l) => projetarLinha(this._tabela, l, resolverEmbutidos(this._tabela, l), parsed));
    if (this._single === 'single') return { data: projetadas[0] || null, error: null };
    return { data: projetadas, error: null };
  }

  async _executarUpdate() {
    const linhas = Store.table(this._tabela);
    const afetadas = linhas.filter((linha) => this._passaFiltros(linha, resolverEmbutidos(this._tabela, linha)));
    for (const linha of afetadas) {
      Object.assign(linha, this._payload);
      if (TABELAS_COM_UPDATED_AT.has(this._tabela)) linha.updated_at = nowIso();
    }
    Store.save();

    if (!this._quisSelectAposEscrita) return { data: null, error: null };
    const parsed = parseSelect(this._selectStr);
    const projetadas = afetadas.map((l) => projetarLinha(this._tabela, l, resolverEmbutidos(this._tabela, l), parsed));
    if (this._single === 'single') return { data: projetadas[0] || null, error: null };
    return { data: projetadas, error: null };
  }

  async _executarDelete() {
    const linhas = Store.table(this._tabela);
    const idsRemovidos = linhas
      .filter((linha) => this._passaFiltros(linha, resolverEmbutidos(this._tabela, linha)))
      .map((l) => l.id);

    Store.setTable(this._tabela, linhas.filter((l) => !idsRemovidos.includes(l.id)));

    // "on delete cascade" — replica o comportamento do schema original
    if (this._tabela === 'eventos') {
      for (const filha of ['pagamentos', 'contratos', 'anexos']) {
        Store.setTable(filha, Store.table(filha).filter((r) => !idsRemovidos.includes(r.evento_id)));
      }
    }
    Store.save();
    return { data: null, error: null };
  }

  then(resolve, reject) {
    const promessa = (async () => {
      if (this._modo === 'select') return this._executarSelect();
      if (this._modo === 'insert') return this._executarInsert();
      if (this._modo === 'update') return this._executarUpdate();
      return this._executarDelete();
    })();
    return promessa.then(resolve, reject);
  }
}

function construirViewFinanceiro() {
  const pagamentos = Store.table('pagamentos');
  return Store.table('eventos').map((e) => {
    const recebido = pagamentos.filter((p) => p.evento_id === e.id).reduce((s, p) => s + Number(p.valor), 0);
    const restante = Number(e.valor_orcamento) - recebido;
    let status_pagamento = 'pendente';
    if (recebido > 0 && recebido < e.valor_orcamento) status_pagamento = 'parcial';
    if (e.valor_orcamento > 0 && recebido >= e.valor_orcamento) status_pagamento = 'quitado';
    return {
      evento_id: e.id,
      valor_orcamento: e.valor_orcamento,
      valor_recebido: recebido,
      valor_restante: restante,
      status_pagamento,
      status: e.status,
      data: e.data,
      tipo_evento: e.tipo_evento,
      cliente_id: e.cliente_id,
    };
  });
}

function mockFrom(tabela) {
  return {
    select: (colunas, opts) => new MockQueryBuilder(tabela, 'select').select(colunas, opts),
    insert: (payload) => new MockQueryBuilder(tabela, 'insert').insert(payload),
    update: (payload) => new MockQueryBuilder(tabela, 'update').update(payload),
    delete: () => new MockQueryBuilder(tabela, 'delete').delete(),
  };
}

/* ==========================================================================
   9) STORAGE simulado — arquivos viram data: URL guardadas no navegador
   ========================================================================== */
const LIMITE_ARQUIVO_BYTES = 900 * 1024; // ~900KB: mantém o localStorage saudável na demo

function carregarArquivos() {
  try { return JSON.parse(localStorage.getItem(FILES_KEY) || '{}'); } catch { return {}; }
}
function salvarArquivos(mapa) {
  try { localStorage.setItem(FILES_KEY, JSON.stringify(mapa)); } catch (e) { /* quota cheia: ignora */ }
}
function arquivoParaDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const mockStorage = {
  from(bucket) {
    return {
      async upload(caminho, file) {
        if (file && file.size > LIMITE_ARQUIVO_BYTES) {
          return { data: null, error: { message: 'Nesta demonstração, arquivos maiores que 900KB não são aceitos (o armazenamento é só o do seu navegador).' } };
        }
        try {
          const dataUrl = file instanceof Blob ? await arquivoParaDataUrl(file) : String(file);
          const mapa = carregarArquivos();
          mapa[`${bucket}/${caminho}`] = dataUrl;
          salvarArquivos(mapa);
          return { data: { path: caminho }, error: null };
        } catch (e) {
          return { data: null, error: { message: 'Não foi possível guardar o arquivo neste navegador.' } };
        }
      },
      getPublicUrl(caminho) {
        const mapa = carregarArquivos();
        return { data: { publicUrl: mapa[`${bucket}/${caminho}`] || '../assets/logo-encanto.png' } };
      },
      async createSignedUrl(caminho) {
        const mapa = carregarArquivos();
        const url = mapa[`${bucket}/${caminho}`];
        if (!url) return { data: null, error: { message: 'Arquivo não encontrado (nesta demo, arquivos ficam salvos só no seu navegador).' } };
        return { data: { signedUrl: url }, error: null };
      },
      async remove(caminhos) {
        const mapa = carregarArquivos();
        (Array.isArray(caminhos) ? caminhos : [caminhos]).forEach((c) => { delete mapa[`${bucket}/${c}`]; });
        salvarArquivos(mapa);
        return { data: [], error: null };
      },
      async list() { return { data: [], error: null }; },
    };
  },
};

/* ==========================================================================
   10) AUTH simulado — sessão guardada em sessionStorage (como no original)
   ========================================================================== */
const ouvintesAuth = [];
function lerSessao() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
function gravarSessao(sessao) {
  try {
    if (sessao) sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessao));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch (e) { /* ignora */ }
}
function notificarAuth(evento) {
  ouvintesAuth.forEach((cb) => { try { cb(evento); } catch (e) { /* ignora erro de listener */ } });
}

const mockAuth = {
  async signInWithPassword({ email, password }) {
    // Nesta demo, qualquer e-mail/senha entra (como visitante, no perfil de administradora) —
    // os dois botões de acesso rápido continuam logando com o perfil exato de cada um.
    const usuario = USUARIOS_DEMO.find((u) => u.email.toLowerCase() === String(email).toLowerCase() && u.senha === password)
      || (email && password ? USUARIOS_DEMO[0] : null);
    if (!usuario) return { data: { session: null, user: null }, error: { message: 'Invalid login credentials' } };
    const sessao = {
      access_token: `demo-token-${usuario.id}`,
      user: { id: usuario.id, email: usuario.email },
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    };
    gravarSessao(sessao);
    notificarAuth('SIGNED_IN');
    return { data: { session: sessao, user: sessao.user }, error: null };
  },
  async signOut() {
    gravarSessao(null);
    notificarAuth('SIGNED_OUT');
    return { error: null };
  },
  async getSession() {
    return { data: { session: lerSessao() }, error: null };
  },
  async getUser() {
    const sessao = lerSessao();
    return { data: { user: sessao ? sessao.user : null }, error: null };
  },
  async resetPasswordForEmail() {
    // Não há servidor de e-mail nesta demo: simula sucesso sem enviar nada de verdade.
    return { data: {}, error: null };
  },
  async updateUser() {
    return { data: {}, error: null };
  },
  onAuthStateChange(callback) {
    ouvintesAuth.push(callback);
    return { data: { subscription: { unsubscribe() { const i = ouvintesAuth.indexOf(callback); if (i >= 0) ouvintesAuth.splice(i, 1); } } } };
  },
};

/* ==========================================================================
   11) INTERCEPTAÇÃO DE fetch('/api/...') — substitui as funções serverless
   (Mercado Pago, Google Agenda, importação com IA) por respostas simuladas,
   já que a demo não tem servidor nem chaves reais configuradas.
   ========================================================================== */
function instalarInterceptorApi() {
  if (window.__encantoFetchPatched) return;
  window.__encantoFetchPatched = true;
  const fetchOriginal = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input.url;

    if (url.includes('/api/importar-conversa')) {
      return respostaJson({
        itens: [],
        aviso: 'A importação por IA (Gemini) não está disponível nesta demonstração, pois depende de uma chave de API paga e de uma função de servidor. Preencha o evento manualmente na tela de Eventos.',
      });
    }
    if (url.includes('/api/google-agenda-sync')) {
      return respostaJson({ ok: false, motivo: 'Integração com Google Agenda desativada nesta demonstração.' });
    }
    if (url.includes('/api/google-agenda-status')) {
      return respostaJson({ conectado: false });
    }
    if (url.includes('/api/google-agenda-conectar') || url.includes('/api/google-agenda-desconectar') || url.includes('/api/google-agenda-sincronizar-tudo')) {
      return respostaJson({ ok: false, motivo: 'Integração com Google Agenda desativada nesta demonstração.' });
    }
    if (url.includes('/api/criar-cobranca')) {
      return respostaJson({
        ok: false,
        erro: 'Cobrança via Mercado Pago desativada nesta demonstração (exige credenciais reais). Registre o pagamento manualmente na tela Financeiro.',
      });
    }

    return fetchOriginal(input, init);
  };
}
function respostaJson(objeto) {
  return new Response(JSON.stringify(objeto), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
instalarInterceptorApi();

/* ==========================================================================
   EXPORTS — mesma superfície pública do js/lib/supabase-client.js original
   ========================================================================== */
export const supabase = {
  from: mockFrom,
  storage: mockStorage,
  auth: mockAuth,
};

export async function cabecalhoAutenticado() {
  const { data } = await supabase.auth.getSession();
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}
