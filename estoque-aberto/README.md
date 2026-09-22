# Estoque Aberto (demo de portfólio)

SaaS de controle de faltas de estoque para redes de farmácia/drogaria: o balconista de cada loja registra o que está prestes a faltar, o que já zerou (urgência) e o que foi encomendado por um cliente; o gestor acompanha tudo em tempo real, filtrado por loja e por laboratório, e exporta relatórios em PDF ou Excel.

> **Sobre esta versão:** o projeto original é construído em **Next.js + Postgres (Neon)**, com autenticação real, isolamento de dados por empresa a nível de banco (Row-Level Security) e cobrança recorrente via Asaas. A versão publicada aqui é uma demonstração de portfólio, **reconstruída inteiramente em HTML + CSS + JavaScript puro**, com um "banco de dados" fictício guardado no navegador (`localStorage`) e três empresas de exemplo em situações diferentes de assinatura.

## Papéis do sistema

| Papel | Acesso nesta demo |
|---|---|
| **Admin** | Vê todas as empresas clientes da plataforma, com status da assinatura e pode liberar acesso manualmente. Entre em "Entrar como Admin" na tela de login. |
| **Gestor** | Acompanha as faltas de todas as lojas da empresa, cadastra lojas e convida outros gestores. Entre em "Entrar" na tela de login (a demo sempre usa a empresa "Rede Saúde Popular", ativa). |
| **Loja** (balconista) | Sem senha: entra com o código de acesso gerado pelo gestor. Use o código `7K3PXQ` (Loja Centro) na tela inicial. |

## Funcionalidades

**Painel do Admin:**
- Tabela com todas as empresas clientes: status (período grátis, ativa, inadimplente, cancelada), quantidade de lojas e gestores, data de criação.
- Liberar manualmente o acesso de uma empresa até uma data escolhida.

**Painel do Gestor:**
- **Faltas**: lista de tudo que foi lançado pelas lojas, com filtro por loja, laboratório e período, e exportação em Excel/PDF (simulada nesta demo).
- **Lojas**: cadastro de lojas com geração de código de acesso (mostrado uma única vez), ativar/desativar e gerar novo código.
- **Equipe**: convidar outros gestores por e-mail (associado a uma loja específica, opcional) e ver convites pendentes.
- **Assinatura**: status do plano, dias restantes de período grátis, e botão para assinar (pagamento simulado nesta demo).
- Se o período grátis termina sem assinatura, o painel mostra um aviso e a loja não consegue mais lançar novas faltas (o histórico continua visível).

**Tela da Loja (balconista):**
- Três tipos de lançamento: Falta comum, Urgência (zerado) e Encomenda (com nome e telefone do cliente).
- Campo de laboratório com sugestões automáticas, observação livre, e histórico dos últimos 20 lançamentos daquela loja.

## Como usar

1. Abra `index.html` e escolha um dos três acessos.
2. Como balconista, use o código `7K3PXQ` e registre uma falta, urgência ou encomenda.
3. Como gestor (qualquer e-mail/senha), veja o lançamento aparecer na aba Faltas, cadastre uma loja nova ou convide um gestor.
4. Como admin (qualquer e-mail/senha), veja as três empresas fictícias em diferentes situações de assinatura.

## Estrutura do projeto

```
estoque-aberto/
├── index.html          # página inicial pública (3 acessos)
├── login.html            # login de gestor/admin
├── cadastro.html          # criar empresa (trial de 7 dias)
├── privacidade.html         # política de privacidade
├── admin/                    # tabela de empresas clientes
├── gestor/                     # faltas, lojas, equipe, assinatura
├── loja/                         # entrada por código + registro de faltas
├── js/data.js                     # empresas, lojas e lançamentos fictícios
├── js/layout.js                    # topbar, navegação e tour de boas-vindas
└── css/app.css                      # estilos compartilhados
```

## Dados fictícios

As três empresas do painel do Admin, suas lojas, lançamentos, laboratórios e nomes de clientes em encomendas são todos fictícios, gerados uma vez e guardados no navegador. Os laboratórios usados no catálogo (NEOFARMA, BIOSAÚDE, REALFARMA, VITAPLUS) não correspondem a nenhuma marca real.

## Tecnologia

Página estática, sem framework e sem etapa de build: só HTML, CSS e JavaScript puro, com dados em `localStorage`.

## Como rodar localmente

```bash
cd estoque-aberto
python3 -m http.server 8000
```

Depois é só abrir `http://localhost:8000` no navegador.
