// public/js/background.js
// A responsive particle-network background: dots drift slowly, nearby dots
// connect with a faint line (a nod to graphs/trees), the whole field gently
// parallax-pans toward the cursor, and a soft glow follows the pointer.
// Colors are read live from the active theme's CSS variables, so switching
// dark/aurora/light re-colors the background automatically. Respects
// prefers-reduced-motion and stays light on mobile.

(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "bgCanvas";
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block;";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  let COLORS = { dot: "rgba(232,163,61,0.55)", dotAlt: "rgba(61,219,217,0.45)", line: "rgba(139,144,170,0.14)", glow: "rgba(232,163,61,0.10)" };

  function readThemeColors() {
    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue("--accent").trim() || "#E8A33D";
    const accent2 = style.getPropertyValue("--accent-2").trim() || "#3DDBD9";
    const muted = style.getPropertyValue("--text-muted").trim() || "#8B90AA";
    COLORS = {
      dot: hexToRgba(accent, 0.55),
      dotAlt: hexToRgba(accent2, 0.45),
      line: hexToRgba(muted, 0.16),
      glow: hexToRgba(accent, 0.09)
    };
  }
  function hexToRgba(hex, alpha) {
    const h = hex.replace("#", "");
    if (h.length !== 6) return "rgba(232,163,61," + alpha + ")";
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  let W, H, dpr;
  let particles = [];
  const mouse = { x: null, y: null };
  const eased = { x: 0, y: 0 };

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (eased.x === 0 && eased.y === 0) { eased.x = W / 2; eased.y = H / 2; mouse.x = W / 2; mouse.y = H / 2; }
  }

  function density() {
    const area = W * H;
    const base = Math.round(area / 16000);
    return Math.max(24, Math.min(base, 110));
  }

  function makeParticles() {
    const count = density();
    particles = Array.from({ length: count }, function() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.6,
        alt: Math.random() < 0.35,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  let frame = 0;

  function step() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    if (!isTouch && mouse.x !== null) {
      eased.x += (mouse.x - eased.x) * 0.04;
      eased.y += (mouse.y - eased.y) * 0.04;
    } else {
      eased.x = W / 2; eased.y = H / 2;
    }
    const parallaxX = ((eased.x - W / 2) / W) * -14;
    const parallaxY = ((eased.y - H / 2) / H) * -14;

    ctx.save();
    ctx.translate(parallaxX, parallaxY);

    if (!isTouch && mouse.x !== null) {
      const glowR = Math.min(320, Math.max(180, W / 4));
      const grad = ctx.createRadialGradient(eased.x, eased.y, 0, eased.x, eased.y, glowR);
      grad.addColorStop(0, COLORS.glow);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(-40, -40, W + 80, H + 80);
    }

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

    for (let k = 0; k < particles.length; k++) {
      const p = particles[k];
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }
      const twinkle = reduceMotion ? 1 : 0.7 + 0.3 * Math.sin(frame * 0.015 + p.phase);
      ctx.globalAlpha = twinkle;
      ctx.beginPath();
      ctx.fillStyle = p.alt ? COLORS.dotAlt : COLORS.dot;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    if (!reduceMotion) requestAnimationFrame(step);
  }

  if (!isTouch) {
    window.addEventListener("mousemove", function(e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  }

  var resizeTimer;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      sizeCanvas();
      makeParticles();
      if (reduceMotion) step();
    }, 150);
  });

  window.addEventListener("dsa-theme-changed", function() {
    readThemeColors();
    if (reduceMotion) step();
  });

  readThemeColors();
  sizeCanvas();
  makeParticles();
  step();
})();