# Encanto Decorações — Sistema de Gestão (demo de portfólio)

Sistema operacional web para empresas de decoração de festas e ensaios fotográficos: centraliza clientes, eventos, agenda, produção, financeiro, contratos e acervo em um único painel.

> **Sobre esta versão:** este sistema foi construído para uso real de uma empresa de decoração de eventos, com Supabase (Postgres + Auth + Storage), Vercel e integrações reais de IA, pagamento e calendário. A versão publicada aqui é uma demonstração de portfólio: nome da empresa, logo e dados fictícios, e **todo o backend roda dentro do próprio navegador** — sem servidor, sem banco de dados e sem chaves de API. Veja a seção [Como isso funciona sem backend](#como-isso-funciona-sem-backend) para entender a arquitetura.

## Acesso

Abra `pages/login.html` e use um dos acessos de demonstração (também disponíveis direto na tela):

| Perfil | E-mail | Senha |
|---|---|---|
| Administradora | `admin@demo.com` | `demo123` |
| Equipe (padrão) | `equipe@demo.com` | `demo123` |

Os dois perfis mostram permissões diferentes (por exemplo, só a administradora pode alterar o perfil de acesso de outro usuário).

## Funcionalidades

- **Dashboard** com indicadores financeiros e de eventos, período configurável, gráfico de status.
- **Clientes**: cadastro, busca, ficha com histórico de eventos, financeiro e contratos.
- **Eventos**: orçamento → confirmado → concluído → finalizado, com transição automática por data e por pagamento.
- **Agenda**: visão diária/semanal/mensal, bloqueio de datas, verificação de disponibilidade.
- **Financeiro**: lançamento de pagamentos com comprovante obrigatório, e trava automática contra receber mais do que o orçamento do evento.
- **Contratos**: geração de PDF a partir de um modelo editável, com dados da empresa e do evento.
- **Acervo**: catálogo de temas, pacotes e ensaios, com fotos.
- **Funcionários**: histórico de pagamentos por pessoa (imutável — correções entram como novo lançamento, nunca editando o antigo).
- **Usuários e Auditoria**: controle de acesso por perfil e log de toda ação relevante do sistema.
- **Relatórios**: painel gerencial por período, comparação com período anterior, exportação em PDF.
- **Roteiro do dia**: resumo do que a equipe precisa saber para a produção de cada evento.

Recursos que dependem de serviços externos reais — importação de conversa por IA (Gemini), cobrança via Mercado Pago e sincronização com Google Agenda — mostram um aviso explicando que estão desativados nesta demonstração, em vez de simplesmente falhar.

## Como isso funciona sem backend

O sistema original fala com o Supabase (`supabase.from('tabela').select()...`, `supabase.auth...`, `supabase.storage...`) em praticamente todos os seus ~20 módulos e páginas. Reescrever cada um deles para uma demo seria arriscado e difícil de manter — então, em vez disso, **[`js/lib/supabase-client.js`](js/lib/supabase-client.js) foi reescrito como um banco de dados simulado que implementa a mesma interface encadeável do cliente Supabase**, guardando os dados no `localStorage` do navegador:

- `supabase.from('eventos').select('...').eq(...).order(...)` — um pequeno interpretador de consultas resolve filtros, ordenação, `limit`, `single`/`maybeSingle`, contagem e até relacionamentos aninhados (ex: um pagamento trazendo o evento, que traz o cliente).
- `supabase.storage.from('bucket').upload/getPublicUrl/createSignedUrl` — arquivos viram `data:` URLs guardadas no navegador.
- `supabase.auth.*` — sessão simulada validada contra os usuários de demonstração.
- Regras de negócio que no sistema real vivem em *triggers* do Postgres (ex: não deixar um pagamento passar do valor do orçamento, atualizar o status do evento automaticamente) foram replicadas em JavaScript.
- Chamadas `fetch('/api/...')` para as funções de servidor (Mercado Pago, Google Agenda, IA) são interceptadas e respondidas com um aviso de "recurso desativado nesta demonstração".

Resultado: **nenhum outro arquivo do sistema precisou ser alterado** — os mais de 30 arquivos de página e módulo continuam chamando o "Supabase" exatamente como no sistema em produção, sem saber que estão falando com um banco simulado.

Use o link **"Reiniciar dados de demonstração"** no rodapé do menu lateral para apagar tudo que foi alterado nesta sessão e voltar aos dados fictícios originais.

## Tecnologia

- **HTML5 + CSS3 + JavaScript (ES Modules)**, sem framework e sem etapa de build.
- [Chart.js](https://www.chartjs.org/) para os gráficos do Dashboard e Relatórios.
- [jsPDF](https://github.com/parallax/jsPDF) para geração dos PDFs de contrato e relatório.

## Como rodar localmente

Por usar ES Modules, é preciso servir os arquivos (não funciona abrindo `index.html` direto no navegador):

```bash
cd encanto-decoracoes
python3 -m http.server 8000
```

Depois é só abrir `http://localhost:8000` no navegador.

## Dados fictícios

Clientes, eventos, pagamentos, contratos, funcionários, acervo e configurações da empresa são todos fictícios, gerados na primeira vez que o sistema carrega. Qualquer alteração feita durante o uso fica salva apenas no navegador de quem está testando.
