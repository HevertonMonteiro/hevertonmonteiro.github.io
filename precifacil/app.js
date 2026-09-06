/* ==========================================================================
   ESTADO GLOBAL
   ========================================================================== */
const state = {
  selectedState: null,               // 'PE', 'BA', 'SE', 'AL', 'RN' ou 'PB'
  selectedStateLabel: null,
  tables: { t1: null, t2: null, t3: null },   // dados do estado atual (aponta pra TABLES_BY_STATE[selectedState])
  selectedTableKey: null,           // 't1', 't2' ou 't3'
  selectedTableName: null,
  mode: null,                       // 'A' (consultar) ou 'B' (pedido)
  parsedLines: [],                  // itens digitados nesta rodada
  results: { found: [], notFound: [], ambiguous: [] },
  ambiguousChoices: {},             // idx -> item escolhido
  lastFoundForOrder: [],            // usado ao gerar pedido a partir do modo A
  qtyListBoxMode: {},               // índice -> true se a quantidade atual veio só de cliques em "CX" (tela "Confirme as quantidades")
  copyTargets: {},                  // textos prontos para copiar, por id de botão
  pickingForBrowse: false,          // true na tela de escolher tabela do fluxo "Fazer pedido"
  pickingForOfertas: false,         // true na tela de escolher tabela do fluxo "Gerar lista de ofertas"
  browseQty: {},                    // ean -> quantidade, usado no fluxo "Fazer pedido"
  browseBoxMode: {},                // ean -> true se a quantidade atual veio só de cliques em "CX" (pode empilhar mais uma caixa)
  browseSearch: '',
  browseCategory: '',
  browseSpecial: '',                // filtro por selo especial (Controlado/Antibiótico/...) no fluxo "Fazer pedido"
  browseOnlyWithQty: false,         // filtro "só com quantidade" no fluxo "Fazer pedido"
  fromBrowse: false,                // true quando o pedido veio do fluxo "Fazer pedido" (navegando o catálogo)
  ofertasCategoria: null,           // categoria escolhida na última lista de ofertas gerada
  ofertasItens: []                  // itens sorteados na última lista de ofertas
};

const TABELAS_FILE = 'TABELAS.xlsx';
const TABLE_LABELS = { t1: 'Tabela 1', t2: 'Tabela 2', t3: 'Tabela 3' };
const LOCKED_TABLES = { t3: 'Uso permitido apenas em eventos e feiras.' };
// cada estado tem sua própria aba "01/02/03 <UF> NOVAFARMA" dentro do mesmo
// TABELAS.xlsx - mais estados podem ser acrescentados aqui quando chegarem
// (a aba correspondente precisa existir na planilha antes)
const STATES = {
  AL: 'Alagoas',
  BA: 'Bahia',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  RN: 'Rio Grande do Norte',
  SE: 'Sergipe'
};
function stateSheetName(tableKey, stateCode) {
  return '0' + tableKey.slice(1) + ' ' + stateCode + ' NOVAFARMA';
}
const TABLES_BY_STATE = {}; // stateCode -> { t1, t2, t3 } (dados já carregados/parseados)

/* ==========================================================================
   NORMALIZAÇÃO E MATCHING (dosagem estrita + nome aproximado)
   ========================================================================== */
// variações/abreviações de substância que aparecem na própria tabela ou no
// jeito que o cliente escreve, apontando pro mesmo nome "canônico". Diferente
// do BRAND_ALIASES (marca comercial -> genérico), isso serve para unificar
// grafias diferentes da MESMA substância genérica (ex: a tabela às vezes usa
// "OLMES MEDOXOMILA", às vezes "OLMESARTANA", às vezes "OLM.MED" abreviado
// dentro de um combinado). Heverton pode acrescentar mais linhas aqui conforme
// aparecerem outros casos parecidos.
const SUBSTANCE_ALIASES = [
  [/\bOLME\b/g, 'OLMESARTANA'],
  [/\bOLMES\s+MEDOXOMILA\b/g, 'OLMESARTANA'],
  [/\bOLM\.?\s*MED\b/g, 'OLMESARTANA'],
  [/\bOLMERSARTANA\b/g, 'OLMESARTANA'],
  [/\bHIDROCLOROTIAZIDA\b/g, 'HCTZ'],
  // erros de digitação conhecidos e comuns nas listas de clientes -
  // Heverton pode ir acrescentando mais linhas aqui conforme aparecerem
  [/\bESOMEPRRAZOL\b/g, 'ESOMEPRAZOL'],
  [/\bESOMEPRASOL\b/g, 'ESOMEPRAZOL'],
  [/\bESOMEPAZOL\b/g, 'ESOMEPRAZOL'],
  [/\bATORVASTINA\b/g, 'ATORVASTATINA'],
  [/\bHIDROXISINA\b/g, 'HIDROXIZINA'],
  [/\bPANTOPRAZOU\b/g, 'PANTOPRAZOL'],
  // Amoxicilina + Clavulanato: a tabela usa "CLAVU"/"CLAV" abreviado, então
  // qualquer jeito de escrever "clavulanato" precisa apontar pra isso -
  // inclui erros comuns de digitação e a abreviação popular "calv" (letras
  // trocadas em relação a "clav")
  [/\bCLAVULANATO\b/g, 'CLAVU'],
  [/\bCLAVULANICO\b/g, 'CLAVU'],
  [/\bCLABULANATO\b/g, 'CLAVU'],
  [/\bCLAVULATO\b/g, 'CLAVU'],
  [/\bCALV\b/g, 'CLAVU'],
  [/\bCLAB\b/g, 'CLAVU'],
  [/\bCLAVU?LIN\b/g, 'CLAVU'], // "clavulin" é marca comercial bem conhecida
  [/\bAMOXILINA\b/g, 'AMOXICILINA'],
  [/\bAMOXCILINA\b/g, 'AMOXICILINA'],
  [/\bAMOCICILINA\b/g, 'AMOXICILINA'],
  [/\bAMOXILICINA\b/g, 'AMOXICILINA'],
  [/\bAMORXICILINA\b/g, 'AMOXICILINA'],
  [/\bAMOXACILINA\b/g, 'AMOXICILINA'],
  [/\bAMOR\b/g, 'AMOXICILINA']
];
// erros de digitação comuns na forma farmacêutica - "comprimido" é uma das
// palavras mais digitadas errado nas listas de clientes
const FORM_TYPO_FIX = [
  [/\bCOMPIMIDO(S)?\b/g, 'COMPRIMIDO$1'],
  [/\bCOMPRIDO(S)?\b/g, 'COMPRIMIDO$1'],
  [/\bCONPRIMIDO(S)?\b/g, 'COMPRIMIDO$1']
];
// sais/ésteres farmacêuticos que normalmente só descrevem a mesma substância
// (ex: "cloridrato de tramadol" = "tramadol"), então são removidos como
// palavra pra não atrapalhar (nem ajudar artificialmente) a comparação de
// nome. NÃO inclui "sódico"/"potássico"/"potássio": na nossa tabela esses
// às vezes diferenciam produtos que são fisicamente diferentes (ex:
// diclofenaco sódico comprimido x diclofenaco dietilamônio gel), então
// removê-los desses casos poderia esconder uma troca de forma/via perigosa.
const SALT_WORDS = new Set([
  'CLORIDRATO','CLOR','MALEATO','OXALATO','HEMIFUMARATO','HEMIFUM','HEMIF',
  'BISSULFATO','DICLORIDRATO','SUCCINATO','BESILATO','MONOIDRATADO','MONOIDR',
  'CALCICA','CALCICO','MAGNESICO'
]);
function normalize(str) {
  let s = str.toString().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/,/g, '.')
    .replace(/\\/g, '/'); // "c\6" e "c/6" são a mesma notação de embalagem
  // separa quantidade de embalagem colada na forma farmacêutica, ex:
  // "30cp" -> "30 cp", "30cpr" -> "30 cpr", "30comp" -> "30 comp"
  s = s.replace(/(\d)(CPR|CP|COMP|ENV|CAPS|CAP|AMP)\b/g, '$1 $2');
  // separa número de dosagem colado direto na notação de embalagem, ex:
  // "20c/28" -> "20 c/28" (senão o "20" fica preso dentro de um token sem
  // sentido e nunca é reconhecido como a dosagem 20mg)
  s = s.replace(/(\d)(C\/?\d)/g, '$1 $2');
  SUBSTANCE_ALIASES.forEach(([re, repl]) => { s = s.replace(re, repl); });
  FORM_TYPO_FIX.forEach(([re, repl]) => { s = s.replace(re, repl); });
  // expande dosagens combinadas tipo "40+25MG" -> "40MG 25MG" (precisa acontecer
  // ANTES do "+" virar espaço, senão perdemos a unidade do primeiro componente).
  // Duas variantes: unidade colada no número (aceita qualquer coisa depois, ex:
  // "12,5MGCP") ou unidade com espaço antes (só se não vier seguida de letra
  // maiúscula colada, pra não confundir "2 GEL" com "2 gramas").
  s = s.replace(
    /(\d+(?:\.\d+)?(?:\s*\+\s*\d+(?:\.\d+)?)+)(MG|ML|MCG|UI|G|L)|(\d+(?:\.\d+)?(?:\s*\+\s*\d+(?:\.\d+)?)+)\s+(MG|ML|MCG|UI|G|L)(?![A-Z])/g,
    (match, nums1, unit1, nums2, unit2) => {
      const nums = nums1 !== undefined ? nums1 : nums2;
      const unit = unit1 !== undefined ? unit1 : unit2;
      return nums.split('+').map(n => n.trim() + unit).join(' ');
    });
  s = s.replace(/[^A-Z0-9\s\/\.\,]/g, ' ').replace(/\s+/g, ' ').trim();
  return s;
}

// dicionário de formas farmacêuticas: abreviações comuns -> tag canônica.
// Se o cliente pede uma forma específica (ex: "gts"=gotas), o item tem que
// bater com essa forma; se o item claramente for outra forma (ex: creme),
// é tratado como produto diferente, não um "quase igual".
const FORM_LOOKUP = {
  CREM:'FORMACREME', CREME:'FORMACREME', CR:'FORMACREME', CREMES:'FORMACREME',
  POM:'FORMAPOMADA', POMADA:'FORMAPOMADA', PO:'FORMAPOMADA', POMADAS:'FORMAPOMADA',
  GTS:'FORMAGOTAS', GT:'FORMAGOTAS', GOTAS:'FORMAGOTAS', GOTA:'FORMAGOTAS',
  XPE:'FORMAXAROPE', XPEAD:'FORMAXAROPE', XPEINF:'FORMAXAROPE', XAROPE:'FORMAXAROPE', XAROPES:'FORMAXAROPE',
  INJ:'FORMAINJETAVEL', AMP:'FORMAINJETAVEL', AMPOLA:'FORMAINJETAVEL', AMPOLAS:'FORMAINJETAVEL',
  SHP:'FORMASHAMPOO', SHAMPOO:'FORMASHAMPOO',
  VAG:'FORMAVAGINAL', VAGINAL:'FORMAVAGINAL', VG:'FORMAVAGINAL',
  CP:'FORMACOMPRIMIDO', CPR:'FORMACOMPRIMIDO', COMP:'FORMACOMPRIMIDO', COM:'FORMACOMPRIMIDO', COMPRIMIDO:'FORMACOMPRIMIDO', COMPRIMIDOS:'FORMACOMPRIMIDO', REVESTIDO:'FORMACOMPRIMIDO', REVESTIDOS:'FORMACOMPRIMIDO', REV:'FORMACOMPRIMIDO',
  CAPS:'FORMACAPSULA', CAP:'FORMACAPSULA', CAPSULA:'FORMACAPSULA', CAPSULAS:'FORMACAPSULA',
  SUSP:'FORMASUSPENSAO', SUSPENSAO:'FORMASUSPENSAO', SUS:'FORMASUSPENSAO',
  SOL:'FORMASOLUCAO', SOLUCAO:'FORMASOLUCAO', TOP:'FORMATOPICA',
  GEL:'FORMAGEL',
  FR:'FORMAFRASCO', FRASCO:'FORMAFRASCO',
  BG:'FORMABISNAGA', BISN:'FORMABISNAGA', BISNAGA:'FORMABISNAGA', BIS:'FORMABISNAGA',
  APL:'FORMAAPLICADOR', APLI:'FORMAAPLICADOR', APLICADOR:'FORMAAPLICADOR',
  COLIRIO:'FORMAOFTALMICO', OFT:'FORMAOFTALMICO', OFTALMICO:'FORMAOFTALMICO',
  OROBASE:'FORMAPOMADA',
  ENV:'FORMAENVELOPE', SACHE:'FORMAENVELOPE', ENVELOPE:'FORMAENVELOPE'
};
const FORM_TAGS = new Set(Object.values(FORM_LOOKUP));

