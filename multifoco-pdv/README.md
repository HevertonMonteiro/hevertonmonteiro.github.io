# Multifoco PDV (demo de portfólio)

Ferramenta de apoio ao vendedor durante o atendimento presencial em farmácias: consulta o catálogo de produtos, anota o estoque da loja, monta o pedido do cliente e gera os arquivos prontos para importação, tudo direto do celular, tablet ou computador, sem instalar nada.

> **Sobre esta versão:** este projeto nasceu para uso real de vendedores em farmácias. A versão publicada aqui é uma demonstração de portfólio: nomes de indústria/laboratório, preços e códigos de barras foram substituídos por dados fictícios, e a integração com a planilha do gestor está desligada (sem URL configurada). Todas as demais funcionalidades são as mesmas do projeto original.

## Funcionalidades

- **Catálogo de produtos** com busca por descrição, EAN ou código do produto, e filtro por laboratório (ou só os itens já incluídos no atendimento).
- **Anotação de estoque da loja**, com o estoque das distribuidoras (dado fictício nesta demo) mostrado lado a lado para comparação.
- **Montagem do pedido do cliente**, exportado em `.xlsx` já no formato pronto para importação (CNPJ, EAN, Quantidade).
- **Sugestão de pedido**, calculada a partir do estoque anotado na loja, exportável em CSV ou PDF.
- **Revisão do pedido por distribuidora**: ao finalizar, escolhe (ou ajusta manualmente) qual distribuidora atende cada item, mostra o total por distribuidora frente ao pedido mínimo de cada uma, e exporta um `.xlsx` por distribuidora ou um único PDF com todas separadas por página.
- **Persistência local**: fechar a aba ou dar F5 não perde o atendimento em andamento (expira sozinho depois de alguns minutos de inatividade).
- **Compartilhamento nativo**: no celular, os arquivos exportados podem ser enviados direto por qualquer app instalado; no computador, são baixados normalmente.
- **Indicadores em tempo real** no topo: quantidade de itens e valor do pedido, por laboratório e total geral.
- **Observações de preço da concorrência** registradas pelo vendedor, com histórico completo (cada registro fica salvo, nada é sobrescrito). Nesta demo ficam só no navegador; em uso real são sincronizadas com uma Planilha Google do gestor, com fila de reenvio caso a internet caia.
- **Tour de boas-vindas** na primeira visita, reaberto a qualquer momento pelo botão "?" no canto da tela.
- **Totalmente responsivo**: em tablet e celular a lista de produtos vira cartões e o painel de seleção fica acessível pelo chip "Total" no topo; em qualquer tela, a busca e o cabeçalho da tabela ficam fixos ao rolar.

## Como usar

1. Abra `index.html` num navegador.
2. Preencha loja, CNPJ, vendedor e data para iniciar o atendimento, ou clique em "Preencher com dados de exemplo".
3. Use a busca para encontrar produtos e anote estoque e/ou pedido.
4. Exporte o pedido, ou gere uma sugestão de pedido a partir do estoque anotado.
5. Use "Finalizar pedido" para revisar a distribuidora de cada item e começar o próximo atendimento.

## Estrutura do projeto

| Arquivo | Descrição |
|---|---|
| `index.html` | Aplicação completa (HTML + CSS + JS), sem necessidade de build. |
| `produtos.js` | Catálogo de produtos usado pelo app, com EAN e preços fictícios. |
| `gerar-produtos.py` | Script original para gerar `produtos.js` a partir de uma planilha real de preços (não usado nesta demo). |
| `planilha-gestor-apps-script.gs` | Código de referência para a integração com Google Sheets (não ativado nesta demo). |
| `libs/` | Bibliotecas de terceiros usadas offline (SheetJS para `.xlsx`, jsPDF + AutoTable para PDF). |

## Dados fictícios

`produtos.js` mantém a mesma estrutura do catálogo original (descrição, categoria/laboratório, código interno), mas com EAN gerado no prefixo `200...` (reservado pela GS1 para uso interno, nunca emitido a empresas reais), preços recalculados aleatoriamente a partir dos originais e os três laboratórios renomeados para nomes fictícios (VITALIS, DERMIX, BABYCARE). As distribuidoras usadas na revisão do pedido (Distribuidora Horizonte, União e Rápida) e o estoque que elas retornam também são fictícios, gerados na hora só para esta demonstração.

## Tecnologia

Página estática, sem framework e sem etapa de build: só HTML, CSS e JavaScript puro. Bibliotecas de terceiros vendorizadas em `libs/`:

- [SheetJS (xlsx)](https://sheetjs.com/): geração do arquivo de pedido em `.xlsx`.
- [jsPDF](https://github.com/parallax/jsPDF) + [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable): geração do relatório de estoque em PDF.

## Como rodar localmente

```bash
cd multifoco-pdv
python3 -m http.server 8000
```

Depois é só abrir `http://localhost:8000` no navegador.
