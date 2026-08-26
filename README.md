# Portfólio — Heverton Monteiro

Site de portfólio com sistemas reais que construí, publicados aqui como demonstrações interativas — com dados fictícios, sem precisar de banco de dados nem servidor.

## 🔗 Acesse o portfólio online

**[https://hevertonmonteiro.github.io/](https://hevertonmonteiro.github.io/)**

> Link do Vercel: em breve.

[LinkedIn](https://www.linkedin.com/in/heverton-monteiro-301203248) · [GitHub](https://github.com/HevertonMonteiro)

## Estrutura

```
PORTIFOLIO/
├── index.html              # página inicial (hub) do portfólio
├── css/site.css             # estilos do hub
├── js/site.js                # partículas animadas, contadores, revelação ao rolar
├── assets/                  # capas dos projetos, favicons
│
├── gerboot/                  # consulta de preços e pedidos (farmácia)
├── multifoco-pdv/            # apoio ao vendedor em farmácias (PDV)
├── encanto-decoracoes/       # gestão para empresas de decoração de eventos
├── corretora-de-milhoes/     # vitrine e painel para corretora de imóveis
└── rs-turismo/               # site institucional (publicado de verdade)
```

Cada projeto tem seu próprio `README.md` explicando o que foi adaptado em relação ao sistema original.

## Sobre estas demonstrações

Quatro dos cinco projetos (GERBOOT, Multifoco PDV, Encanto Decorações, Corretora de Milhões) foram construídos originalmente para uso real com dados de negócio reais — clientes, preços, contratos. Para publicar aqui como portfólio:

- **Dados fictícios**: nomes, preços, códigos de barras, CNPJ, contatos — tudo o que poderia identificar uma empresa ou pessoa real foi substituído.
- **Sem backend**: projetos que originalmente dependiam de banco de dados (Supabase) ou de um framework server-side (Django) foram adaptados para rodar 100% no navegador, com os dados guardados em `localStorage`. Nenhuma dessas quatro demonstrações depende de servidor, chave de API ou conexão externa.
- **Tour guiado**: cada um tem um tour de boas-vindas explicando como usá-lo, já que quem visita não conhece o negócio por trás dele.
- **Login sem fricção**: nos sistemas que têm painel administrativo, qualquer e-mail e senha preenchidos dão acesso — é só para você poder explorar sem precisar de uma credencial real.

O quinto projeto, **RS Turismo**, é diferente: é um site institucional público (sem painel, sem dados de clientes) e está publicado aqui no formato original, sem edição — é o mesmo site em produção. A única alteração é que o formulário de contato não envia e-mail de verdade nesta cópia, para não gerar mensagens de teste na caixa de entrada real da empresa.

## Como rodar localmente

Cada pasta funciona de forma independente. Para rodar o hub e navegar por tudo:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.