// pequeno dicionário de nomes comerciais/populares -> termos genéricos,
// para quando o cliente manda o nome de marca em vez do genérico.
// Heverton pode ir adicionando mais entradas aqui conforme aparecerem.
const BRAND_ALIASES = {
  QUADRIDERME: 'betametasona gentamicina tolnaftato clioquinol',
  AUGMENTIN: 'amoxicilina clavulanato'
};
function expandBrandAliases(line) {
  let out = line;
  for (const brand in BRAND_ALIASES) {
    const re = new RegExp('\\b' + brand + '\\b', 'i');
    if (re.test(out)) out = out.replace(re, BRAND_ALIASES[brand]);
  }
  return out;
}
function extractDosageTokens(str) {
  const s = normalize(str);
  // mesma lógica de duas variantes da expansão de combos acima: colada
  // (aceita qualquer coisa depois) ou com espaço (não pode vir seguida de
  // letra maiúscula colada, evita casar o "G" de "GEL" por coincidência).
  const re = /(\d+(?:\.\d+)?)(MG|ML|MCG|UI|G|L)|(\d+(?:\.\d+)?)\s+(MG|ML|MCG|UI|G|L)(?![A-Z])/g;
  const tokens = []; let m;
  while ((m = re.exec(s)) !== null) {
    const num = m[1] !== undefined ? m[1] : m[3];
    const unit = m[2] !== undefined ? m[2] : m[4];
    tokens.push(parseFloat(num) + unit);
  }
  return tokens;
}
// remove ocorrências de dosagem com unidade (mesma lógica de extractDosageTokens,
// só que devolvendo o texto sem elas em vez da lista de tokens)
function removeDosageWithUnit(s) {
  return s.replace(/(\d+(?:\.\d+)?)(MG|ML|MCG|UI|G|L)|(\d+(?:\.\d+)?)\s+(MG|ML|MCG|UI|G|L)(?![A-Z])/g, ' ');
}
// lê a quantidade de embalagem "C/30", "C30" (contagem de comprimidos/etc);
// usado pra detectar quando o cliente pede uma embalagem que não existe
// (ex: "c/28" quando só tem "c/30") - nesse caso o item ainda é sugerido,
// mas sempre com confirmação, nunca decidido sozinho
function extractPackCount(str) {
  const s = normalize(str);
  const m = s.match(/\bC\/?\s?(\d+)\b/) || s.match(/\bX\s+(\d+)\b/);
  return m ? parseInt(m[1], 10) : null;
}
function looseNumbers(str) {
  const s = normalize(str);
  let withoutUnit = removeDosageWithUnit(s);
  // remove notação de embalagem "C/30", "C/ 30" (contagem de comprimidos, não é dosagem)
  withoutUnit = withoutUnit.replace(/\bC\/?\s?\d+\b/g, ' ');
  const re = /\b(\d+(?:\.\d+)?)\b/g;
  const nums = []; let m;
  while ((m = re.exec(withoutUnit)) !== null) nums.push(parseFloat(m[1]));
  return nums;
}
function nameTokens(str) {
  const s = normalize(str);
  let withoutDosage = removeDosageWithUnit(s);
  // separa abreviações grudadas por ponto, ex: "CLOR.SERTRALINA" -> "CLOR SERTRALINA"
  withoutDosage = withoutDosage.replace(/\./g, ' ');
  // remove notação de embalagem tipo "C/30", "C/7", "C30" (ruído: varia muito entre itens iguais)
  withoutDosage = withoutDosage.replace(/\bC\/?\s?\d+\b/g, ' ');
  const rawTokens = withoutDosage.split(/\s+/).filter(Boolean);
  // mapeia abreviações de forma farmacêutica (gts/pom/cp/...) para uma tag
  // canônica, assim "gotas" e "gts" viram o mesmo token, e formas diferentes
  // (creme x pomada x gotas) deixam de ser tratadas como "quase iguais"
  const mapped = rawTokens.map(t => FORM_LOOKUP[t] || t);
  return mapped
    .filter(t => t.length >= 3 && !/^[\d.\/]+$/.test(t))
    // remove sal/éster farmacêutico (ex: "cloridrato de tramadol" -> só "tramadol"),
    // já que sozinho ele não diz nada sobre qual produto é
    .filter(t => !SALT_WORDS.has(t));
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length:m+1}, () => new Array(n+1).fill(0));
  for (let i=0;i<=m;i++) dp[i][0]=i;
  for (let j=0;j<=n;j++) dp[0][j]=j;
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
    dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1] + (a[i-1]===b[j-1]?0:1));
  return dp[m][n];
}
function similarity(a, b) {
  if (!a.length && !b.length) return 1;
  return 1 - levenshtein(a,b) / Math.max(a.length, b.length);
}
function bestTokenScore(qToken, itemTokens) {
  let best = 0;
  for (const it of itemTokens) {
    let s;
    if (qToken === it) s = 1;
    else if (it.startsWith(qToken) || qToken.startsWith(it)) {
      const shorter = Math.min(qToken.length, it.length), longer = Math.max(qToken.length, it.length);
      s = 0.75 + 0.25 * (shorter/longer);
    } else {
      s = similarity(qToken, it);
      if (s < 0.84) s = 0; // limiar alto: evita trocar princípio ativo por outro parecido
    }
    if (s > best) best = s;
  }
  return best;
}
function tokenSetScore(queryTokens, itemTokens) {
  if (queryTokens.length === 0) return { score: 0, minScore: 1 };
  let sum = 0, min = 1;
  for (const qt of queryTokens) {
    const s = bestTokenScore(qt, itemTokens);
    sum += s;
    if (s < min) min = s;
  }
  return { score: sum / queryTokens.length, minScore: min };
}
function findCandidates(query, qty, data) {
  const queryDosage = extractDosageTokens(query);
  const queryNameTokens = nameTokens(query);
  const queryLooseNums = looseNumbers(query);
  const queryNorm = normalize(query);
  const queryFormTag = queryNameTokens.find(t => FORM_TAGS.has(t));
  const queryPackCount = extractPackCount(query);
  // tokens "substantivos": exclui a forma farmacêutica da média de nome, já
  // que ela por si só não diz nada sobre QUAL remédio é (várias substâncias
  // diferentes existem em "creme", por exemplo) - a forma é tratada à parte
  // como filtro/penalidade, não como evidência de identidade do produto.
  const querySubstantiveTokens = queryNameTokens.filter(t => !FORM_TAGS.has(t));

  let pool = data;
  let dosageFallback = false;
  if (queryDosage.length > 0) {
    const strictPool = data.filter(item => {
      const itemDosage = extractDosageTokens(item.desc);
      return queryDosage.every(qd => itemDosage.includes(qd));
    });
    // só confia no pool estrito se tiver pelo menos um item com semelhança de
    // NOME real com o pedido - senão, a dosagem/embalagem bateu por
    // coincidência num produto completamente diferente (ex: "Clotrimazol
    // 10g" batendo com Aciclovir ou Triancinolona, que também vêm em bisnaga
    // de 10g) e isso não pode bloquear a busca por nome.
    const strictPoolHasNameMatch = strictPool.some(item => {
      const { score } = tokenSetScore(querySubstantiveTokens, nameTokens(item.desc));
      return score >= 0.5;
    });
    if (strictPool.length > 0 && strictPoolHasNameMatch) {
      pool = strictPool;
    } else {
      // nenhum item tem essa dosagem/concentração EXATA cadastrada - pode ser
      // que a tabela não detalhe esse nível (ex: cliente informou "15mg/g" de
      // concentração, mas o item só lista o tamanho da embalagem "30g"). Em
      // vez de desistir na hora, procura pelo nome mesmo assim - mas o
      // resultado sempre vai pra confirmação (nunca decide sozinho quando a
      // dosagem pedida não bate 100% com o que está cadastrado).
      dosageFallback = true;
    }
  }
  if (pool.length === 0) return { status:'not_found', query, qty, topScore: -1 };

  const scored = pool.map(item => {
    const itemTokens = nameTokens(item.desc);
    const { score: tokenScore, minScore } = tokenSetScore(querySubstantiveTokens, itemTokens);
    const sim = similarity(queryNorm, normalize(item.desc));
    let score = tokenScore * 0.75 + sim * 0.25;
    // se existe mais de uma palavra relevante no pedido e uma delas não bateu
    // com nada no item (ex: "diclofenaco RESINATO" vs um item que só tem
    // "diclofenaco dietilamônio"), isso é forte sinal de produto diferente -
    // uma palavra em comum não é o suficiente pra considerar "achado".
    if (querySubstantiveTokens.length > 1 && minScore < 0.35) score -= 0.25;
    // os bônus de dosagem abaixo só valem se o NOME já tem uma correspondência
    // mínima por conta própria - senão, uma coincidência de número (dosagem
    // batendo à toa com outra substância completamente diferente, ex:
    // "Nebivolol 2,5mg" x "Levanlodipino 2,50mg") poderia sozinha empurrar um
    // item errado pra cima do limiar de "achado".
    const hasNameSupport = tokenScore >= 0.5;
    // dosagem com unidade explícita que bateu no filtro estrito (ex: "40mg")
    // é um sinal tão forte quanto - ou mais forte que - o bônus de número
    // solto abaixo; sem isso, uma interpretação de linha mal escolhida (com
    // o número certo "sobrando solto" por coincidência) podia pontuar mais
    // alto que a interpretação correta com dosagem batendo exata
    if (queryDosage.length > 0 && !dosageFallback && hasNameSupport) score += 0.20;
    if (queryLooseNums.length > 0) {
      const itemNums = extractDosageTokens(item.desc).map(d => parseFloat(d));
      const allMatch = queryLooseNums.every(n => itemNums.includes(n));
      if (allMatch && hasNameSupport) score += 0.20;
      else if (!allMatch) score -= 0.30;
    }
    // se o cliente pediu uma forma farmacêutica específica (gts, creme, pom...):
    // bate exatamente -> pequeno bônus (desempate contra item sem forma nenhuma);
    // é outra forma explícita -> pequena penalidade, só o suficiente pra perder
    // pra uma opção que bate certinho, SEM derrubar pra "não encontrado" sozinha
    // (ver formConflict abaixo: isso vira uma pergunta de confirmação, não um
    // descarte silencioso - ex: cliente pediu "gel" e só existe "creme");
    // item não diz a forma -> neutro.
    let formConflict = false;
    if (queryFormTag) {
      const itemFormTags = itemTokens.filter(t => FORM_TAGS.has(t));
      if (itemFormTags.includes(queryFormTag)) score += 0.15;
      else if (itemFormTags.length > 0) { score -= 0.15; formConflict = true; }
    }
    // se o cliente pediu uma embalagem específica (ex: "c/4") e bate exatamente
    // com a de algum item, isso ajuda a desempatar entre itens que só diferem
    // no tamanho da caixa (ex: Ivermectina C/4 x C/2, mesma dosagem); se pediu
    // uma contagem e o item só existe em outra, não descarta - sugere o que
    // existe, mas sempre com confirmação (nunca assume que "c/28" e "c/30"
    // são a mesma coisa por conta própria)
    let packConflict = false;
    if (queryPackCount !== null) {
      const itemPackCount = extractPackCount(item.desc);
      if (itemPackCount !== null) {
        if (itemPackCount === queryPackCount) score += 0.15;
        else packConflict = true;
      }
    }
    return { item, score, formConflict, packConflict };
  }).sort((a,b) => b.score - a.score);

  const top = scored[0], second = scored[1];
  if (top.score < 0.45) return { status:'not_found', query, qty, topScore: top.score };
  if (!second || second.score < 0.45 || (top.score - second.score) > 0.12) {
    // achou um vencedor claro, mas a forma pedida não bate com a do item, a
    // dosagem exata não está cadastrada assim na tabela, ou a embalagem
    // pedida não existe - em vez de assumir ou descartar, pergunta pro
    // usuário confirmar (mostra o item real da tabela + opção "não tenho")
    if (top.formConflict || dosageFallback || top.packConflict) {
      return { status:'ambiguous', query, qty, options:[top.item], topScore: top.score };
    }
    return { status:'found', query, qty, item: top.item, score: top.score, topScore: top.score };
  }

  const options = scored.filter(s => s.score >= 0.45 && (top.score - s.score) <= 0.12).slice(0,5).map(s => s.item);
  return { status:'ambiguous', query, qty, options, topScore: top.score };
}

