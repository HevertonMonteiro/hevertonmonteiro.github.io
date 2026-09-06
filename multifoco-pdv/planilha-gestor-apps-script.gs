/*
  PLANILHA DO GESTOR — integração com o VENDAPRONTA PDV
  ======================================================

  O QUE ISSO FAZ
  Recebe, via internet, cada observação de preço da concorrência que um
  vendedor registra no app (VENDAPRONTA PDV) e grava como uma linha nova
  numa aba desta Planilha Google. O gestor abre a planilha normalmente
  e vê tudo chegando em tempo real, de qualquer loja/vendedor.

  COMO INSTALAR (uma vez só)
  1. Crie (ou abra) a Planilha Google que o gestor vai usar.
  2. No menu, vá em: Extensões > Apps Script.
  3. Apague o conteúdo padrão do arquivo "Code.gs" e cole todo o código
     abaixo no lugar.
  4. Salve o projeto (ícone de disquete). Dê um nome, ex: "VENDAPRONTA PDV - Sync".
  5. Clique em "Implantar" (Deploy) > "Nova implantação".
     - Tipo de implantação: "App da Web" (Web app).
     - Descrição: à vontade.
     - Executar como: "Eu" (sua própria conta Google).
     - Quem pode acessar: "Qualquer pessoa" (Anyone).
       (Precisa ser "Qualquer pessoa" para o app dos vendedores conseguir
       enviar dados sem precisar fazer login com conta Google.)
  6. Clique em "Implantar". A primeira vez vai pedir para autorizar o
     script a acessar a planilha — autorize com sua conta.
  7. Copie a URL que aparece (termina em "/exec"). Essa é a URL que você
     vai colar em "⚙ Configurar planilha do gestor" dentro do app
     VENDAPRONTA PDV (em cada dispositivo/vendedor que for usar).

  IMPORTANTE
  - Se você editar este script depois, precisa criar uma "Nova
    implantação" de novo (ou gerenciar implantações e publicar uma nova
    versão) para as mudanças valerem na URL que já está em uso.
  - A aba "Observações" é criada automaticamente na primeira vez que
    uma observação chegar.
*/

const SHEET_NAME = 'Observações';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),                 // Recebido em
      data.loja || '',
      data.cnpj || '',
      data.vendedor || '',
      data.dataAtendimento || '',
      data.ean || '',
      data.produto || '',
      data.precoTabela != null ? data.precoTabela : '',
      data.labConcorrente || '',
      data.precoConcorrente != null ? data.precoConcorrente : '',
      data.observacao || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Recebido em', 'Loja', 'CNPJ', 'Vendedor', 'Data do Atendimento',
      'EAN', 'Produto', 'Preço de Tabela', 'Laboratório Concorrente',
      'Preço Informado pelo Cliente', 'Observação'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
