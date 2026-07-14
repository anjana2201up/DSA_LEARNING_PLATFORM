// public/js/background.js
// A quiet, responsive particle-network background: dots drift slowly and
// nearby dots connect with a faint line, evoking a graph/network - a nod
// to the graph & tree structures taught on this site. Respects
// prefers-reduced-motion and re-densifies on resize.

(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "bgCanvas";
  canvas.style.cssText = `
    position: fixed; inset: 0; width: 100%; height: 100%;
    z-index: -1; pointer-events: none; display: block;
  `;
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const COLORS = {
    dot: "rgba(232, 163, 61, 0.55)",   // accent amber
    dotAlt: "rgba(61, 219, 217, 0.45)", // accent teal
    line: "rgba(139, 144, 170, 0.14)"
  };

  let W, H, dpr;
  let particles = [];

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function density() {
    // Fewer particles on small screens: keeps things light & battery-friendly.
    const area = W * H;
    const base = Math.round(area / 16000);
    return Math.max(24, Math.min(base, 110));
  }

  function makeParticles() {
    const count = density();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.6 + 0.6,
      alt: Math.random() < 0.35
    }));
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    // Connect nearby particles first (so dots draw on top)
    const linkDist = Math.min(150, Math.max(90, W / 10));
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          ctx.globalAlpha = 1 - dist / linkDist;
          ctx.strokeStyle = COLORS.line;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    for (const p of particles) {
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }
      ctx.beginPath();
      ctx.fillStyle = p.alt ? COLORS.dotAlt : COLORS.dot;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeCanvas();
      makeParticles();
      if (reduceMotion) step(); // redraw once for the new size
    }, 150);
  });

  sizeCanvas();
  makeParticles();
  step();
})();