/* ==========================================================================
   PARSING DE LINHAS DIGITADAS
   Aceita formatos livres: "nome dosagem qtd", "qtd nome dosagem",
   "nome qtd", só "nome" (assume qtd=1), etc. Gera candidatos e o melhor
   candidato é escolhido depois, testando contra a tabela (ver processInput).
   ========================================================================== */
function parseLineCandidates(line) {
  line = line.replace(/^[-*•]\s*/, '').replace(/^\d+[\)\.]\s*/, ''); // remove marcadores "- " "1) " "2. "
  line = expandBrandAliases(line); // troca nome de marca conhecido pelo termo genérico
  const tokens = line.split(/\s+/).filter(Boolean);
  // unidades reconhecidas quando aparecem como palavra separada logo depois
  // de um número (ex: "60 mL", "10 g") - nesse caso o número É a dosagem/
  // volume, NUNCA a quantidade do pedido, então não pode nem entrar como
  // candidato. Sem isso, "Nitazoxanida suspensão 60 mL — 12" podia ler
  // "60" como se fosse a quantidade, quando na real é o volume do frasco e
  // "12" é que é quantidade pedida - erro grave (pedido sairia errado).
  const UNIT_WORDS = new Set(['MG','ML','MCG','MCL','UI','G','L','KG']);
  // além do número solto ("23 dipirona"), o cliente às vezes cola a
  // quantidade entre parênteses (ex: cola de volta a lista de preços que o
  // PRECIFÁCIL mandou, com a quantidade anotada no fim: "Pregabalina 75mg C/30
  // — R$ 6,33 (75)") - "(75)" também conta como candidato de quantidade
  const digitIdx = [];
  tokens.forEach((t, i) => {
    const isPlain = /^\d+$/.test(t);
    const isParen = /^\(\d+\)[.,]?$/.test(t);
    if (!isPlain && !isParen) return;
    const nextWord = (tokens[i + 1] || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (isPlain && UNIT_WORDS.has(nextWord)) return; // número é dosagem/volume, não quantidade
    digitIdx.push(i);
  });

  if (digitIdx.length === 0) {
    return [{ name: tokens.join(' '), qty: 1 }];
  }

  const candidates = [];
  const seen = new Set();
  const addCandidate = (qtyIdx, kind) => {
    const qty = parseInt(tokens[qtyIdx].replace(/\D/g, ''), 10);
    const rest = tokens.filter((_, i) => i !== qtyIdx).join(' ');
    const key = qtyIdx + '|' + rest;
    if (!seen.has(key) && rest.length > 0) { seen.add(key); candidates.push({ name: rest, qty, kind }); }
  };

  // tenta: quantidade é o ÚLTIMO número da linha (formato "nome dosagem qtd")
  addCandidate(digitIdx[digitIdx.length - 1], 'last');
  // tenta: quantidade é o PRIMEIRO número da linha (formato "qtd nome dosagem")
  addCandidate(digitIdx[0], 'first');
  // tenta também: o número não é quantidade nenhuma, é parte da dosagem, e a
  // quantidade fica padrão 1 (útil quando o cliente escreve só "remedio 40"
  // querendo dizer "a versão de 40mg", não "quantidade 40"). SÓ faz sentido
  // quando existe um ÚNICO número solto na linha E nenhuma dosagem explícita
  // (com unidade) já presente - com 2+ números soltos, um deles é sempre a
  // quantidade (nunca "o texto todo incluindo os dois números é a dosagem"),
  // evita "Sinvastatina 40mg - 40" ou "Atorvastatina 40 - 40" caírem como
  // quantidade 1 só porque um número bate por coincidência com a dosagem
  if (digitIdx.length === 1 && extractDosageTokens(tokens.join(' ')).length === 0) {
    const keyAsIs = 'asis|' + tokens.join(' ');
    if (!seen.has(keyAsIs)) { seen.add(keyAsIs); candidates.push({ name: tokens.join(' '), qty: 1, kind: 'asis' }); }
  }

  return candidates;
}

/* Escolhe, entre as interpretações possíveis de uma linha (quantidade no
   início, no fim, ou número solto fazendo parte do nome), qual bate com a
   tabela. Em vez de decidir sozinho pela posição do número quando duas
   leituras diferentes da linha são igualmente plausíveis (ex: "20
   esomeprazol 40" pode ser 20un de Esomeprazol 40mg OU 40un de Esomeprazol
   20mg - as duas dosagens existem), junta os resultados de TODAS as
   interpretações e só resolve sozinho quando existe um vencedor claro; senão
   devolve como ambíguo, com cada opção mostrando o item real E a quantidade
   daquela leitura, para o usuário escolher (nunca troca a quantidade ou a
   dosagem pedida por engano). */
function resolveLine(line, data) {
  const candidates = parseLineCandidates(line);
  const evaluated = candidates.map(cand => ({ cand, result: findCandidates(cand.name, cand.qty, data) }));
  const plausible = evaluated.filter(e => e.result.status !== 'not_found');

  if (plausible.length === 0) {
    // nenhuma interpretação bateu em nada - devolve a de maior pontuação
    // mesmo assim, só para aparecer como "quase" na lista de faltas
    let best = evaluated[0];
    for (const e of evaluated) if (e.result.topScore > best.result.topScore) best = e;
    return { raw: line, name: best.cand.name, qty: best.cand.qty, result: best.result };
  }

  // achata cada interpretação plausível em pares (item, quantidade daquela
  // interpretação), pra comparar todas as combinações possíveis juntas -
  // inclusive quando duas leituras diferentes da linha apontam pra remédios
  // ou quantidades diferentes
  const pairs = [];
  const seenPairs = new Set();
  plausible.forEach(({ cand, result }) => {
    const items = result.status === 'found' ? [result.item] : result.options;
    items.forEach(item => {
      const key = item.ean + '|' + cand.qty;
      if (seenPairs.has(key)) return;
      seenPairs.add(key);
      pairs.push({ item, qty: cand.qty, topScore: result.topScore });
    });
  });
  pairs.sort((a, b) => b.topScore - a.topScore);

  const top = pairs[0], second = pairs[1];
  // mesma margem usada dentro de findCandidates pra decidir "achado" x
  // "ambíguo": só resolve sozinho se o vencedor se destaca claramente
  if (!second || (top.topScore - second.topScore) > 0.12) {
    return { raw: line, name: line, qty: top.qty, result: { status: 'found', item: top.item, topScore: top.topScore } };
  }
  const options = pairs.filter(p => (top.topScore - p.topScore) <= 0.12).slice(0, 5).map(p => ({ item: p.item, qty: p.qty }));
  return { raw: line, name: line, qty: top.qty, result: { status: 'ambiguous', options } };
}

/* ==========================================================================
   FORMATAÇÃO
   ========================================================================== */
function formatBRL(v) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });
}
function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
const PORTFOLIO_TAG_CLASS = {
  'PRIORITÁRIO': 'tag-prioritario',
  'LANÇAMENTO': 'tag-lancamento',
  'LINHA': 'tag-linha',
  'DESCONTINUADO': 'tag-descontinuado',
  'COMBATE': 'tag-combate'
};
function portfolioTagClass(portfolio) {
  return PORTFOLIO_TAG_CLASS[(portfolio || '').toUpperCase()] || 'tag-outro';
}

/* ==========================================================================
   TOUR DE BOAS-VINDAS
   Aparece uma vez (guardado em localStorage) e pode ser reaberto a qualquer
   momento pelo botão "?" no canto da tela.
   ========================================================================== */
const TOUR_STORAGE_KEY = 'precifacil_tour_seen';
const TOUR_STEPS = [
  {
    title: 'Bem-vindo ao PRECIFÁCIL',
    text: 'Ferramenta para consultar preços e montar pedidos digitando uma lista de itens, ou navegando pelo catálogo. Este tour rápido mostra como usar.'
  },
  {
    title: '1. Escolha o estado e a tabela',
    text: 'Cada estado tem sua própria tabela de preços. Depois de escolher o estado, escolha Tabela 1, 2 ou 3 para começar.'
  },
  {
    title: '2. Consultar ou gerar pedido',
    text: '"Consultar preços" devolve o valor de cada item, pronto para colar no WhatsApp. "Gerar pedido" devolve código de barras + quantidade, pronto para lançar no sistema.'
  },
  {
    title: '3. Digite do seu jeito',
    text: 'Escreva os itens como quiser, com abreviação, erro de digitação ou fora de ordem (ex: "dipirona gts 2" ou "2 dipirona gts"). O PRECIFÁCIL interpreta e casa com o produto certo.'
  },
  {
    title: '4. Confirme quando houver dúvida',
    text: 'Se mais de um item pode ser o que você quis dizer, o PRECIFÁCIL pergunta antes de decidir por conta própria.'
  },
  {
    title: 'Pronto para testar',
    text: 'Também dá pra pular a digitação e ir direto em "Fazer pedido" no topo, pra navegar pelo catálogo com busca e filtro por categoria ou selo (Controlado, Antibiótico...).'
  }
];
let tourStepIdx = 0;
function maybeShowTour() {
  let seen = null;
  try { seen = localStorage.getItem(TOUR_STORAGE_KEY); } catch (e) {}
  if (!seen) openTour();
}
function openTour() {
  tourStepIdx = 0;
  renderTourStep();
}
function renderTourStep() {
  const step = TOUR_STEPS[tourStepIdx];
  const isLast = tourStepIdx === TOUR_STEPS.length - 1;
  const dots = TOUR_STEPS.map((_, i) => `<span class="${i === tourStepIdx ? 'active' : ''}"></span>`).join('');
  document.getElementById('tourRoot').innerHTML = `
    <div class="tour-overlay" onclick="if(event.target===this) closeTour()">
      <div class="tour-card">
        <span class="tour-badge">Passo ${tourStepIdx + 1} de ${TOUR_STEPS.length}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.text)}</p>
        <div class="tour-dots">${dots}</div>
        <div class="tour-footer">
          <button class="tour-skip" onclick="closeTour()">Pular tour</button>
          <button class="btn btn-primary" onclick="advanceTour()">${isLast ? 'Concluir' : 'Próximo'}</button>
        </div>
      </div>
    </div>`;
}
function advanceTour() {
  if (tourStepIdx < TOUR_STEPS.length - 1) { tourStepIdx++; renderTourStep(); }
  else closeTour();
}
function closeTour() {
  document.getElementById('tourRoot').innerHTML = '';
  try { localStorage.setItem(TOUR_STORAGE_KEY, '1'); } catch (e) {}
}

/* ==========================================================================
   SELOS ESPECIAIS (Controlado / Antibiótico / Anticoncepcional / Oftálmico)
   Diferente do portfólio (Linha/Prioritário/...), que vem pronto da
   planilha, esses selos são detectados pelo princípio ativo no nome do
   produto - um item pode ter mais de um ao mesmo tempo (na prática, nos
   itens conferidos até agora isso não aconteceu, mas a lógica suporta).
   Listas conferidas item a item contra a Tabela 1 real; Heverton pode ir
   ampliando conforme aparecerem outras substâncias.
   ========================================================================== */
