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

// Manual carousel, with keyboard controls and horizontal touch gestures.
const technologyCarousel = document.querySelector('.technology-carousel');
if (technologyCarousel) {
  const slides = [...technologyCarousel.querySelectorAll('.technology-slide')];
  const viewport = technologyCarousel.querySelector('.technology-viewport');
  const controls = technologyCarousel.querySelector('.technology-controls');
  let active = 0;
  function showTechnology(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== active; });
    technologyCarousel.querySelector('.technology-count').textContent =
      `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    technologyCarousel.querySelector('.technology-name').textContent = slides[active].dataset.name;
  }
  technologyCarousel.classList.add('is-ready');
  controls.hidden = false;
  showTechnology(0);
  technologyCarousel.querySelector('.technology-prev').addEventListener('click', () => showTechnology(active - 1));
  technologyCarousel.querySelector('.technology-next').addEventListener('click', () => showTechnology(active + 1));
  controls.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showTechnology(active + (event.key === 'ArrowLeft' ? -1 : 1));
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
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showTechnology(active + (dx < 0 ? 1 : -1));
  }, { passive: true });
  viewport.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  technologyCarousel.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = document.querySelector('.contact-form select');
      if (select) select.value = link.dataset.service;
    });
  });
}
