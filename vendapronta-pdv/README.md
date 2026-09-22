# VENDAPRONTA PDV (demo de portfólio)

Plataforma multi-empresa de apoio à equipe de vendas externa: cada empresa cliente cadastra seu próprio catálogo, distribuidoras, promoções e destaques; cada vendedor acessa pelo celular, tablet ou computador, sem instalar nada, para consultar preços, levantar estoque na loja, montar o pedido do cliente e exportar tudo pronto para importação.

> **Sobre esta versão:** este projeto nasceu para uso real de uma distribuidora de genéricos, hoje reconstruído como SaaS (Next.js + Postgres real). A versão publicada aqui é uma demonstração de portfólio, 100% estática: nome da empresa, distribuidoras, laboratórios, preços e códigos de barras foram substituídos por dados fictícios, e as três telas de login (Dono, Gestor e Vendedor) aceitam qualquer credencial.

## Papéis do sistema

| Papel | Acesso nesta demo |
|---|---|
| **Dono** | Vê todas as empresas clientes da plataforma, aprova cadastros, marca pagamento e liga/desliga funcionalidades por empresa. Entre pela tela inicial em "Entrar como Dono". |
| **Gestor** | Cadastra catálogo, distribuidoras, promoções e destaques; consulta observações de preço da concorrência enviadas pelos vendedores. Entre pela tela inicial em "Entrar como Gestor" (a demo sempre usa a empresa "Distribuidora Central Farma", ativa e com pagamento em dia). |
| **Vendedor** | Sem login/senha: entra com o código de 6 dígitos gerado na aprovação da empresa (`482913` para a empresa de demonstração). Sessão de atendimento (loja/CNPJ/carrinho) é efêmera, guardada só no navegador por até 5 minutos. |

## Funcionalidades

**Painel do Dono:**
- Lista de empresas clientes com indicador visual de situação (verde = tudo em dia, vermelho = pendente ou bloqueado).
- Aprovar cadastro (gera o código de acesso da equipe na primeira aprovação), bloquear/reativar acesso, marcar pagamento como em dia ou pendente.
- Ligar/desligar por empresa: levantamento de estoque, sugestão de pedido, exportação por distribuidora, observações de concorrência e PDF único.

**Painel do Gestor** (abas Catálogo, Promoções, Destaques, Distribuidoras, Observações e Configurações):
- Importar a tabela de preços (simulado nesta demo, o catálogo já vem pronto).
- Criar promoções por produto (percentual ou preço fixo, geral ou só para uma distribuidora, com vigência) e destaques (⭐, com vigência).
- Cadastrar até 6 distribuidoras, cada uma com seu pedido mínimo.
- Acompanhar e exportar as observações de preço da concorrência enviadas pelos vendedores.
- Ver o código de acesso da equipe (aba Configurações).
- Se a empresa é bloqueada ou fica com pagamento pendente pelo Dono, o painel do Gestor mostra um aviso e nenhuma aba fica acessível, tudo em tempo real.

**App do Vendedor:**
- Código de acesso da empresa (uma vez por aparelho), depois dados do atendimento (loja, CNPJ, vendedor, data).
- Escolha entre **Fazer levantamento** (conta o estoque da loja, sem calcular valor) ou **Fazer pedido** direto; quem passa pelo levantamento ganha, na tela de pedido, uma coluna "Estoque Anotado" e um link para voltar e ajustar a contagem.
- Catálogo com busca, filtro por laboratório, por itens já incluídos, em promoção ou em destaque; preços em promoção aparecem riscados com o valor novo ao lado.
- Sugestão de pedido baseada no levantamento, revisão do pedido por distribuidora (com total por distribuidora frente ao pedido mínimo), exportação em `.xlsx`/PDF, e registro de preço da concorrência com histórico completo.
- Funciona offline depois de carregado; sessão sobrevive a F5 por até 5 minutos.

## Como usar

1. Abra `index.html`, o link do card do portfólio já leva direto para cá.
2. Escolha "Entrar como Dono" para ver a lista de empresas e aprovar/bloquear a que estiver pendente, ou "Entrar como Gestor" para mexer no catálogo, promoções e distribuidoras.
3. Clique em "É vendedor? Entrar com o código da empresa" (ou abra `vendedor/index.html` direto) e use o código `482913` para explorar o aplicativo de atendimento.

## Estrutura do projeto

```
vendapronta-pdv/
├── index.html            # login (Dono/Gestor)
├── cadastro.html          # cadastro de nova empresa
├── dono/                  # lista de empresas + aprovação/funcionalidades
├── gestor/                # catálogo, promoções, destaques, distribuidoras, observações, config
├── vendedor/               # app do vendedor (índice + catálogo + libs)
├── js/data.js              # empresas, distribuidoras, promoções, destaques e observações fictícias
├── js/layout.js            # topbar, abas do gestor e tour de boas-vindas
└── css/app.css             # estilos compartilhados do Dono e do Gestor
```

## Dados fictícios

O catálogo de produtos (em `vendedor/produtos.js`) mantém a mesma estrutura do original, mas com EAN gerado no prefixo `200...` (reservado pela GS1 para uso interno, nunca emitido a empresas reais), preços recalculados aleatoriamente e os laboratórios renomeados (VITALIS, DERMIX, BABYCARE). As três empresas do painel do Dono, as distribuidoras, promoções, destaques e observações de concorrência são todos fictícios, gerados uma vez e guardados no navegador.

## Tecnologia

Página estática, sem framework e sem etapa de build: só HTML, CSS e JavaScript puro, com dados em `localStorage`. Bibliotecas de terceiros vendorizadas em `vendedor/libs/`:

- [SheetJS (xlsx)](https://sheetjs.com/): geração do arquivo de pedido em `.xlsx`.
- [jsPDF](https://github.com/parallax/jsPDF) + [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable): geração de relatórios em PDF.

## Como rodar localmente

```bash
cd vendapronta-pdv
python3 -m http.server 8000
```

Depois é só abrir `http://localhost:8000` no navegador.
