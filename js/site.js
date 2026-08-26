/* ==========================================================================
   PORTFÓLIO — Heverton Monteiro
   Rede de partículas animada (hero), contadores e revelação ao rolar.
   ========================================================================== */

function iniciarParticulas() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let largura, altura, pontos;
  const DENSIDADE = 14000; // px² por partícula
  const DISTANCIA_LIGACAO = 130;
  const CORES = ['34,211,238', '167,139,250', '99,102,241'];

  function dimensionar() {
    const rect = canvas.parentElement.getBoundingClientRect();
    largura = canvas.width = rect.width;
    altura = canvas.height = rect.height;
    const total = Math.min(90, Math.floor((largura * altura) / DENSIDADE));
    pontos = Array.from({ length: total }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      cor: CORES[Math.floor(Math.random() * CORES.length)],
    }));
  }

  function passo() {
    ctx.clearRect(0, 0, largura, altura);
    pontos.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > largura) p.vx *= -1;
      if (p.y < 0 || p.y > altura) p.vy *= -1;
    });
    for (let i = 0; i < pontos.length; i++) {
      for (let j = i + 1; j < pontos.length; j++) {
        const a = pontos[i], b = pontos[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < DISTANCIA_LIGACAO) {
          ctx.strokeStyle = `rgba(140,170,220,${(1 - dist / DISTANCIA_LIGACAO) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    pontos.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.cor},0.8)`;
      ctx.fill();
    });
    if (!prefereMenosMovimento) requestAnimationFrame(passo);
  }

  dimensionar();
  window.addEventListener('resize', dimensionar);
  passo();
}

function ativarReveal() {
  const revelaveis = document.querySelectorAll('.reveal');
  if (!revelaveis.length) return;
  if (!('IntersectionObserver' in window)) {
    revelaveis.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  revelaveis.forEach((el) => observer.observe(el));
}

function ativarContadores() {
  const contadores = document.querySelectorAll('[data-contador]');
  if (!contadores.length || !('IntersectionObserver' in window)) return;
  const animar = (el) => {
    const alvo = parseInt(el.getAttribute('data-contador'), 10) || 0;
    const duracao = 1100;
    let inicio = null;
    const passo = (timestamp) => {
      if (!inicio) inicio = timestamp;
      const progresso = Math.min((timestamp - inicio) / duracao, 1);
      el.textContent = Math.floor(progresso * alvo);
      if (progresso < 1) requestAnimationFrame(passo);
      else el.textContent = alvo;
    };
    requestAnimationFrame(passo);
  };
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) { animar(entrada.target); observer.unobserve(entrada.target); }
    });
  }, { threshold: 0.4 });
  contadores.forEach((el) => observer.observe(el));
}

iniciarParticulas();
ativarReveal();
ativarContadores();
