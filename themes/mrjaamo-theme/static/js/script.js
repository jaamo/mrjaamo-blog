/**
 * Return true if image is in viewport.
 */
const isInViewport = (elem) => {
  const bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.top <=
      (window.innerHeight || document.documentElement.clientHeight)
  );
};

/**
 * Easing function.
 */
const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

/**
 * Attempt to generate predictable random (?) numbers.
 */
const noiseFunc = (x) =>
  1 + Math.sin(x / 20) * Math.sin(x / 4) * Math.cos(x / 2) * Math.cos(x / 50);

/**
 * Calculate end position of a vector.
 */
const vector = (x, y, angle, distance) => {
  return {
    x: Math.round(Math.cos(angle) * distance + x),
    y: Math.round(Math.sin(angle) * distance + y),
  };
};

/**
 * Run header animation.
 */
const initHeader = () => {
  const canvas = document.querySelector("header canvas");
  const ctx = canvas.getContext("2d");
  const width = document.body.clientWidth;
  const height = 600;
  canvas.width = width;
  canvas.height = height;
  let frame = 0;
  const render = () => {
    frame++;
    window.requestAnimationFrame(render);
    if (frame % 3 != 0) {
      return;
    }
    ctx.clearRect(0, 0, width, height);
    const now = Date.now();
    const halfW = width / 2;
    const halfH = 420;
    const slowDownFactor = 100000;
    const progress = (now % slowDownFactor) / slowDownFactor;
    const lines = 100;
    for (let i = 0; i < lines; i++) {
      const progressFactor = noiseFunc(i);
      const lineProgress = (progress + progressFactor) % 1;
      const angle = now / 100000 + Math.PI * 2 * (i / lines) * progressFactor;
      const distance1 = 0.5 * halfW * easeInOutSine(lineProgress);
      const distance2 =
        2 * halfW * easeInOutSine(Math.min(lineProgress + 0.1, 1));
      const opacity = (1 - easeInOutSine(lineProgress)) * 0.4;
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 100;
      ctx.beginPath();
      const v1 = vector(halfW, halfH, angle, distance1);
      const v2 = vector(halfW, halfH, angle, distance2);
      const x1 = v1.x;
      const y1 = v1.y;
      const x2 = v2.x;
      const y2 = v2.y;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    const grd = ctx.createRadialGradient(halfW, halfH, 50, halfW, halfH, 300);
    grd.addColorStop(0, "rgba(26,25,25,1)");
    grd.addColorStop(1, "rgba(26,25,25,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  };
  render();
};

/**
 * Triggered on scroll to check if an article is in viewport.
 */
const animateArticles = (articles) => {
  for (article of articles) {
    if (isInViewport(article)) {
      const inViewportApplied = article.dataset.inViewportApplied;
      if (!inViewportApplied) {
        const newClass = article.dataset.viewportClass;
        article.dataset.inViewportApplied = true;
        article.classList.add(newClass);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Animate articles in.
  const articles = document.querySelectorAll(".viewport-check");
  window.addEventListener(
    "scroll",
    (e) => {
      animateArticles(articles);
    },
    false
  );
  animateArticles(articles);

  // Lazy load images.
  const lazyLoadImages = document.querySelectorAll(".with-lazy-load");
  window.addEventListener(
    "scroll",
    () => {
      for (img of lazyLoadImages) {
        if (isInViewport(img)) {
          const inViewportApplied = img.dataset.inViewportApplied;
          if (!inViewportApplied) {
            const imgSrc = img.dataset.lazyImage;
            img.dataset.inViewportApplied = true;
            img.addEventListener("load", () => {
              img.classList.add("is-lazy-loaded");
            });
            img.src = imgSrc;
          }
        }
      }
    },
    false
  );

  // Render some epic shit.
  initHeader();
});