const SPECIAL_TAG_RULES = [
  { key: 'CONTROLADO', label: 'Controlado', cls: 'tag-controlado', keywords: [
    'ALPRAZOLAM','BROMAZEPAM','CITALOPRAM','VENLAFAXINA','CELECOXIBE','DULOXETINA',
    'BUPROPIONA','TRAMADOL','CLONAZEPAM','AMITRIPTILINA','FLUOXETINA','SERTRALINA',
    'SIBUTRAMINA','DIAZEPAM','ESCITALOPRAM','ETORICOXIBE','GABAPENTINA','ZOLPIDEM',
    'QUETIAPINA','LEVETIRACETAM','LISDEXANFETAMINA','LORAZEPAM','MIRTAZAPINA',
    'NITRAZEPAM','OLANZAPINA','PREGABALINA','RISPERIDONA','DESVENLAFAXINA',
    'TOPIRAMATO','PARACETAMOL+COD'
  ]},
  { key: 'ANTIBIOTICO', label: 'Antibiótico', cls: 'tag-antibiotico', keywords: [
    'AMOX', 'AZITROMICINA', 'CEFALEXINA', 'CIPROFLOXACINO', 'LEVOFLOXACINO', 'GENT'
  ]},
  { key: 'ANTICONCEPCIONAL', label: 'Anticoncepcional', cls: 'tag-anticoncepcional', keywords: [
    'DESOGESTREL', 'DIENOGESTE', 'ALGESTONA', 'DROSP'
  ]},
  { key: 'OFTALMICO', label: 'Oftálmico', cls: 'tag-oftalmico', keywords: [
    'OFT', 'COLIRIO'
  ]}
];
// maiúsculo/sem acento, mas SEM mexer em pontuação (diferente de normalize()),
// pra não perder sinais como o "+" de "PARACETAMOL+COD"
function stripAccentsUpper(str) {
  return str.toString().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function computeSpecialTags(desc) {
  const d = stripAccentsUpper(desc);
  return SPECIAL_TAG_RULES.filter(rule => rule.keywords.some(kw => d.includes(kw))).map(rule => rule.key);
}
function specialTagsHtml(specialTags) {
  if (!specialTags || specialTags.length === 0) return '';
  return specialTags.map(key => {
    const rule = SPECIAL_TAG_RULES.find(r => r.key === key);
    if (!rule) return '';
    return `<span class="tag ${rule.cls}">${escapeHtml(rule.label)}</span>`;
  }).join('');
}

/* ==========================================================================
   CARREGAMENTO DAS TABELAS (xlsx via SheetJS)
   ========================================================================== */
function findProductSheetRows(wb, sheetName) {
  // Usa a aba pelo nome exato (cada estado/tabela vive na sua própria aba,
  // dentro do mesmo arquivo TABELAS.xlsx). Não cai num fallback "qualquer
  // aba com EAN+DESCRIÇÃO" porque agora o arquivo tem uma aba dessas PARA
  // CADA estado - um fallback assim podia silenciosamente carregar o
  // estado errado em vez de avisar que a aba esperada não existe.
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    throw new Error('Não encontrei a aba "' + sheetName + '" em ' + TABELAS_FILE + '.');
  }
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });
  if (rows.length && rows[0]) {
    const header = rows[0].map(h => (h || '').toString().toUpperCase());
    const hasEan = header.some(h => h.includes('EAN'));
    const hasDesc = header.some(h => h.includes('DESCR'));
    if (hasEan && hasDesc) return rows;
  }
  throw new Error('A aba "' + sheetName + '" em ' + TABELAS_FILE + ' não tem as colunas EAN + DESCRIÇÃO esperadas.');
}

function parseProductRows(rows) {
  const header = rows[0].map(h => (h || '').toString().toUpperCase());
  let eanIdx = header.findIndex(h => h.includes('EAN'));
  let descIdx = header.findIndex(h => h.includes('DESCR'));
  // a Bahia tem uma coluna a mais, "Final c/st" (preço já com substituição
  // tributária) - só ela tem essa coluna, então procurá-la primeiro e cair
  // pra "Preço" normal nos outros estados já resolve isso automaticamente,
  // sem precisar saber qual estado está sendo lido
  let precoIdx = header.findIndex(h => h.includes('FINAL') && h.includes('C/ST'));
  if (precoIdx < 0) precoIdx = header.findIndex(h => h.includes('PRE'));
  // "ITEM"/"CAIXA" são os nomes antigos da planilha; "PORTIF" (Portifólio)
  // e "CX" são os nomes usados na planilha multi-estado atual - aceita os
  // dois formatos
  let itemIdx = header.findIndex(h => h.includes('ITEM') || h.includes('PORTIF'));
  let caixaIdx = header.findIndex(h => h.includes('CAIXA') || h.includes('CX'));
  if (eanIdx < 0) eanIdx = 0;
  if (descIdx < 0) descIdx = 1;
  if (precoIdx < 0) precoIdx = 2;

  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const ean = r[eanIdx], desc = r[descIdx], preco = r[precoIdx];
    if (ean === null || ean === undefined || !desc) continue;
    const precoNum = (preco === null || preco === undefined || preco === '') ? null : parseFloat(preco);
    const portfolio = itemIdx >= 0 && r[itemIdx] !== null && r[itemIdx] !== undefined ? String(r[itemIdx]).trim() : null;
    const caixa = caixaIdx >= 0 && r[caixaIdx] !== null && r[caixaIdx] !== undefined && r[caixaIdx] !== '' ? parseInt(r[caixaIdx], 10) : null;
    const descTrim = String(desc).trim();
    data.push({
      ean: String(ean).trim(),
      desc: descTrim,
      // versão "limpa" (sem sufixo de fornecedor "-GD"/"REV", sal/éster,
      // código de classe, espaços duplicados) usada em toda tela que MOSTRA
      // o produto pro usuário; a busca/matching continua usando o "desc"
      // original acima, nunca o limpo
      displayDesc: prettifyDesc(descTrim),
      preco: (precoNum!==null && !isNaN(precoNum)) ? precoNum : null,
      portfolio,
      caixa: (caixa !== null && !isNaN(caixa)) ? caixa : null,
      specialTags: computeSpecialTags(descTrim)
    });
  }
  return data;
}

async function initApp() {
  try {
    const res = await fetch(TABELAS_FILE, { cache: 'no-store' });
    if (!res.ok) throw new Error('Arquivo ' + TABELAS_FILE + ' não encontrado (HTTP ' + res.status + ')');
    const buf = await res.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    for (const stateCode of Object.keys(STATES)) {
      const tables = {};
      for (const key of Object.keys(TABLE_LABELS)) {
        const sheetName = stateSheetName(key, stateCode);
        const rows = findProductSheetRows(wb, sheetName);
        if (!rows.length) throw new Error('Aba "' + sheetName + '" está vazia em ' + TABELAS_FILE + '.');
        tables[key] = parseProductRows(rows);
      }
      TABLES_BY_STATE[stateCode] = tables;
    }
    renderStateSelect();
  } catch (err) {
    renderLoadError(err);
  }
}

/* ==========================================================================
   RENDERIZAÇÃO — BARRA SUPERIOR
   ========================================================================== */
function renderCtxBar() {
  // sai do "modo tela cheia" da seleção de estado (topbar escondida, fundo
  // colorido) - toda tela normal do app passa por aqui, então é o lugar
  // certo pra garantir que a barra volte a aparecer
  document.body.classList.remove('state-select-active');
  const mainEl = document.getElementById('app');
  if (mainEl) mainEl.classList.remove('state-select-main');
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.style.display = '';

  // o estado escolhido mora embaixo do nome "PRECIFÁCIL" (clicável, troca de
  // estado), não mais como pill+botão separados na barra de contexto - isso
  // evitava que a barra empilhasse alto demais no celular
  const stateLabelEl = document.getElementById('stateLabel');
  if (stateLabelEl) {
    if (state.selectedStateLabel) {
      stateLabelEl.textContent = state.selectedStateLabel + ' ▾';
      stateLabelEl.style.display = 'block';
    } else {
      stateLabelEl.style.display = 'none';
    }
  }

  const ctx = document.getElementById('ctxBar');
  let html = '';
  const onTableSelectScreen = !state.selectedTableKey && !state.mode && !state.pickingForBrowse && !state.pickingForOfertas && state.tables.t1;
  if (onTableSelectScreen) html += `<button class="reset" onclick="startBrowseOrder()">Fazer pedido</button>`;
  if (onTableSelectScreen) html += `<button class="reset" onclick="startOfertasFlow()">Gerar lista de ofertas</button>`;
  if (state.selectedTableName) html += `<span class="pill">${escapeHtml(state.selectedTableName)}</span>`;
  if (state.mode) html += `<span class="pill">${state.mode === 'A' ? 'Consultar preços' : 'Gerar pedido'}</span>`;
  if (state.selectedTableKey) html += `<button class="reset" onclick="resetAll()">Novo pedido</button>`;
  ctx.innerHTML = html;
}

/* ==========================================================================
   TELA 0 — ESCOLHER ESTADO
   Primeira tela do app: logo em destaque, fundo cheio, escolha do estado.
   Depois de escolhido, segue pro fluxo normal (escolher tabela...) usando
   os dados daquele estado.
   ========================================================================== */
function renderStateSelect() {
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.style.display = 'none';
  const helpFab = document.getElementById('helpFab');
  if (helpFab) helpFab.style.display = 'none';
  document.body.classList.add('state-select-active');
  const mainEl = document.getElementById('app');
  mainEl.classList.add('state-select-main');
  const buttons = Object.keys(STATES).map(code =>
    `<button class="state-btn" onclick="selectState('${code}')">${escapeHtml(STATES[code])}</button>`
  ).join('');
  mainEl.innerHTML = `
    <div class="state-select">
      <img class="state-select-logo" src="logo.png" alt="PRECIFÁCIL">
      <h1>Selecione seu estado</h1>
      <div class="state-grid">${buttons}</div>
    </div>
    <p class="state-select-footer">Criado por Heverton Monteiro</p>
  `;
  const ctx = document.getElementById('ctxBar');
  if (ctx) ctx.innerHTML = '';
}
function selectState(code) {
  if (!STATES[code] || !TABLES_BY_STATE[code]) return;
  state.selectedState = code;
  state.selectedStateLabel = STATES[code];
  state.tables = TABLES_BY_STATE[code];
  renderSelectTable();
}
function changeState() {
  resetOrderState();
  state.selectedState = null;
  state.selectedStateLabel = null;
  state.tables = { t1: null, t2: null, t3: null };
  renderStateSelect();
}

/* ==========================================================================
   TELA: ERRO DE CARREGAMENTO
   ========================================================================== */
function renderLoadError(err) {
  document.getElementById('app').innerHTML = `
    <div class="error-box">
      <strong>Não foi possível carregar as tabelas.</strong><br><br>
      ${escapeHtml(err.message)}<br><br>
      Verifique se o arquivo <code>TABELAS.xlsx</code> está na mesma
      pasta do <code>index.html</code> no repositório, e se a página está sendo acessada
      via GitHub Pages (ou um servidor local); não funciona abrindo o arquivo diretamente
      pelo navegador (file://).
      <div class="btn-row"><button class="btn btn-secondary" onclick="initApp()">Tentar novamente</button></div>
    </div>`;
  renderCtxBar();
}

/* ==========================================================================
   TELA 1 — ESCOLHER TABELA
   ========================================================================== */
function renderSelectTable() {
  state.selectedTableKey = null;
  state.selectedTableName = null;
  state.mode = null;
  state.pickingForBrowse = false;
  state.pickingForOfertas = false;
  const cards = Object.keys(TABLE_LABELS).map(key => tableCardHtml(key, 'selectTable')).join('');
  document.getElementById('app').innerHTML = `
    <div class="demo-banner"><strong>Demo de portfólio:</strong> este projeto foi construído para uso
      real de uma distribuidora e aqui roda com nome, logo, preços e códigos de barras totalmente
      fictícios, só para demonstração.</div>
    <h1 class="screen-title">Qual tabela deseja utilizar?</h1>
    <p class="screen-sub">PRECIFÁCIL – Ferramenta inteligente para auxiliar na consulta de preços e na
      digitação de pedidos.<br>Escolha a tabela para começar.</p>
    <div class="card-grid cols-3">${cards}</div>
    <p class="footer-note">PRECIFÁCIL · demonstração de portfólio para a FarmaCerta Genéricos · atualize a planilha TABELAS.xlsx no GitHub para renovar os preços</p>
  `;
  renderCtxBar();
  document.getElementById('helpFab').style.display = 'block';
  maybeShowTour();
}
function selectTable(key) {
  if (LOCKED_TABLES[key]) return lockedTableAlert(key);
  state.selectedTableKey = key;
  state.selectedTableName = TABLE_LABELS[key];
  renderSelectMode();
}

