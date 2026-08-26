/* ==========================================================================
   ENCANTO DECORAÇÕES — Domínio de produção
   Usado sempre que o sistema precisa montar um link PÚBLICO (compartilhado
   com o cliente por WhatsApp/e-mail) — nunca usamos window.location.origin
   para isso, porque se alguém estiver testando numa URL de pré-visualização
   da Vercel (as que têm um código aleatório no meio), esse link ficaria
   protegido por login e o cliente não conseguiria abrir.

   Se um dia o domínio mudar (ex: domínio próprio tipo encantodecoracoes.com.br),
   troque só esta linha — nada mais no sistema depende do valor exato.
   ========================================================================== */

export const SITE_URL = 'https://encanto-decoracoes.vercel.app';
