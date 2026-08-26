# Corretora de Milhões (demo de portfólio)

Site para uma corretora de imóveis independente: vitrine pública com busca e filtros, ficha de cada imóvel com galeria de fotos, depoimentos de clientes, contato direto pelo WhatsApp, e um painel de autoatendimento onde a corretora cadastra imóveis, publica negócios fechados e modera depoimentos.

> **Sobre esta versão:** o projeto original é construído em **Python + Django** (com banco de dados, autenticação e upload de arquivos no servidor) — veja a seção [Sobre a versão original em Django](#sobre-a-versão-original-em-django). Como GitHub Pages só serve arquivos estáticos, esta versão de portfólio foi **reconstruída inteiramente em HTML + CSS + JavaScript puro**, reproduzindo as mesmas telas e o mesmo design, com um "banco de dados" fictício guardado no navegador (`localStorage`) no lugar do Django + banco real.

## Acesso ao painel

Abra `painel/login.html`. **Não existe usuário/senha real nesta demo: qualquer e-mail e senha preenchidos entram no painel** (aviso também visível na própria tela de login).

## Funcionalidades

**Site público:**
- Home com destaques, negócios fechados recentes, depoimentos e estatísticas animadas.
- Vitrine de imóveis com busca por texto e filtros (negócio, tipo, cidade, bairro, quartos, faixa de valor) — filtro em tempo real, sem recarregar a página.
- Página de cada imóvel: galeria de fotos com lightbox, características, mapa (embed do Google Maps) e botão de interesse.
- Formulário de contato: registra o contato e redireciona para o WhatsApp com a mensagem pronta.
- Formulário de depoimento, com aprovação pendente até revisão da corretora.

**Painel da corretora** (login fictício, `/painel/`):
- Dashboard com contadores (imóveis, disponíveis, fechados, leads pendentes, depoimentos pendentes).
- Cadastro/edição de imóveis, com upload de várias fotos.
- Troca rápida de status (disponível/reservado/vendido/alugado) direto na listagem.
- Publicar "negócio fechado" (aparece na home).
- Moderar depoimentos (aprovar/excluir).
- Ver contatos recebidos pelo formulário público.
- Link para reiniciar os dados de demonstração a qualquer momento.

## Sobre a versão original em Django

O projeto real usa Django 5 (ORM, admin, autenticação), SQLite/PostgreSQL, upload de imagens com Pillow e templates server-side. Nesta versão estática:

- Cada "tabela" do banco (imóveis, fotos, depoimentos, leads, realizações, perfil da corretora) virou um array guardado em `localStorage`, com funções JavaScript equivalentes às views do Django (`js/store.js`).
- O upload de fotos vira uma leitura do arquivo como `data:` URL, guardada no navegador (sem servidor de imagens).
- O login do painel, que no Django usa `django.contrib.auth`, virou uma sessão fictícia (`js/auth.js`) que aceita qualquer credencial — apropriado para uma demonstração pública, onde não existe usuário real para proteger.
- Os filtros da vitrine, que no Django batiam num endpoint AJAX (`_grid.html`), agora filtram o array em memória, direto no navegador.

O design (paleta rosé & grafite, tipografia Playfair Display + Poppins) e a estrutura visual das telas são os mesmos do projeto original — `css/style.css` foi reaproveitado quase sem alterações.

## Tecnologia

- **HTML5 + CSS3 + JavaScript puro**, sem framework e sem etapa de build.
- Nenhuma dependência externa além das fontes do Google Fonts.

## Como rodar localmente

```bash
cd corretora-de-milhoes
python3 -m http.server 8000
```

Depois é só abrir `http://localhost:8000` no navegador.

## Dados fictícios

Nome, CRECI, contatos da corretora e todos os imóveis, depoimentos e leads são fictícios. As fotos são imagens de exemplo (gradientes com legenda), já que não há fotos reais de imóveis neste projeto de demonstração.