function tableCardHtml(key, handlerName) {
  const locked = LOCKED_TABLES[key];
  const clickAttr = locked
    ? `onclick="lockedTableAlert('${key}')"`
    : `onclick="${handlerName}('${key}')"`;
  const overlay = locked ? `
        <div class="lock-overlay">
          <div class="lock-icon">🔒</div>
          <div class="lock-reason">${escapeHtml(locked)}</div>
        </div>` : '';
  return `
      <div class="choice-card${locked ? ' locked' : ''}" ${clickAttr}>
        <div class="card-content">
          <div class="dot"></div>
          <h3>${escapeHtml(TABLE_LABELS[key])}</h3>
          <p>${state.tables[key].length} produtos carregados</p>
        </div>${overlay}
      </div>`;
}

function lockedTableAlert(key) {
  alert(`${TABLE_LABELS[key]} está bloqueada.\n\nMotivo: ${LOCKED_TABLES[key]}`);
}

/* ==========================================================================
   TELA — "FAZER PEDIDO": escolher tabela, navegar pelo catálogo inteiro e
   ir inserindo a quantidade de cada item, em vez de digitar a lista
   ========================================================================== */
function startBrowseOrder() {
  renderBrowseTablePicker();
}
function renderBrowseTablePicker() {
  state.selectedTableKey = null;
  state.selectedTableName = null;
  state.mode = null;
  state.pickingForBrowse = true;
  const cards = Object.keys(TABLE_LABELS).map(key => tableCardHtml(key, 'selectTableForBrowse')).join('');
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Fazer pedido</h1>
    <p class="screen-sub">Escolha a tabela para montar o pedido navegando pelos itens.</p>
    <div class="card-grid cols-3">${cards}</div>
    <div class="btn-row"><button class="btn btn-ghost" onclick="renderSelectTable()">&larr; Voltar</button></div>
  `;
  renderCtxBar();
}
function selectTableForBrowse(key) {
  if (LOCKED_TABLES[key]) return lockedTableAlert(key);
  state.selectedTableKey = key;
  state.selectedTableName = TABLE_LABELS[key];
  state.pickingForBrowse = false;
  state.browseQty = {};
  state.browseBoxMode = {};
  state.browseSearch = '';
  state.browseCategory = '';
  state.browseSpecial = '';
  state.browseOnlyWithQty = false;
  renderBrowseCatalog();
}
function startOfertasFlow() {
  renderOfertasTablePicker();
}
function renderOfertasTablePicker() {
  state.selectedTableKey = null;
  state.selectedTableName = null;
  state.mode = null;
  state.pickingForOfertas = true;
  const cards = Object.keys(TABLE_LABELS).map(key => tableCardHtml(key, 'selectTableForOfertas')).join('');
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Gerar lista de ofertas</h1>
    <p class="screen-sub">Escolha a tabela para sortear a lista.</p>
    <div class="card-grid cols-3">${cards}</div>
    <div class="btn-row"><button class="btn btn-ghost" onclick="renderSelectTable()">&larr; Voltar</button></div>
  `;
  renderCtxBar();
}
function selectTableForOfertas(key) {
  if (LOCKED_TABLES[key]) return lockedTableAlert(key);
  state.selectedTableKey = key;
  state.selectedTableName = TABLE_LABELS[key];
  state.pickingForOfertas = false;
  renderOfertasPicker();
}
function renderBrowseCatalog() {
  const data = state.tables[state.selectedTableKey];
  const categories = [...new Set(data.map(p => p.portfolio).filter(Boolean))];
  const specialKeysPresent = new Set(data.flatMap(p => p.specialTags));
  const specialOptions = SPECIAL_TAG_RULES.filter(r => specialKeysPresent.has(r.key));
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Fazer pedido</h1>
    <p class="screen-sub">Insira a quantidade de cada item que o cliente pediu. Use a busca ou os filtros
      pra achar mais rápido.</p>
    <div class="browse-sticky-bar">
      <span class="tag tag-lancamento" id="browseLancCount">Lançamento: 0</span>
      <span class="tag tag-prioritario" id="browsePrioCount">Prioritário: 0</span>
      <span class="tag tag-linha" id="browseSkuCount">SKUs: 0</span>
      <span class="order-total" id="browseTotal">Total: R$ 0,00</span>
      <button class="btn btn-primary" onclick="finalizeBrowseOrder()">Finalizar pedido</button>
    </div>
    <div class="browse-filters">
      <input type="text" id="browseSearchInput" placeholder="Buscar item..." oninput="onBrowseSearchInput()">
      <select id="browseCategorySelect" onchange="onBrowseCategoryChange()">
        <option value="">Todas as categorias</option>
        ${categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
      </select>
      ${specialOptions.length ? `
      <select id="browseSpecialSelect" onchange="onBrowseSpecialChange()">
        <option value="">Todos os tipos</option>
        ${specialOptions.map(r => `<option value="${r.key}">${escapeHtml(r.label)}</option>`).join('')}
      </select>` : ''}
      <label class="browse-only-qty">
        <input type="checkbox" id="browseOnlyQtyCheck" ${state.browseOnlyWithQty ? 'checked' : ''} onchange="onBrowseOnlyQtyChange()">
        Só com quantidade
      </label>
    </div>
    <div class="result-block" id="browseList"></div>
    <div class="btn-row"><button class="btn btn-ghost" onclick="renderSelectTable()">&larr; Voltar</button></div>
  `;
  renderBrowseList();
  renderCtxBar();
  syncBrowseStickyOffset();
}
function syncBrowseStickyOffset() {
  // a altura da topbar varia (o pill da tabela pode quebrar linha em telas
  // estreitas), então mede na hora em vez de fixar um valor no CSS
  const bar = document.querySelector('.browse-sticky-bar');
  const topbar = document.querySelector('.topbar');
  if (bar && topbar) bar.style.top = topbar.offsetHeight + 'px';
}
window.addEventListener('resize', () => {
  if (document.querySelector('.browse-sticky-bar')) syncBrowseStickyOffset();
});
function onBrowseSearchInput() {
  state.browseSearch = document.getElementById('browseSearchInput').value;
  renderBrowseList();
}
function onBrowseCategoryChange() {
  state.browseCategory = document.getElementById('browseCategorySelect').value;
  renderBrowseList();
}
function onBrowseSpecialChange() {
  state.browseSpecial = document.getElementById('browseSpecialSelect').value;
  renderBrowseList();
}
function onBrowseOnlyQtyChange() {
  state.browseOnlyWithQty = document.getElementById('browseOnlyQtyCheck').checked;
  renderBrowseList();
}
function renderBrowseList() {
  const list = document.getElementById('browseList');
  const data = state.tables[state.selectedTableKey];
  const searchNorm = normalize(state.browseSearch || '');
  const filtered = data.filter(p => {
    if (state.browseCategory && p.portfolio !== state.browseCategory) return false;
    if (state.browseSpecial && !p.specialTags.includes(state.browseSpecial)) return false;
    if (searchNorm && !normalize(p.desc).includes(searchNorm)) return false;
    if (state.browseOnlyWithQty && !(state.browseQty[p.ean] > 0)) return false;
    return true;
  });
  if (filtered.length === 0) {
    list.innerHTML = '<p style="color:var(--ink-soft);font-size:13.5px;margin:0;">Nenhum item encontrado.</p>';
    updateBrowseSummary();
    return;
  }
  list.innerHTML = filtered.map(p => {
    const qty = state.browseQty[p.ean] || 0;
    const tagsHtml = (p.portfolio || p.caixa !== null || p.specialTags.length) ? `
        <span class="item-meta">
          ${p.portfolio ? `<span class="tag ${portfolioTagClass(p.portfolio)}">${escapeHtml(p.portfolio)}</span>` : ''}
          ${p.caixa !== null ? `<span class="tag tag-caixa" title="Adicionar 1 caixa fechada (${p.caixa} un)" onclick="addBoxQty('${p.ean}', ${p.caixa})">CX ${p.caixa}</span>` : ''}
          ${specialTagsHtml(p.specialTags)}
        </span>` : '';
    return `
      <div class="qty-row">
        <span class="name">${escapeHtml(p.displayDesc)}${tagsHtml}</span>
        <span class="price">${p.preco !== null ? 'R$ ' + formatBRL(p.preco) : '—'}</span>
        <span class="qty-stepper">
          <button type="button" class="qty-step-btn" title="Diminuir" onclick="stepBrowseQty('${p.ean}',-1)">&minus;</button>
          <input type="number" min="0" value="${qty > 0 ? qty : ''}" placeholder="0" id="browseQtyInput_${p.ean}" oninput="setBrowseQty('${p.ean}', this.value)">
          <button type="button" class="qty-step-btn" title="Aumentar" onclick="stepBrowseQty('${p.ean}',1)">+</button>
        </span>
      </div>`;
  }).join('');
  updateBrowseSummary();
}
function stepBrowseQty(ean, delta) {
  const input = document.getElementById('browseQtyInput_' + ean);
  if (!input) return;
  const val = parseInt(input.value, 10);
  const next = Math.max(0, (isNaN(val) ? 0 : val) + delta);
  input.value = next > 0 ? next : '';
  setBrowseQty(ean, next);
}
function setBrowseQty(ean, value) {
  const qty = parseInt(value, 10);
  if (!isNaN(qty) && qty > 0) state.browseQty[ean] = qty;
  else delete state.browseQty[ean];
  // valor foi digitado/ajustado à mão - a próxima caixa clicada substitui
  // esse número em vez de somar a ele (só soma em cliques consecutivos na
  // etiqueta "CX", sem digitação no meio)
  delete state.browseBoxMode[ean];
  updateBrowseSummary();
}
function addBoxQty(ean, boxSize) {
  // se a quantidade atual já veio só de cliques em "CX", empilha mais uma
  // caixa; senão (campo vazio ou digitado à mão) substitui pela quantidade
  // exata de uma caixa fechada
  const base = state.browseBoxMode[ean] ? (state.browseQty[ean] || 0) : 0;
  const next = base + boxSize;
  state.browseQty[ean] = next;
  state.browseBoxMode[ean] = true;
  const input = document.getElementById('browseQtyInput_' + ean);
  if (input) input.value = next;
  updateBrowseSummary();
}
function updateBrowseSummary() {
  const totalEl = document.getElementById('browseTotal');
  if (!totalEl) return;
  const lancEl = document.getElementById('browseLancCount');
  const prioEl = document.getElementById('browsePrioCount');
  const skuEl = document.getElementById('browseSkuCount');
  const data = state.tables[state.selectedTableKey];
  const byEan = new Map(data.map(p => [p.ean, p]));
  let total = 0, lancCount = 0, prioCount = 0, skuCount = 0;
  Object.keys(state.browseQty).forEach(ean => {
    const qty = state.browseQty[ean];
    const p = byEan.get(ean);
    if (!p || qty <= 0) return;
    if (p.preco !== null) total += qty * p.preco;
    if (p.portfolio === 'LANÇAMENTO') lancCount++;
    if (p.portfolio === 'PRIORITÁRIO') prioCount++;
    skuCount++;
  });
  totalEl.textContent = 'Total: R$ ' + formatBRL(total);
  if (lancEl) lancEl.textContent = 'Lançamento: ' + lancCount;
  if (prioEl) prioEl.textContent = 'Prioritário: ' + prioCount;
  if (skuEl) skuEl.textContent = 'SKUs: ' + skuCount;
}
function finalizeBrowseOrder() {
  const data = state.tables[state.selectedTableKey];
  const byEan = new Map(data.map(p => [p.ean, p]));
  const ordered = Object.keys(state.browseQty)
    .filter(ean => state.browseQty[ean] > 0 && byEan.has(ean))
    .map(ean => {
      const item = byEan.get(ean);
      return { raw: 'browse:' + ean, name: item.displayDesc, qty: state.browseQty[ean], status: 'found', item, options: null };
    });
  if (ordered.length === 0) {
    alert('Você não pode finalizar pois não inseriu nenhum item.');
    return;
  }
  state.mode = 'B';
  state.fromBrowse = true;
  state.results = { ordered };
  renderResultsB();
}

/* ==========================================================================
   TELA 2 — ESCOLHER MODO
   ========================================================================== */
function renderSelectMode() {
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">O que você precisa fazer?</h1>
    <p class="screen-sub">Tabela selecionada: <strong>${escapeHtml(state.selectedTableName)}</strong></p>
    <div class="card-grid">
      <div class="choice-card" onclick="selectMode('A')">
        <div class="dot"></div>
        <h3>Consultar preços</h3>
        <p>Digite os itens e veja os preços, prontos para colar no WhatsApp.</p>
      </div>
      <div class="choice-card" onclick="selectMode('B')">
        <div class="dot"></div>
        <h3>Gerar pedido</h3>
        <p>Digite os itens e receba código de barras + quantidade.</p>
      </div>
    </div>
    <div class="btn-row"><button class="btn btn-ghost" onclick="renderSelectTable()">&larr; Trocar tabela</button></div>
  `;
  renderCtxBar();
}
function selectMode(mode) {
  state.mode = mode;
  state.fromBrowse = false;
  renderInputScreen();
}

/* ==========================================================================
   TELA — GERAR LISTA DE OFERTAS
   Monta uma lista aleatória (sempre diferente) de itens de uma ou mais
   categorias do portfólio, no mesmo formato "pronto pro WhatsApp" da
   consulta de preços. A escolha é ponderada pra tentar aproximar a MÉDIA de
   preço da lista de OFERTAS_PRECO_MEDIO_ALVO, sem ser um critério decisivo -
   é só um viés a mais, a lista continua sorteada e nunca fica travada só
   em itens baratos.
   ========================================================================== */
const OFERTAS_QTD = 12;
const OFERTAS_PRECO_MEDIO_ALVO = 10;
const OFERTAS_CATEGORIAS = {
  LANCAMENTO: { label: 'Só Lançamentos', portfolios: ['LANÇAMENTO'] },
  PRIORITARIO: { label: 'Só Prioritários', portfolios: ['PRIORITÁRIO'] },
  LINHA: { label: 'Só Linha', portfolios: ['LINHA'] },
  GERAL: { label: 'Geral (Lançamento, Prioritário e Linha)', portfolios: ['LANÇAMENTO', 'PRIORITÁRIO', 'LINHA'] }
};
function renderOfertasPicker() {
  const cards = Object.keys(OFERTAS_CATEGORIAS).map(key => `
      <div class="choice-card" onclick="generateOfertas('${key}')">
        <div class="dot"></div>
        <h3>${escapeHtml(OFERTAS_CATEGORIAS[key].label)}</h3>
        <p>Sorteia ${OFERTAS_QTD} itens dessa categoria, prontos pra colar no WhatsApp.</p>
      </div>`).join('');
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Gerar lista de ofertas</h1>
    <p class="screen-sub">Tabela selecionada: <strong>${escapeHtml(state.selectedTableName)}</strong>. Escolha quais categorias entram no sorteio.</p>
    <div class="card-grid cols-3">${cards}</div>
    <div class="btn-row"><button class="btn btn-ghost" onclick="renderSelectTable()">&larr; Voltar</button></div>
  `;
  renderCtxBar();
}
// escolha aleatória ponderada sem repetição (algoritmo de Efraimidis-Spirakis):
// cada item recebe uma "chave" aleatória elevada ao inverso do seu peso, e os
// N maiores vencem - dá pra sortear qualquer item, mas os de peso maior (mais
// perto do preço-alvo) saem premiados com mais frequência
function pickWeightedRandom(pool, n, targetPrice) {
  const keyed = pool.map(item => {
    const dist = Math.abs((item.preco || 0) - targetPrice);
    const weight = 1 / (1 + dist);
    const u = Math.max(Math.random(), 1e-9);
    return { item, key: Math.pow(u, 1 / weight) };
  });
  keyed.sort((a, b) => b.key - a.key);
  return keyed.slice(0, n).map(k => k.item);
}
function generateOfertas(categoriaKey) {
  const categoria = OFERTAS_CATEGORIAS[categoriaKey];
  if (!categoria) return;
  state.ofertasCategoria = categoriaKey;
  const data = state.tables[state.selectedTableKey];
  const allowed = new Set(categoria.portfolios);
  const pool = data.filter(p => p.preco !== null && allowed.has((p.portfolio || '').toUpperCase()));
  // o sorteio em si é aleatório; a ORDEM final na lista sai alfabética, igual
  // à da tabela, só pra ficar mais fácil de conferir
  state.ofertasItens = pickWeightedRandom(pool, OFERTAS_QTD, OFERTAS_PRECO_MEDIO_ALVO)
    .sort((a, b) => a.displayDesc.localeCompare(b.displayDesc, 'pt-BR'));
  renderOfertasResult();
}
const OFERTAS_LIST_HEADER = '*Ofertas FarmaCerta*';
function renderOfertasResult() {
  const items = state.ofertasItens;
  const categoria = OFERTAS_CATEGORIAS[state.ofertasCategoria];
  const lines = items.map(item => formatClientPriceLine(item));
  const plainText = [OFERTAS_LIST_HEADER, '', ...lines].join('\n');
  const htmlLines = [
    `<span class="line-title">${escapeHtml(OFERTAS_LIST_HEADER)}</span>`,
    '',
    ...lines.map(l => `<span class="line-found">${escapeHtml(l)}</span>`)
  ].join('\n');
  state.copyTargets.copyBtnOfertas = plainText;
  const media = items.length ? items.reduce((s, i) => s + i.preco, 0) / items.length : 0;

  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Lista de ofertas</h1>
    ${AI_DISCLAIMER_HTML}
    <p class="screen-sub">
      <span class="badge-count">${items.length} item(ns)</span> · ${escapeHtml(categoria.label)} · média R$ ${formatBRL(media)}
    </p>
    <div class="result-block">
      <h3>Pronto para colar no WhatsApp</h3>
      <pre class="result-pre">${htmlLines || '<span style="color:var(--ink-soft)">Nenhum item com preço nessa categoria.</span>'}</pre>
      <button class="copy-btn" id="copyBtnOfertas" onclick="copyText('copyBtnOfertas')">Copiar</button>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="generateOfertas('${state.ofertasCategoria}')">Gerar outra lista</button>
      <button class="btn btn-ghost" onclick="renderOfertasPicker()">&larr; Trocar categoria</button>
    </div>
  `;
  renderCtxBar();
}

/* ==========================================================================
   TELA 3 — DIGITAR ITENS
   ========================================================================== */
function renderInputScreen() {
  const title = state.mode === 'A' ? 'Consultar preços' : 'Gerar pedido';
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">${title}</h1>
    <p class="screen-sub">Digite um item por linha. Se quiser, informe a quantidade no final da linha.</p>
    <textarea id="itemsInput" placeholder="Ex:
paracetamol 750mg 2
dipirona gotas 3
losartana 50mg"></textarea>
    <div class="example-box">
      Dica: informe a dosagem sempre que possível (<code>750mg</code>, <code>500mg</code>) para evitar
      confusão entre apresentações diferentes do mesmo remédio.
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="processInput()">Buscar</button>
      <button class="btn btn-ghost" onclick="renderSelectMode()">&larr; Voltar</button>
    </div>
  `;
  renderCtxBar();
  document.getElementById('itemsInput').focus();
}

function processInput() {
  const raw = document.getElementById('itemsInput').value;
  const rawLines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (rawLines.length === 0) return;

  const data = state.tables[state.selectedTableKey];

  // "ordered" é a lista-mestra, sempre na ordem em que o usuário digitou.
  // Cada item ambíguo é resolvido "no lugar" depois, sem mudar a posição.
  const ordered = rawLines.map(rawLine => {
    const resolved = resolveLine(rawLine, data);
    const r = resolved.result;
    return {
      raw: resolved.raw, name: resolved.name, qty: resolved.qty,
      status: r.status, item: r.item, options: r.options
    };
  });

  state.results = { ordered };
  state.ambiguousChoices = {};

  const hasAmbiguous = ordered.some(e => e.status === 'ambiguous');
  if (hasAmbiguous) renderAmbiguous();
  else finalizeResults();
}

/* ==========================================================================
   TELA — RESOLVER AMBIGUIDADES
   ========================================================================== */
function renderAmbiguous() {
  const amb = state.results.ordered.filter(e => e.status === 'ambiguous');
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Alguns itens têm mais de uma opção</h1>
    <p class="screen-sub">Selecione a apresentação correta para cada item abaixo.</p>
    <div id="ambigList"></div>
    <div class="btn-row">
      <button class="btn btn-primary" id="confirmAmbigBtn" onclick="confirmAmbiguous()" disabled>Confirmar seleções</button>
      <button class="btn btn-ghost" onclick="renderInputScreen()">&larr; Voltar</button>
    </div>
  `;
  const list = document.getElementById('ambigList');
  amb.forEach((entry, i) => {
    const div = document.createElement('div');
    div.className = 'ambig-item';
    let optsHtml = entry.options.map((opt, oi) => `
      <label class="ambig-opt" data-entry="${i}" data-opt="${oi}">
        <input type="radio" name="amb_${i}" value="${oi}" onchange="onAmbigChoose(${i}, ${oi})">
        <span>${escapeHtml(opt.item.displayDesc)} <strong>(Qtd: ${opt.qty})</strong></span>
        <span class="price">${opt.item.preco !== null ? 'R$ ' + formatBRL(opt.item.preco) : '—'}</span>
      </label>
    `).join('');
    optsHtml += `
      <label class="ambig-opt" data-entry="${i}" data-opt="none">
        <input type="radio" name="amb_${i}" value="none" onchange="onAmbigChoose(${i}, 'none')">
        <span>Nenhuma dessas (não tenho)</span>
      </label>`;
    div.innerHTML = `<div class="q">"${escapeHtml(entry.raw)}"</div>${optsHtml}`;
    list.appendChild(div);
  });
  renderCtxBar();
}
function onAmbigChoose(entryIdx, optIdx) {
  state.ambiguousChoices[entryIdx] = optIdx;
  document.querySelectorAll(`.ambig-opt[data-entry="${entryIdx}"]`).forEach(el => el.classList.remove('selected'));
  document.querySelector(`.ambig-opt[data-entry="${entryIdx}"][data-opt="${optIdx}"]`).classList.add('selected');
  const total = state.results.ordered.filter(e => e.status === 'ambiguous').length;
  const answered = Object.keys(state.ambiguousChoices).length;
  document.getElementById('confirmAmbigBtn').disabled = answered < total;
}
function confirmAmbiguous() {
  let ambPos = 0;
  state.results.ordered.forEach(entry => {
    if (entry.status !== 'ambiguous') return;
    const choice = state.ambiguousChoices[ambPos];
    if (choice === 'none') {
      entry.status = 'not_found';
    } else {
      entry.status = 'found';
      entry.item = entry.options[choice].item;
      entry.qty = entry.options[choice].qty;
    }
    delete entry.options;
    ambPos++;
  });
  finalizeResults();
}

/* ==========================================================================
   FINALIZAÇÃO — direciona para resultado do modo A ou B
   ========================================================================== */
function finalizeResults() {
  if (state.mode === 'A') renderResultsA();
  else renderResultsB();
}

/* ==========================================================================
   NOME "LIMPO" PARA O CLIENTE (só exibição — nunca usado na busca/matching)
   Remove sal/éster do início ("CLOR.", "HEMIF. DE"...), código de classe
   entre parênteses ("(C1)", "(B1)"...) e o sufixo de fornecedor/revestimento
   ("-GD", "REV") do final, deixando um nome mais parecido com o comercial.
   Testado contra as duas tabelas inteiras sem gerar nome igual pra produtos
   diferentes.
   ========================================================================== */
const PRETTIFY_SALT_PREFIXES = [
  /^DICLORIDRATO\s+/i, /^BISSULFATO\s+/i, /^DICLOR\.\s*/i, /^CLOR\.\s*/i,
  /^BROMID\.\s*/i, /^MESILATO\s+/i, /^PROPIONATO\s+/i, /^VALERATO\s+/i,
  /^HEMIFUMARATO\s+DE\s+/i, /^HEMIF\.\s*DE\s*/i, /^HEMIF\.\s*/i, /^HEM\.\s*/i,
  /^MALEATO\s+DE\s+/i, /^MALEATO\s+/i, /^OXALATO\s+/i,
  /^FUROATO\s+DE\s+/i, /^SUC\s+(?=[A-Z])/i, /^CL\.\s*DE\s*/i, /^CL\.\s*/i,
  /^TROMETAMOL\s+/i, /^C\.(?=[A-Z])/i
];
// abreviações de embalagem (comprimido/cápsula) -> nome limpo pra exibição;
// "C.R"/"C.REV" (comprimido revestido) também viram só "Comp"
const PACK_FORM_LABELS = { COMP:'Comp', COM:'Comp', CPR:'Comp', CR:'Comp', C:'Comp', CRLP:'Comp', CP:'Comp', CAPS:'Caps', CAP:'Caps', CPS:'Caps' };
const PACK_FORM_RE = '(COMP|COM|CPR|CRLP|CAPS|CAP|CPS|CP|C\\.?R\\.?|C\\.?REV\\.?)';
// normaliza a notação de quantidade/embalagem pro padrão único "C/<total>
// Comp"/"C/<total> Caps" - calcula o total quando vem como "N blíster(es) X
// M unidades" (ex: "3BLX10" -> C/30, "2BLTX7" -> C/14) e descarta qualquer
// sufixo de fornecedor/revestimento colado logo depois (GD, REV, C.R,
// R.-G, COMREV...), já que isso não interessa pro cliente. "(?<!\d)" antes
// de cada número evita que ele "quebre" um número maior ao achar um match
// no meio dele (ex: não pode ler "30" como resto "3" + quantidade "0"). O
// ".*" guloso no início sempre pega a ÚLTIMA ocorrência do padrão na
// descrição, pra não confundir com outro número solto mais cedo no texto.
// HEVERTON: se aparecer um formato de embalagem que não caia em nenhum
// desses casos (ex: uma forma que não seja comprimido/cápsula, uma
// notação sem nenhuma palavra de forma tipo "2 BL X 10" sozinho, ou a
// palavra de forma vindo ANTES da contagem em vez de depois), me avisa que
// eu adiciono aqui.
// pega o nome "limpo" (Comp/Caps) a partir do texto abreviado batido pela
// regex (ex: "C.REV" -> "Comp", "CAPS" -> "Caps")
function packFormLabel(raw) {
  const key = raw.toUpperCase().replace(/\./g, '').replace(/REV$/, '');
  return PACK_FORM_LABELS[key] || raw;
}
// remove uma palavra de forma "órfã" (duplicada) que sobra bem no fim do
// pedaço antes do número de embalagem de verdade - ex: "...6MG COMP  3 BL X
// 10 COMP" tem "COMP" escrito duas vezes (uma cedo, outra na embalagem); ou
// "...COMP.REV  1 BLT X 10 COMP", onde "COMP.REV" é só o revestimento -
// também tira um ponto final solto que sobra no fim (ex: "PSEUD." -> "PSEUD")
function cleanPackPrefix(prefix) {
  return prefix
    .replace(new RegExp('\\b' + PACK_FORM_RE + '\\.?(REV)?\\.?\\s*$', 'i'), '')
    .replace(/\.\s*$/, '')
    .trim();
}
// embalagem em envelope/sachê ("16ENV") não é comprimido/cápsula - não dá
// pra virar "C/16", só descarta o que sobra depois (peso/fornecedor)
function normalizeEnvelope(desc) {
  const m = desc.match(/^(.*(?<!\d)\d+\s*ENV)\b.*$/i);
  return m ? m[1].replace(/\s{2,}/g, ' ').trim() : null;
}
function normalizePackaging(desc) {
  const env = normalizeEnvelope(desc);
  if (env) return env;

  let m;
  // forma ANTES da contagem, com multiplicador: "CAPS 4 BL X 7" -> C/28 Caps
  m = desc.match(new RegExp('^(.*)' + PACK_FORM_RE + '\\s+(?<!\\d)(\\d+)\\s*BLT?\\s*X?\\s*(?<!\\d)(\\d+)\\b.*$', 'i'));
  if (m) {
    const total = parseInt(m[3], 10) * parseInt(m[4], 10);
    return (cleanPackPrefix(m[1]) + ' C/' + total + ' ' + packFormLabel(m[2])).replace(/\s{2,}/g, ' ').trim();
  }
  // forma ANTES do BL, sem número de contagem: "CAP BL X 15" -> C/15 (sem
  // repetir a forma - o número de blísteres não veio escrito na planilha)
  m = desc.match(new RegExp('^(.*)' + PACK_FORM_RE + '\\s*BLT?\\s*X?\\s*(?<!\\d)(\\d+)\\b.*$', 'i'));
  if (m) {
    return (cleanPackPrefix(m[1]) + ' C/' + m[3]).replace(/\s{2,}/g, ' ').trim();
  }
  // forma + REV + X + M: "COM REV X 30" -> C/30 Comp
  m = desc.match(new RegExp('^(.*)' + PACK_FORM_RE + '\\s*REV\\s*X\\s*(?<!\\d)(\\d+)\\b.*$', 'i'));
  if (m) {
    return (cleanPackPrefix(m[1]) + ' C/' + m[3] + ' ' + packFormLabel(m[2])).replace(/\s{2,}/g, ' ').trim();
  }
  // "N BLT C/M forma" (embalagem em blísteres de M, com ou sem a barra)
  m = desc.match(new RegExp('^(.*)(?<!\\d)(\\d+)\\s*BLT?\\s*C\\/?\\s*(?<!\\d)(\\d+)\\s*' + PACK_FORM_RE + '(?:REV)?\\b.*$', 'i'));
  if (m) {
    const total = parseInt(m[2], 10) * parseInt(m[3], 10);
    return (cleanPackPrefix(m[1]) + ' C/' + total + ' ' + packFormLabel(m[4])).replace(/\s{2,}/g, ' ').trim();
  }
  // "N BLT X M forma" (embalagem em blísteres de M, com "X")
  m = desc.match(new RegExp('^(.*)(?<!\\d)(\\d+)\\s*BLT?\\s*X?\\s*(?<!\\d)(\\d+)\\s*' + PACK_FORM_RE + '(?:REV)?\\b.*$', 'i'));
  if (m) {
    const total = parseInt(m[2], 10) * parseInt(m[3], 10);
    return (cleanPackPrefix(m[1]) + ' C/' + total + ' ' + packFormLabel(m[4])).replace(/\s{2,}/g, ' ').trim();
  }
  // já vem como "C/N forma" (com ou sem espaço depois da barra)
  m = desc.match(new RegExp('^(.*)C\\/\\s*(?<!\\d)(\\d+)\\s*' + PACK_FORM_RE + '(?:REV)?\\b.*$', 'i'));
  if (m) {
    return (cleanPackPrefix(m[1]) + ' C/' + m[2] + ' ' + packFormLabel(m[3])).replace(/\s{2,}/g, ' ').trim();
  }
  // "N forma" solto, sem "C/" e sem multiplicação
  m = desc.match(new RegExp('^(.*)(?<!\\d)(\\d+)\\s+' + PACK_FORM_RE + '(?:REV)?\\b.*$', 'i'));
  if (m) {
    return (cleanPackPrefix(m[1]) + ' C/' + m[2] + ' ' + packFormLabel(m[3])).replace(/\s{2,}/g, ' ').trim();
  }
  // último recurso: "<dosagem> X <M>" sem nenhuma palavra de forma depois -
  // assume comprimido, a forma mais comum quando não especificada
  m = desc.match(/^(.*)\bX\s*(?<!\d)(\d+)\s*$/i);
  if (m) {
    return (cleanPackPrefix(m[1]) + ' C/' + m[2] + ' Comp').replace(/\s{2,}/g, ' ').trim();
  }
  return desc;
}
function prettifyDesc(desc) {
  let s = desc.replace(/\u00a0/g, ' ');
  // remove código de classificação entre parênteses: (C1), (B1), (A2)...
  s = s.replace(/\s*\([A-Z0-9]{1,4}\)\s*/g, ' ');
  // remove prefixo de sal/éster do início (pode ter mais de um em sequência)
  let changed = true;
  while (changed) {
    changed = false;
    for (const re of PRETTIFY_SALT_PREFIXES) {
      const next = s.replace(re, '');
      if (next !== s) { s = next; changed = true; }
    }
  }
  // "OXALATO" às vezes vem DEPOIS do nome do remédio, não só como prefixo
  // (ex: "ESCITALOPRAM OXALATO 15MG..."), então remove em qualquer posição
  s = s.replace(/\bOXALATO\b\s*/gi, ' ');
  // normaliza embalagem (comprimido/cápsula) antes do resto da limpeza -
  // quando bate um padrão, isso já descarta qualquer sufixo de fornecedor
  // colado depois; se não bater nenhum padrão, os passos abaixo continuam
  // cuidando dos casos que não são comprimido/cápsula
  s = normalizePackaging(s);
  // remove sufixo de fornecedor/revestimento no final
  s = s.replace(/\s*R?[.\s-]*GD\s*$/i, '');
  s = s.replace(/(?<=[A-Z0-9])REV\s*$/i, '');
  s = s.replace(/\s+REV\s*$/i, '');
  s = s.replace(/\.\s*REV\s*$/i, '');
  // remove anotação de "descontinuado" que às vezes vem dentro da própria
  // descrição (a categoria já aparece separada, via portfolio/tag) - deixa
  // o nome no mesmo padrão enxuto dos demais itens
  s = s.replace(/\s*\(?DESCONTINUAD[OA]S?\)?\s*$/i, '');
  s = s.replace(/[.\-]\s*$/, '');
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s || desc; // nunca devolve vazio - se sobrar nada, usa o original
}
// deixa a descrição (já "prettificada") com só a primeira letra maiúscula e
// o resto normal, pra ficar com cara de texto de verdade em vez de GRITADO
// em caixa alta - exceto a notação de embalagem "C/30", que continua com o
// C maiúsculo (padrão do setor, ex: "C/30", "C/6")
function titleCaseDesc(desc) {
  let s = desc.toLowerCase();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  s = s.replace(/\bc\/(\d+)/gi, 'C/$1');
  return s;
}
// título fixo no topo de toda lista de preços gerada pro cliente
const CLIENT_LIST_HEADER = '*Preços FarmaCerta*';
// monta a linha "Nome do produto: *R$ XX,XX*" pronta pra colar no WhatsApp
// (os asteriscos deixam o preço em negrito lá); usado tanto na consulta de
// preços quanto na lista de ofertas
function formatClientPriceLine(item) {
  const name = titleCaseDesc(item.displayDesc);
  const price = item.preco !== null ? `*R$ ${formatBRL(item.preco)}*` : 'sem preço';
  return `${name}: ${price}`;
}

/* ==========================================================================
   AVISO DE RESPONSABILIDADE (IA) — usado nas telas de resultado
   ========================================================================== */
const AI_DISCLAIMER_HTML = `
  <div class="ai-disclaimer">
    <span class="icon">⚠️</span>
    <span><strong>Atenção:</strong> o PRECIFÁCIL é uma ferramenta inteligente desenvolvida para auxiliar e
    acelerar processos do dia a dia. As informações geradas podem conter inconsistências.
    Sempre confira os dados antes de enviar qualquer informação ou pedido ao cliente.</span>
  </div>`;

/* ==========================================================================
   TELA — RESULTADOS MODO A (preços), na mesma ordem em que foram digitados
   ========================================================================== */
function renderResultsA() {
  const ordered = state.results.ordered;
  const foundCount = ordered.filter(e => e.status === 'found').length;
  const notFoundCount = ordered.filter(e => e.status === 'not_found').length;

  const lines = ordered.map(e => {
    if (e.status === 'found') {
      return { text: formatClientPriceLine(e.item), ok:true };
    }
    return { text: `${e.name}: não tenho`, ok:false };
  });

  const plainText = [CLIENT_LIST_HEADER, '', ...lines.map(l => l.text)].join('\n');
  const htmlLines = [
    `<span class="line-title">${escapeHtml(CLIENT_LIST_HEADER)}</span>`,
    '',
    ...lines.map(l => `<span class="${l.ok?'line-found':'line-notfound'}">${escapeHtml(l.text)}</span>`)
  ].join('\n');
  state.copyTargets.copyBtnA = plainText;

  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Preços encontrados</h1>
    ${AI_DISCLAIMER_HTML}
    <p class="screen-sub">
      <span class="badge-count">${foundCount} encontrado(s)</span>
      ${notFoundCount ? ` <span class="badge-count warn">${notFoundCount} não encontrado(s)</span>` : ''}
    </p>
    <div class="result-block">
      <h3>Pronto para colar no WhatsApp</h3>
      <pre class="result-pre" id="resultPreA">${htmlLines}</pre>
      <button class="copy-btn" id="copyBtnA" onclick="copyText('copyBtnA')">Copiar</button>
    </div>
    ${foundCount > 0 ? `
    <div class="result-block">
      <h3>Deseja gerar o pedido pronto com os itens encontrados?</h3>
      <div class="btn-row">
        <button class="btn btn-primary" onclick="startOrderFromFound()">Sim, gerar pedido</button>
        <button class="btn btn-ghost" onclick="renderInputScreen()">Não, nova consulta</button>
      </div>
    </div>` : `
    <div class="btn-row"><button class="btn btn-ghost" onclick="renderInputScreen()">&larr; Nova consulta</button></div>`}
  `;
  renderCtxBar();
}

/* ==========================================================================
   TELA — CONFIRMAR QUANTIDADES PARA GERAR PEDIDO (a partir do Modo A)
   ========================================================================== */
function startOrderFromFound() {
  state.lastFoundForOrder = state.results.ordered.filter(e => e.status === 'found').map(f => ({ ...f }));
  state.qtyListBoxMode = {};
  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Confirme as quantidades</h1>
    <p class="screen-sub">Ajuste as quantidades ou remova algum item antes de gerar o pedido.</p>
    <div class="result-block" id="qtyList"></div>
    <div class="btn-row order-total-row">
      <button class="btn btn-primary" id="generateOrderBtn" onclick="generateOrderFromQuantities()">Gerar pedido</button>
      <button class="btn btn-ghost" onclick="renderResultsA()">&larr; Voltar</button>
      <span class="order-total" id="orderTotal">Total: R$ 0,00</span>
    </div>
  `;
  renderQtyList();
  renderCtxBar();
}
function renderQtyList() {
  const list = document.getElementById('qtyList');
  list.innerHTML = '';
  if (state.lastFoundForOrder.length === 0) {
    list.innerHTML = '<p style="color:var(--ink-soft);font-size:13.5px;margin:0;">Nenhum item restante nesta lista.</p>';
    const btn = document.getElementById('generateOrderBtn');
    if (btn) btn.disabled = true;
    updateOrderTotal();
    return;
  }
  state.lastFoundForOrder.forEach((f, i) => {
    const row = document.createElement('div');
    row.className = 'qty-row';
    const tagsHtml = (f.item.portfolio || f.item.caixa !== null || f.item.specialTags.length) ? `
        <span class="item-meta">
          ${f.item.portfolio ? `<span class="tag ${portfolioTagClass(f.item.portfolio)}">${escapeHtml(f.item.portfolio)}</span>` : ''}
          ${f.item.caixa !== null ? `<span class="tag tag-caixa" title="Adicionar 1 caixa fechada (${f.item.caixa} un)" onclick="addBoxQtyList(${i}, ${f.item.caixa})">CX ${f.item.caixa}</span>` : ''}
          ${specialTagsHtml(f.item.specialTags)}
        </span>` : '';
    row.innerHTML = `
      <span class="name">${escapeHtml(f.item.displayDesc)}${tagsHtml}</span>
      <span class="price">${f.item.preco !== null ? 'R$ ' + formatBRL(f.item.preco) : '—'}</span>
      <span class="qty-stepper">
        <button type="button" class="qty-step-btn" title="Diminuir" onclick="stepQty(${i},-1)">&minus;</button>
        <input type="number" min="0" value="${f.qty}" id="qtyInput_${i}" oninput="onQtyListManualInput(${i})">
        <button type="button" class="qty-step-btn" title="Aumentar" onclick="stepQty(${i},1)">+</button>
      </span>
      <button class="remove-item-btn" title="Remover item" onclick="removeOrderItem(${i})">✕</button>
    `;
    list.appendChild(row);
  });
  const btn = document.getElementById('generateOrderBtn');
  if (btn) btn.disabled = false;
  updateOrderTotal();
}
function stepQty(i, delta) {
  const input = document.getElementById('qtyInput_' + i);
  if (!input) return;
  const val = parseInt(input.value, 10);
  input.value = Math.max(0, (isNaN(val) ? 0 : val) + delta);
  delete state.qtyListBoxMode[i];
  updateOrderTotal();
}
function onQtyListManualInput(i) {
  delete state.qtyListBoxMode[i];
  updateOrderTotal();
}
function addBoxQtyList(i, boxSize) {
  const input = document.getElementById('qtyInput_' + i);
  if (!input) return;
  // se a quantidade atual já veio só de cliques em "CX", empilha mais uma
  // caixa; senão (digitada à mão) substitui pela quantidade exata da caixa
  const val = parseInt(input.value, 10);
  const base = state.qtyListBoxMode[i] ? (isNaN(val) ? 0 : val) : 0;
  input.value = base + boxSize;
  state.qtyListBoxMode[i] = true;
  updateOrderTotal();
}
function updateOrderTotal() {
  const totalEl = document.getElementById('orderTotal');
  if (!totalEl) return;
  let total = 0;
  state.lastFoundForOrder.forEach((f, i) => {
    const input = document.getElementById('qtyInput_' + i);
    const qty = input ? parseInt(input.value, 10) : 0;
    if (!isNaN(qty) && qty > 0 && f.item.preco !== null) total += qty * f.item.preco;
  });
  totalEl.textContent = 'Total: R$ ' + formatBRL(total);
}
function removeOrderItem(i) {
  // guarda os valores de quantidade já digitados antes de remover, pra não
  // perder ajustes que o usuário já tinha feito nos outros itens
  state.lastFoundForOrder = state.lastFoundForOrder.map((f, idx) => {
    const input = document.getElementById('qtyInput_' + idx);
    const val = input ? parseInt(input.value, 10) : NaN;
    return { ...f, qty: isNaN(val) || val <= 0 ? f.qty : val };
  });
  state.lastFoundForOrder.splice(i, 1);
  state.qtyListBoxMode = {}; // índices mudaram - evita reaplicar o modo "caixa" no item errado
  renderQtyList();
}
function generateOrderFromQuantities() {
  const updated = state.lastFoundForOrder.map((f, i) => {
    const val = parseInt(document.getElementById('qtyInput_' + i).value, 10);
    return { ...f, qty: isNaN(val) || val <= 0 ? f.qty : val };
  }).filter(f => f.qty > 0);
  // usa as quantidades confirmadas, mas mantém a ordem original de "ordered".
  // itens removidos (não estão mais em "updated") saem completamente da lista.
  const byRaw = new Map(updated.map(f => [f.raw, f]));
  state.results.ordered = state.results.ordered
    .filter(e => e.status !== 'found' || byRaw.has(e.raw))
    .map(e => e.status === 'found' ? byRaw.get(e.raw) : e);
  renderResultsB();
}

/* ==========================================================================
   TELA — RESULTADOS MODO B (EAN + quantidade), na mesma ordem digitada
   ========================================================================== */
function newOrderSameTable() {
  if (state.fromBrowse) {
    state.browseQty = {};
    state.browseBoxMode = {};
    state.browseSearch = '';
    state.browseCategory = '';
    state.browseSpecial = '';
    state.browseOnlyWithQty = false;
    renderBrowseCatalog();
  } else {
    renderInputScreen();
  }
}
function renderResultsB() {
  const ordered = state.results.ordered;
  const found = ordered.filter(e => e.status === 'found');
  const notFound = ordered.filter(e => e.status === 'not_found');
  const notFoundNames = notFound.map(e => e.name);

  const pairs = found.map(f => `${f.item.ean} ${f.qty}`).join('\n');
  state.copyTargets.copyBtnB = pairs;
  state.copyTargets.copyBtnFaltas = ['Faltas', ...notFoundNames].join('\n');

  const rowsHtml = found.map((f, i) => `
    <div class="order-item-row">
      <span class="name">${escapeHtml(f.item.displayDesc)}</span>
      <span class="ean">${escapeHtml(f.item.ean)}</span>
      <span class="qty">x${f.qty}</span>
      <button class="faltas-item-btn" title="Tirar do pedido e mandar pra Faltas" onclick="sendItemToFaltas(${i})">Falta</button>
    </div>`).join('');

  // item.item só existe quando a linha foi mandada pra Faltas manualmente
  // (clique em "Falta" por engano, por exemplo) - nesse caso dá pra desfazer
  // e voltar pro pedido; itens que nunca foram encontrados na busca não têm
  // pra onde voltar, então não mostram o botão
  const faltasRowsHtml = notFound.map((e, i) => `
    <div class="order-item-row">
      <span class="name">${escapeHtml(e.name)}</span>
      ${e.item ? `<button class="faltas-item-btn" title="Tirar da Faltas e voltar pro pedido" onclick="restoreItemFromFaltas(${i})">Voltar pro pedido</button>` : ''}
    </div>`).join('');

  document.getElementById('app').innerHTML = `
    <h1 class="screen-title">Pedido gerado</h1>
    ${AI_DISCLAIMER_HTML}
    <p class="screen-sub">
      <span class="badge-count">${found.length} item(ns)</span>
      ${notFoundNames.length ? ` <span class="badge-count warn">${notFoundNames.length} falta(s)</span>` : ''}
    </p>
    <div class="result-block">
      <h3>Código de barras + quantidade</h3>
      <div class="order-list">${rowsHtml || '<p style="color:var(--ink-soft);font-size:13.5px;margin:0;">Nenhum item encontrado.</p>'}</div>
      <button class="copy-btn" id="copyBtnB" onclick="copyText('copyBtnB')">Copiar</button>
    </div>
    ${notFoundNames.length ? `
    <div class="result-block">
      <h3>Faltas</h3>
      <div class="order-list">${faltasRowsHtml}</div>
      <button class="copy-btn" id="copyBtnFaltas" onclick="copyText('copyBtnFaltas')">Copiar</button>
    </div>` : ''}
    <div class="btn-row"><button class="btn btn-ghost" onclick="newOrderSameTable()">&larr; Novo pedido nesta tabela</button></div>
  `;
  renderCtxBar();
}
function sendItemToFaltas(i) {
  const found = state.results.ordered.filter(e => e.status === 'found');
  const target = found[i];
  if (!target) return;
  const idx = state.results.ordered.indexOf(target);
  if (idx === -1) return;
  // mantém o item guardado (não zera) pra dar pra desfazer depois
  state.results.ordered[idx] = { ...target, status: 'not_found' };
  renderResultsB();
}
function restoreItemFromFaltas(i) {
  const notFound = state.results.ordered.filter(e => e.status === 'not_found');
  const target = notFound[i];
  if (!target || !target.item) return;
  const idx = state.results.ordered.indexOf(target);
  if (idx === -1) return;
  state.results.ordered[idx] = { ...target, status: 'found' };
  renderResultsB();
}

/* ==========================================================================
   COPIAR PARA ÁREA DE TRANSFERÊNCIA
   ========================================================================== */
function copyText(btnId) {
  const text = state.copyTargets[btnId] || '';
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = 'Copiado!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1500);
  }).catch(() => {
    alert('Não foi possível copiar automaticamente. Selecione o texto manualmente.');
  });
}

/* ==========================================================================
   RESET
   ========================================================================== */
function resetOrderState() {
  state.mode = null;
  state.parsedLines = [];
  state.results = { found: [], notFound: [], ambiguous: [] };
  state.ambiguousChoices = {};
  state.lastFoundForOrder = [];
  state.pickingForBrowse = false;
  state.pickingForOfertas = false;
  state.browseQty = {};
  state.browseBoxMode = {};
  state.browseSearch = '';
  state.browseCategory = '';
  state.browseSpecial = '';
  state.browseOnlyWithQty = false;
  state.fromBrowse = false;
}
function resetAll() {
  resetOrderState();
  renderSelectTable();
}

/* ==========================================================================
   INÍCIO
   ========================================================================== */
initApp();
