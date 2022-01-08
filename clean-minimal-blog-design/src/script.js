/**
 * Return true if image is in viewport.
 */
const isInViewport = (elem) => {
  const bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const easeOutCirc = (x) => Math.sqrt(1 - Math.pow(x - 1, 2));
const easeInCirc = (x) => 1 - Math.sqrt(1 - Math.pow(x, 2));
const easeInOutCirc = (x) => x < 0.5
  ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
  : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
const noiseFunc = (x, factor, progress) => Math.sin(x) * factor * progress;
const noiseFunc2 = (x) => 1 + Math.sin(x/10) * Math.sin(x/4) * Math.cos(x/2) * Math.cos(x/50);

const vector = (x, y, angle, distance) => {
  return {
    x: Math.round(Math.cos(angle) * distance + x),
    y: Math.round(Math.sin(angle) * distance + y)
  }
}

const initHeader = () => {
  const canvas = document.querySelector("header canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions.
  // const width = document.body.clientWidth;
  // const height = document.body.clientHeight;
  const width = document.body.clientWidth;
  const height = 600;
  canvas.width = width;
  canvas.height = height;
  const render = () => {
    ctx.clearRect(0, 0, width, height);
    const now = Date.now();
    const halfW = width / 2;
    const halfH = 420;
    const slowDownFactor = 50000;
    const progress = (now % slowDownFactor) / slowDownFactor;
    const lines = 200;
    for (let i = 0; i < lines; i++) { 
      const progressFactor = noiseFunc2(i);
      //console.log(progressFactor);
      const lineProgress = (progress + progressFactor) % 1;
      const angle = (now / 50000) + Math.PI * 2 * (i / lines) * progressFactor;
      const distance1 = 0.5 * halfW * easeInOutSine(lineProgress);
      const distance2 = 2 * halfW * easeInOutSine(Math.min(lineProgress + 0.1, 1));
      const opacity = (1 - easeInOutSine(lineProgress)) * 0.4;
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 60;
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
    window.requestAnimationFrame(render);
  }
  render();
}

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
  
}

document.addEventListener("DOMContentLoaded", () => {

  // Animate articles in.
  const articles = document.querySelectorAll(".viewport-check");
  window.addEventListener("scroll", (e) => {
    animateArticles(articles);
  }, false);
  animateArticles(articles);

  // Lazy load images.
  const lazyLoadImages = document.querySelectorAll(".lazy-load");
  console.log(lazyLoadImages);
  window.addEventListener("scroll", (e) => {
    for (img of lazyLoadImages) {
      if (isInViewport(img)) {
        const inViewportApplied = img.dataset.inViewportApplied;
        if (!inViewportApplied) {
          const imgSrc = img.dataset.lazyImage;
          img.dataset.inViewportApplied = true;
          console.log("Load image " + imgSrc);
          img.addEventListener("load", () => {
            img.style.opacity = 0.3;
            img.style.width = "calc(100% + 160px)";
            img.style.height = "calc(100% + 160px)";
            console.log("Image loaded");
          });
          img.src = imgSrc;
        }
      }      
    }
  }, false);
  // Render some epic shit.  
  initHeader();
})

