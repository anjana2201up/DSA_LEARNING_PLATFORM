// public/js/slides.js
// A lightweight "PPT" viewer: one slide visible at a time, progress dots,
// prev/next buttons, keyboard arrows, and swipe-on-touch. Renders a
// pattern's slide deck into a container element.

const Slides = {
  mount(container, pattern) {
    let current = 0;
    const total = pattern.slides.length;

    function renderSlide(index) {
      const slide = pattern.slides[index];
      const bulletsHtml = slide.bullets
        ? `<ul class="slide-bullets">${slide.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`
        : "";
      const codeHtml = slide.code
        ? `<pre class="slide-code"><code>${escapeHtml(slide.code)}</code></pre>`
        : "";
      return `
        <div class="slide-inner">
          <span class="slide-index">Slide ${index + 1} / ${total}</span>
          <h2 class="slide-heading">${slide.heading}</h2>
          ${bulletsHtml}
          ${codeHtml}
        </div>`;
    }

    function renderDots() {
      return `<div class="slide-dots">${pattern.slides.map((_, i) =>
        `<button class="slide-dot ${i === current ? 'active' : ''}" data-i="${i}" aria-label="Go to slide ${i+1}"></button>`
      ).join("")}</div>`;
    }

    function render() {
      container.innerHTML = `
        <div class="deck-shell">
          <div class="deck-stage">${renderSlide(current)}</div>
          <div class="deck-controls">
            <button class="deck-nav prev" id="deckPrev" ${current === 0 ? "disabled" : ""} aria-label="Previous slide">&larr;</button>
            ${renderDots()}
            <button class="deck-nav next" id="deckNext" ${current === total - 1 ? "disabled" : ""} aria-label="Next slide">&rarr;</button>
          </div>
        </div>`;

      container.querySelector("#deckPrev").addEventListener("click", () => go(current - 1));
      container.querySelector("#deckNext").addEventListener("click", () => go(current + 1));
      container.querySelectorAll(".slide-dot").forEach(dot => {
        dot.addEventListener("click", () => go(parseInt(dot.dataset.i, 10)));
      });
    }

    function go(i) {
      if (i < 0 || i >= total) return;
      current = i;
      render();
    }

    // Keyboard navigation while the deck is on screen
    function keyHandler(e) {
      if (!document.body.contains(container)) {
        document.removeEventListener("keydown", keyHandler);
        return;
      }
      if (e.key === "ArrowRight") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
    }
    document.addEventListener("keydown", keyHandler);

    // Touch swipe support
    let touchStartX = null;
    container.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    container.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) go(dx > 0 ? current - 1 : current + 1);
      touchStartX = null;
    }, { passive: true });

    render();
  }
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
