/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Contratos
   PDF gerado com layout estruturado (cabeçalho com logo, tabela de
   contratante, tabela de descrição do evento e dados bancários),
   reproduzindo o modelo real de contrato da empresa.
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { buscarEmpresa } from './configuracoes.js';
import { buscarItemPorNome } from './acervo.js';
import { registrarAuditoria } from './auditoria.js';

/**
 * Código curto e único para o link público do contrato (ex: "aB3xK9pQ"),
 * bem menor que o UUID do contrato — usado em /api/c/{codigo}.
 * Sem caracteres ambíguos (0/O, 1/l/I) para ficar fácil de digitar também.
 */
function gerarCodigoCurto(tamanho = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let codigo = '';
  for (let i = 0; i < tamanho; i++) codigo += chars[Math.floor(Math.random() * chars.length)];
  return codigo;
}

export async function buscarModelo() {
  return supabase.from('modelo_contrato').select('*').eq('id', 1).single();
}

export async function salvarModelo(conteudo) {
  return supabase.from('modelo_contrato').update({ conteudo }).eq('id', 1);
}

export async function buscarContratoPorEvento(eventoId) {
  return supabase
    .from('contratos')
    .select('*')
    .eq('evento_id', eventoId)
    .order('gerado_em', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function listarContratos() {
  return supabase
    .from('contratos')
    .select('id, arquivo_url, codigo_curto, gerado_em, eventos(id, data, tipo_evento, clientes(nome))')
    .order('gerado_em', { ascending: false });
}

export async function urlContrato(caminho) {
  const { data } = await supabase.storage.from('contratos').createSignedUrl(caminho, 3600);
  return data?.signedUrl || null;
}

const formatoMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatoData = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : 'a combinar';

/**
 * Substitui os placeholders {{...}} do texto livre do modelo (cláusulas,
 * termos de pagamento) pelos dados reais do evento/cliente/empresa.
 */
function preencherTexto(modelo, evento, cliente, empresa, formaPagamento) {
  const mapa = {
    NOME: cliente?.nome || 'Cliente',
    CPF: cliente?.cpf || 'não informado',
    TELEFONE: cliente?.whatsapp || 'não informado',
    EMAIL: cliente?.email || 'não informado',
    ENDERECO_CLIENTE: cliente?.endereco || 'não informado',
    DATA: formatoData(evento.data),
    HORARIO: evento.horario ? evento.horario.slice(0, 5) : 'a combinar',
    HORARIO_MONTAGEM: evento.horario_montagem ? evento.horario_montagem.slice(0, 5) : 'a combinar',
    ENDERECO: evento.endereco || 'a combinar',
    VALOR: formatoMoeda(evento.valor_orcamento),
    FORMA_PAGAMENTO: evento.forma_pagamento_combinada || formaPagamento || 'a combinar',
    TIPO_EVENTO: evento.tipo_evento || 'evento',
    TEMA: evento.tema || 'a combinar',
    PACOTE: evento.pacote || 'a combinar',
    EMPRESA_NOME: empresa?.nome || 'Encanto Decorações',
    EMPRESA_CNPJ: empresa?.cnpj || '',
    EMPRESA_ENDERECO: empresa?.endereco || '',
  };
  return modelo.replace(/{{(\w+)}}/g, (match, chave) => mapa[chave] ?? match);
}

/** Converte uma URL de imagem pública em data URL base64 (necessário para o jsPDF embutir a logo). */
async function urlParaDataUrl(url) {
  const resposta = await fetch(url);
  const blob = await resposta.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Gera o PDF do contrato com layout estruturado: cabeçalho (logo + dados
 * da empresa), tabela de Contratante, tabela de Descrição do evento,
 * texto de termos de pagamento (a partir do modelo editável) e dados
 * bancários.
 */
async function gerarPdfEstruturado({ evento, cliente, empresa, formaPagamento, textoTermos, pacoteAcervo }) {
  const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const margem = 40;
  const larguraPagina = doc.internal.pageSize.getWidth();
  const larguraUtil = larguraPagina - margem * 2;
  const alturaPagina = doc.internal.pageSize.getHeight();
  let y = margem;

  const corBanda = [245, 166, 35];    // laranja da marca (--color-gold)
  const corBorda = [225, 220, 210];

  function quebrarPagina(alturaNecessaria) {
    if (y + alturaNecessaria > alturaPagina - margem) {
      doc.addPage();
      y = margem;
    }
  }

  // ---------- Cabeçalho: logo + dados da empresa ----------
  let xTexto = margem;
  if (empresa?.logo_url) {
    try {
      const dataUrl = await urlParaDataUrl(empresa.logo_url);
      doc.addImage(dataUrl, 'PNG', margem, y, 60, 60);
      xTexto = margem + 74;
    } catch {
      // Se a logo não carregar (ex: CORS), segue sem ela — não trava o contrato.
    }
  }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text(empresa?.nome || 'Encanto Decorações', xTexto, y + 14);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
  if (empresa?.cnpj) { doc.text(`CNPJ ${empresa.cnpj}`, xTexto, y + 30); }
  if (empresa?.endereco) { doc.text(empresa.endereco, xTexto, y + 44); }
  y += 76;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
  doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', margem, y);
  y += 22;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
  const preambulo = doc.splitTextToSize(
    `Contrato particular de prestação de serviços de decoração para eventos, que entre si celebram, de um lado ${empresa?.nome || 'Encanto Decorações'}, portadora do CNPJ ${empresa?.cnpj || ''}, doravante denominada CONTRATADA, e, de outro lado, como CONTRATANTE, a pessoa identificada abaixo.`,
    larguraUtil
  );
  doc.text(preambulo, margem, y);
  y += preambulo.length * 12 + 14;

  // ---------- Função auxiliar: banda de seção + tabela label/valor ----------
  function banda(titulo) {
    quebrarPagina(24);
    doc.setFillColor(...corBanda);
    doc.rect(margem, y, larguraUtil, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text(titulo, margem + 8, y + 12.5);
    doc.setTextColor(30, 30, 30);
    y += 18;
  }

  function linhaTabela(label, valor) {
    const larguraLabel = 130;
    const linhasValor = doc.splitTextToSize(String(valor || '—'), larguraUtil - larguraLabel - 20);
    const altura = Math.max(20, linhasValor.length * 12 + 8);

    quebrarPagina(altura);
    doc.setDrawColor(...corBorda);
    doc.rect(margem, y, larguraUtil, altura);
    doc.line(margem + larguraLabel, y, margem + larguraLabel, y + altura);

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text(label, margem + 8, y + 13);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
    doc.text(linhasValor, margem + larguraLabel + 10, y + 13);

    y += altura;
  }

  // ---------- Contratante ----------
  banda('CONTRATANTE');
  linhaTabela('NOME', cliente?.nome);
  linhaTabela('CPF', cliente?.cpf);
  linhaTabela('ENDEREÇO', cliente?.endereco);
  linhaTabela('CONTATO', cliente?.whatsapp);
  y += 14;

  // ---------- Descrição do evento ----------
  banda('DESCRIÇÃO');
  linhaTabela('SERVIÇO', evento.tipo_evento);
  linhaTabela('DATA', `${formatoData(evento.data)}${evento.horario ? ' às ' + evento.horario.slice(0, 5) : ''}`);
  linhaTabela('LOCAL', evento.endereco);

  const descricaoPacote = [
    evento.pacote ? `PACOTE ${evento.pacote.toUpperCase()}${evento.tema ? ' - TEMA ' + evento.tema.toUpperCase() : ''}` : null,
    pacoteAcervo?.itens_inclusos || null,
  ].filter(Boolean).join('\n');
  linhaTabela('DESCRIÇÃO', descricaoPacote || 'a combinar');
  linhaTabela('ORÇAMENTO', formatoMoeda(evento.valor_orcamento));
  y += 14;

  // ---------- Termos de pagamento (texto editável do modelo) ----------
  quebrarPagina(30);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text(`TERMOS DE PAGAMENTO: ${(formaPagamento || 'a combinar').toUpperCase()}`, margem, y);
  y += 16;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
  const linhasTermos = doc.splitTextToSize(textoTermos, larguraUtil);
  linhasTermos.forEach(linha => {
    quebrarPagina(13);
    doc.text(linha, margem, y);
    y += 13;
  });
  y += 14;

  // ---------- Dados bancários ----------
  if (empresa?.banco || empresa?.pix_chave) {
    quebrarPagina(70);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('DADOS BANCÁRIOS', margem, y);
    y += 15;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
    if (empresa.titular_conta) { doc.text(empresa.titular_conta, margem, y); y += 13; }
    if (empresa.banco) { doc.text(empresa.banco, margem, y); y += 13; }
    if (empresa.agencia || empresa.conta) { doc.text(`Ag ${empresa.agencia || ''} Cc ${empresa.conta || ''}`, margem, y); y += 13; }
    if (empresa.pix_chave) { doc.text(`Pix: ${empresa.pix_chave}`, margem, y); y += 13; }
  }

  // ---------- Assinaturas ----------
  y += 30;
  quebrarPagina(60);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
  doc.text('_______________________________', margem, y);
  doc.text(`${cliente?.nome || 'Contratante'} (Contratante)`, margem, y + 14);
  y += 40;
  doc.text('_______________________________', margem, y);
  doc.text(`${empresa?.nome || 'Encanto Decorações'} (Contratada)`, margem, y + 14);

  return doc.output('blob');
}

/**
 * Fluxo completo: busca modelo (termos de pagamento), dados da empresa e
 * do acervo, monta o PDF estruturado, sobe para o Storage e registra em
 * `contratos`. Regenerar o contrato de um evento SUBSTITUI a versão
 * anterior (o PDF e o registro antigos são removidos) — só existe um
 * contrato "atual" por evento, de propósito, para não acumular versões
 * velhas nem confundir sobre qual é a válida.
 */
export async function gerarContrato(evento, cliente, formaPagamento) {
  const { data: modeloRow, error: erroModelo } = await buscarModelo();
  if (erroModelo || !modeloRow) throw new Error('Modelo de contrato não encontrado.');

  const { data: empresa } = await buscarEmpresa();
  const pacoteAcervo = evento.pacote ? await buscarItemPorNome('pacote', evento.pacote) : null;

  const textoTermos = preencherTexto(modeloRow.conteudo, evento, cliente, empresa, formaPagamento);

  const blob = await gerarPdfEstruturado({ evento, cliente, empresa, formaPagamento, textoTermos, pacoteAcervo });

  // Mantém só a versão mais atual do contrato: remove o PDF e o registro
  // de qualquer geração anterior deste evento antes de salvar o novo, para
  // não acumular versões velhas ocupando espaço no Storage.
  const { data: antigos } = await supabase.from('contratos').select('id, arquivo_url').eq('evento_id', evento.id);
  if (antigos?.length) {
    const caminhos = antigos.map(c => c.arquivo_url).filter(Boolean);
    if (caminhos.length) await supabase.storage.from('contratos').remove(caminhos);
    await supabase.from('contratos').delete().eq('evento_id', evento.id);
  }

  const nomeArquivo = `contrato-${evento.id}-${Date.now()}.pdf`;
  const caminho = `${evento.id}/${nomeArquivo}`;
  const { error: erroUpload } = await supabase.storage.from('contratos').upload(caminho, blob, {
    contentType: 'application/pdf',
  });
  if (erroUpload) throw erroUpload;

  const { data: contrato, error: erroInsert } = await supabase
    .from('contratos')
    .insert({ evento_id: evento.id, arquivo_url: caminho, codigo_curto: gerarCodigoCurto() })
    .select()
    .single();
  if (erroInsert) throw erroInsert;

  await registrarAuditoria('gerar_contrato', 'contratos', contrato.id, null, {
    evento_id: evento.id, cliente: cliente?.nome, arquivo: caminho,
  });

  return contrato;
}