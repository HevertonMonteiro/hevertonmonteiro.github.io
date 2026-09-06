# PRECIFÁCIL · Consulta e Pedidos (demo de portfólio)

Ferramenta para consultar preços e montar pedidos em segundos, direto do celular, sem depender de planilha aberta ou internet depois do primeiro carregamento.

Você digita os itens de qualquer jeito (com erro de digitação, abreviação, nome incompleto), ou simplesmente navega pelo catálogo, e o PRECIFÁCIL cruza com a tabela de preços e devolve o resultado pronto para colar no WhatsApp ou lançar em um sistema.

> **Sobre esta versão:** este projeto nasceu para uso real em uma distribuidora de genéricos. A versão publicada aqui é uma demonstração de portfólio: nome da empresa, logo, preços e códigos de barras foram substituídos por dados fictícios. A lógica de busca, o motor de correspondência e todas as funcionalidades são as mesmas do projeto original.

## O que ele faz

- **Seleção de estado**: a tela inicial pede o estado (hoje: Alagoas, Bahia, Paraíba, Pernambuco, Rio Grande do Norte e Sergipe), cada um com sua própria tabela de preços.
- **Consulta de preços**: cola a lista de itens, recebe de volta "Produto: R$ XX,XX" pronto para encaminhar ao cliente.
- **Geração de pedido por lista**: a partir da mesma lista (ou dos itens já consultados), gera "código de barras + quantidade", um por linha.
- **Fazer pedido navegando pelo catálogo**: em vez de digitar, é possível abrir a tabela inteira, buscar ou filtrar por categoria (Linha, Prioritário, Lançamento, Descontinuado, Combate) e por selo especial (Controlado, Antibiótico, Anticoncepcional, Oftálmico), e ir informando a quantidade de cada item.
- **Busca inteligente e cautelosa**: entende erro de digitação e abreviação ("olme" = olmesartana, "gts" = gotas, "cp" = comprimido), mas nunca troca a dosagem pedida por outra parecida.
- **Detecta ambiguidade de verdade**: quando existe mais de uma apresentação válida, o app para e pergunta qual é a certa, em vez de escolher sozinho.
- **Editar antes de fechar**: dá para ajustar quantidades ou remover itens antes de gerar o pedido.
- **Lista de Faltas**: itens não encontrados entram automaticamente numa lista separada, pronta para copiar.
- **Funciona offline** depois de carregado, sem servidor, banco de dados ou login.
- **Tour de boas-vindas**: depois de escolher o estado, uma sequência de telas explica o fluxo; pode ser reaberta a qualquer momento pelo botão "?" no canto da tela.

## Como usar

1. Na tela inicial, escolha o estado.
2. Escolha a tabela (Tabela 1, 2 ou 3), ou clique em **Fazer pedido** no topo para ir direto ao catálogo navegável.
3. Decida o que precisa: consultar preço ou gerar pedido a partir de uma lista digitada.
4. Cole a lista de itens (um por linha) ou navegue/busque pelo catálogo e informe as quantidades.
5. Confira o resultado, copie e use como quiser.

## Tecnologia

- **HTML + CSS + JavaScript puro**, sem framework e sem etapa de build, dividido em `index.html` + `style.css` + `app.js`.
- **[SheetJS](https://sheetjs.com/)** (via CDN) para ler a planilha `.xlsx` direto no navegador.
- Motor de busca próprio (normalização de texto, extração de dosagem, comparação por similaridade).
- Pensado para rodar no **GitHub Pages**: é só um link, sem custo de servidor.

## Como rodar localmente

O navegador bloqueia `fetch` de arquivos locais por segurança, então é preciso servir os arquivos:

```bash
cd gerboot
python3 -m http.server 8000
```

Depois é só abrir `http://localhost:8000` no navegador.

## Estrutura

```
gerboot/
├── index.html      # marcação e estrutura da página
├── style.css       # estilos
├── app.js          # lógica da aplicação (busca, parsing, geração de pedido)
├── TABELAS.xlsx    # planilha com as tabelas de preço fictícias, uma aba por estado/tabela
├── manifest.json   # manifesto PWA
├── logo.png, apple-touch-icon.png, icon-192.png, icon-512.png, og-image.png
└── README.md
```

## Dados fictícios

A planilha `TABELAS.xlsx` mantém a mesma estrutura do arquivo original (nomes de produtos genéricos, categorias, unidades por caixa), mas os códigos de barras usam o prefixo `200`, reservado pela GS1 para uso interno e nunca emitido para empresas reais, e os preços foram gerados aleatoriamente a partir dos originais. Não correspondem a nenhum preço real praticado.

## Aviso

O PRECIFÁCIL usa heurísticas para interpretar o que foi digitado e casar com o produto certo da tabela. Como toda ferramenta desse tipo, não é infalível, o aviso aparece diretamente nas telas de resultado do app.
