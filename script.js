const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((el) => observer.observe(el));

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  if (lightboxImage) lightboxImage.src = '';
}

document.querySelectorAll('.js-lightbox').forEach((card) => {
  card.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = card.dataset.full || card.querySelector('img')?.src || '';
    lightboxImage.alt = card.dataset.alt || card.querySelector('img')?.alt || '';
    if (lightboxCaption) lightboxCaption.textContent = lightboxImage.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

// A continuous horizontal track, including inert edge copies for seamless looping.
const technologyCarousel = document.querySelector('.technology-carousel');
if (technologyCarousel) {
  const slides = [...technologyCarousel.querySelectorAll('.technology-slide')];
  const viewport = technologyCarousel.querySelector('.technology-viewport');
  const controls = technologyCarousel.querySelector('.technology-controls');
  const track = document.createElement('div');
  track.className = 'technology-track';
  slides.forEach(slide => track.append(slide));
  function edgeCopy(slide) {
    const copy = slide.cloneNode(true);
    copy.classList.add('technology-clone');
    copy.inert = true;
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    return copy;
  }
  track.prepend(edgeCopy(slides[slides.length - 1]));
  track.append(edgeCopy(slides[0]));
  viewport.append(track);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let position = 1;
  let moving = false;
  let completionTimer;
  const pending = [];
  function updateStatus() {
    slides.forEach((slide, i) => {
      slide.inert = i !== active;
      slide.setAttribute('aria-hidden', String(i !== active));
    });
    technologyCarousel.querySelector('.technology-count').textContent =
      `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    technologyCarousel.querySelector('.technology-name').textContent = slides[active].dataset.name;
  }
  function placeTrack(animate) {
    track.classList.toggle('is-moving', animate);
    track.style.transform = `translate3d(${-position * 100}%, 0, 0)`;
  }
  function finishMove() {
    if (!moving) return;
    clearTimeout(completionTimer);
    moving = false;
    // The clone and the real slide are identical, so this reset is invisible.
    position = active + 1;
    placeTrack(false);
    if (pending.length) {
      const direction = pending.shift();
      requestAnimationFrame(() => moveTechnology(direction));
    }
  }
  function moveTechnology(direction) {
    if (moving) {
      if (pending.length < 4) pending.push(direction);
      return;
    }
    // Commit the non-animated loop position before beginning the next movement.
    void track.offsetWidth;
    position += direction;
    active = (active + direction + slides.length) % slides.length;
    updateStatus();
    moving = true;
    placeTrack(!reducedMotion.matches);
    if (reducedMotion.matches) finishMove();
    else completionTimer = setTimeout(finishMove, 650);
  }
  track.addEventListener('transitionend', (event) => {
    if (event.target === track && event.propertyName === 'transform') finishMove();
  });
  technologyCarousel.classList.add('is-ready');
  controls.hidden = false;
  updateStatus();
  placeTrack(false);
  technologyCarousel.querySelector('.technology-prev').addEventListener('click', () => moveTechnology(-1));
  technologyCarousel.querySelector('.technology-next').addEventListener('click', () => moveTechnology(1));
  controls.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveTechnology(event.key === 'ArrowLeft' ? -1 : 1);
  });
  let touchStart = null;
  viewport.addEventListener('touchstart', (event) => {
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  viewport.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) moveTechnology(dx < 0 ? 1 : -1);
  }, { passive: true });
  viewport.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  slides.forEach(slide => slide.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = document.querySelector('.contact-form select');
      if (select) select.value = link.dataset.service;
    });
  }));
}
