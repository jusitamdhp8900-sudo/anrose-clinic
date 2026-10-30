const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Reveal on scroll: content rises in gently; delays are dropped afterwards so hovers stay snappy.
const revealItems = document.querySelectorAll('.reveal');
let pendingReveals = [...revealItems];
function revealElement(el) {
  if (el.classList.contains('is-visible')) return;
  el.classList.add('is-visible');
  setTimeout(() => el.classList.add('is-revealed'), 1500);
}
// Safety net alongside IntersectionObserver: anything that has entered the viewport is revealed.
function checkPendingReveals() {
  if (!pendingReveals.length) return;
  const limit = window.innerHeight * 0.94;
  pendingReveals = pendingReveals.filter((el) => {
    if (el.classList.contains('is-visible')) return false;
    const rect = el.getBoundingClientRect();
    if (rect.top < limit && rect.bottom > 0) { revealElement(el); return false; }
    return true;
  });
}
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealElement(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((el) => revealObserver.observe(el));
} else {
  revealItems.forEach(revealElement);
}

// Header state, reading progress and floating consultation button share one rAF-throttled handler.
const header = document.querySelector('.site-header');
const progressBar = document.querySelector('.scroll-progress span');
const floatingCta = document.querySelector('.floating-cta');
const contactSection = document.querySelector('#contact');
const backToTop = document.querySelector('.back-to-top');
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  document.querySelector('.brand')?.focus({ preventScroll: true });
});
let scrollTicking = false;
function updateScrollUI() {
  scrollTicking = false;
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  // The floating button steps aside once the consultation form (or anything after it) is on screen.
  const contactReached = contactSection ? contactSection.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
  floatingCta?.classList.toggle('is-visible', y > window.innerHeight * 0.9 && !contactReached);
  backToTop?.classList.toggle('is-visible', y > window.innerHeight * 1.5);
  checkPendingReveals();
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(updateScrollUI); }
}, { passive: true });
window.addEventListener('resize', updateScrollUI, { passive: true });
// Wait two frames so the first reveals animate in rather than appearing pre-revealed.
requestAnimationFrame(() => requestAnimationFrame(updateScrollUI));

// Mobile navigation and the active section indicator.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
function setMenu(open) {
  if (!toggle || !nav) return;
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
}
if (toggle && nav) {
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (event) => {
    if (nav.classList.contains('open') && !event.target.closest('.nav-wrap')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
}
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]:not(.nav-cta)')];
if ('IntersectionObserver' in window && navLinks.length) {
  // Observe every section so areas without a menu item (cover, contact) clear the indicator.
  const sections = [...document.querySelectorAll('main section[id]')];
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((section) => navObserver.observe(section));
}

// FAQ accordion: smooth height animation on top of native <details>, one item open at a time.
const faqItems = [...document.querySelectorAll('.faq-item')];
faqItems.forEach((item) => {
  const summary = item.querySelector('summary');
  const answer = item.querySelector('.faq-answer');
  summary.addEventListener('click', (event) => {
    if (reducedMotion.matches || !answer.animate) {
      if (!item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
      return;
    }
    event.preventDefault();
    if (item.open) {
      const anim = answer.animate([{ height: `${answer.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
      anim.onfinish = () => { item.open = false; };
    } else {
      faqItems.forEach((other) => {
        if (other === item || !other.open) return;
        const otherAnswer = other.querySelector('.faq-answer');
        const close = otherAnswer.animate([{ height: `${otherAnswer.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
        close.onfinish = () => { other.open = false; };
      });
      item.open = true;
      answer.animate([{ height: '0px', opacity: 0 }, { height: `${answer.offsetHeight}px`, opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  });
});
// Structured data for search engines, built from the visible FAQ so the two never drift apart.
if (faqItems.length) {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.querySelector('summary').textContent.trim(),
      acceptedAnswer: { '@type': 'Answer', text: item.querySelector('.faq-answer').textContent.trim() }
    }))
  };
  const faqScript = document.createElement('script');
  faqScript.type = 'application/ld+json';
  faqScript.textContent = JSON.stringify(faqData);
  document.head.append(faqScript);
}

// Pre-select a service in the consultation form; offers are added as their own option.
function selectService(value, createIfMissing = false) {
  const select = document.querySelector('.contact-form select');
  if (!select || !value) return;
  const exists = [...select.options].some((option) => option.value === value);
  if (!exists) {
    if (!createIfMissing) return;
    select.add(new Option(value, value), select.options[select.options.length - 1]);
  }
  select.value = value;
}
document.querySelectorAll('a[data-service]').forEach((link) => {
  link.addEventListener('click', () => selectService(link.dataset.service));
});

// Services slider: arrows step one card at a time, touch/trackpad scroll natively, mouse can drag.
const serviceSlider = document.querySelector('.service-slider');
if (serviceSlider) {
  const rail = serviceSlider.querySelector('.service-grid');
  const cards = [...rail.querySelectorAll('.service-card')];
  const previous = serviceSlider.querySelector('.service-prev');
  const next = serviceSlider.querySelector('.service-next');
  const bar = serviceSlider.querySelector('.service-progress span');
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const maxScroll = () => rail.scrollWidth - rail.clientWidth;
  function update() {
    const max = maxScroll();
    previous.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max - 2;
    const visible = rail.clientWidth / rail.scrollWidth;
    bar.style.width = `${visible * 100}%`;
    bar.style.transform = `translateX(${max > 0 ? rail.scrollLeft / max * (1 / visible - 1) * 100 : 0}%)`;
  }
  function move(direction) {
    const index = Math.round(rail.scrollLeft / step()) + direction;
    rail.scrollTo({ left: Math.max(0, Math.min(maxScroll(), index * step())), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  rail.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(rail);

  // Mouse dragging; a drag never counts as a click on the "Tư vấn dịch vụ" links.
  let drag = null;
  let suppressClick = false;
  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, left: rail.scrollLeft, id: event.pointerId, moved: false };
    suppressClick = false;
  });
  rail.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 6 && !drag.moved) {
      drag.moved = true;
      rail.setPointerCapture(drag.id);
      rail.classList.add('is-dragging');
    }
    if (drag.moved) rail.scrollLeft = drag.left - distance;
  });
  function endDrag(event) {
    if (!drag) return;
    const { moved, left } = drag;
    const distance = event.clientX - drag.x;
    drag = null;
    rail.classList.remove('is-dragging');
    if (!moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    const start = Math.round(left / step());
    const target = start + (Math.abs(distance) > 45 ? (distance < 0 ? 1 : -1) : 0);
    rail.scrollTo({ left: Math.max(0, Math.min(maxScroll(), target * step())), behavior: 'smooth' });
  }
  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', () => { drag = null; rail.classList.remove('is-dragging'); });
  rail.addEventListener('dragstart', event => event.preventDefault());
  rail.addEventListener('click', (event) => {
    if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);

  serviceSlider.querySelector('.service-controls').hidden = false;
  update();
}

// Photo sliders: the current photo centred with its neighbours peeking in; arrows/swipe/drag, loops,
// and moves on by itself every 5s. The 5s timer is the line's CSS animation, so pausing it pauses autoplay.
document.querySelectorAll('.photo-slider').forEach((slider) => {
  const rail = slider.querySelector('.photo-rail');
  const slides = [...rail.querySelectorAll('.photo-slide')];
  const caption = slider.querySelector('.photo-caption');
  const count = slider.querySelector('.photo-count');
  const timer = slider.querySelector('.photo-progress span');
  if (slides.length < 2) return;
  const total = String(slides.length).padStart(2, '0');
  let active = -1;
  let swapTimer;
  const offsetFor = (i) => slides[i].offsetLeft - (rail.clientWidth - slides[i].offsetWidth) / 2;
  function nearest(position = rail.scrollLeft) {
    let best = 0;
    slides.forEach((_, i) => { if (Math.abs(offsetFor(i) - position) < Math.abs(offsetFor(best) - position)) best = i; });
    return best;
  }
  function restartTimer() {
    timer.style.animation = 'none';
    void timer.offsetWidth;
    timer.style.animation = '';
  }
  function paint(index) {
    if (index === active) return;
    const first = active === -1;
    active = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-current', i === index);
      slide.tabIndex = i === index ? 0 : -1;
    });
    count.innerHTML = `<b>${String(index + 1).padStart(2, '0')}</b> / ${total}`;
    restartTimer();
    clearTimeout(swapTimer);
    const text = slides[index].dataset.alt || '';
    if (first || reducedMotion.matches) { caption.textContent = text; return; }
    caption.classList.add('is-swapping');
    swapTimer = setTimeout(() => { caption.textContent = text; caption.classList.remove('is-swapping'); }, 260);
  }
  function go(index) {
    const target = (index + slides.length) % slides.length;
    paint(target);
    rail.scrollTo({ left: offsetFor(target), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  slider.querySelector('.photo-prev').addEventListener('click', () => go(active - 1));
  slider.querySelector('.photo-next').addEventListener('click', () => go(active + 1));
  rail.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    go(active + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  // A click on a peeking neighbour brings it to the centre instead of opening the lightbox.
  rail.addEventListener('click', (event) => {
    const slide = event.target.closest('.photo-slide');
    if (!slide || slide.classList.contains('is-current')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    go(slides.indexOf(slide));
  }, true);
  let settleTimer;
  rail.addEventListener('scroll', () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => paint(nearest()), 120);
  }, { passive: true });
  new ResizeObserver(() => rail.scrollTo({ left: offsetFor(Math.max(active, 0)), behavior: 'instant' })).observe(rail);

  // Autoplay: runs only while the slider is on screen, the tab is visible and nobody is hovering or focused inside.
  let inView = false;
  let hovering = false;
  let focused = false;
  function syncPause() {
    slider.classList.toggle('is-paused', !inView || hovering || focused || document.hidden || !!drag);
  }
  if (!reducedMotion.matches) {
    slider.classList.add('is-autoplay');
    timer.addEventListener('animationend', () => go(active + 1));
  }
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    // Load every photo in the slider once it is close, so the next slide is ready when it moves in.
    if (inView) rail.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
    syncPause();
  }, { threshold: 0.35 }).observe(rail);
  slider.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') { hovering = true; syncPause(); } });
  slider.addEventListener('pointerleave', () => { hovering = false; syncPause(); });
  slider.addEventListener('focusin', () => { focused = true; syncPause(); });
  slider.addEventListener('focusout', () => { focused = false; syncPause(); });
  document.addEventListener('visibilitychange', syncPause);

  // Mouse dragging; a drag never opens the lightbox.
  let drag = null;
  let suppressClick = false;
  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, left: rail.scrollLeft, id: event.pointerId, moved: false };
    suppressClick = false;
  });
  rail.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 6 && !drag.moved) {
      drag.moved = true;
      rail.setPointerCapture(drag.id);
      rail.classList.add('is-dragging');
    }
    if (drag.moved) rail.scrollLeft = drag.left - distance;
  });
  rail.addEventListener('pointerup', (event) => {
    if (!drag) return;
    const { moved, left } = drag;
    const distance = event.clientX - drag.x;
    drag = null;
    rail.classList.remove('is-dragging');
    syncPause();
    if (!moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    go(nearest(left) + (Math.abs(distance) > 45 ? (distance < 0 ? 1 : -1) : 0));
  });
  rail.addEventListener('pointercancel', () => { drag = null; rail.classList.remove('is-dragging'); syncPause(); });
  rail.addEventListener('dragstart', (event) => event.preventDefault());
  rail.addEventListener('click', (event) => {
    if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);

  slider.querySelector('.photo-controls').hidden = false;
  paint(0);
  syncPause();
});

// Lightbox: opens images from the same section as a small gallery with arrows, keys and swipe.
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let lightboxItems = [];
let lightboxIndex = 0;
let lightboxReturnFocus = null;
let lightboxClearTimer;

function showLightboxItem(index) {
  if (!lightboxItems.length || !lightboxImage) return;
  lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
  const card = lightboxItems[lightboxIndex];
  const img = card.querySelector('img');
  const src = card.dataset.full || img?.currentSrc || img?.src || '';
  const alt = card.dataset.alt || img?.alt || '';
  lightboxImage.classList.add('is-loading');
  const reveal = () => lightboxImage.classList.remove('is-loading');
  lightboxImage.onload = reveal;
  lightboxImage.onerror = reveal;
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  if (lightboxImage.complete) requestAnimationFrame(reveal);
  if (lightboxCaption) {
    lightboxCaption.textContent = lightboxItems.length > 1 ? `${alt} · ${lightboxIndex + 1} / ${lightboxItems.length}` : alt;
  }
  const single = lightboxItems.length < 2;
  if (lightboxPrev) lightboxPrev.hidden = single;
  if (lightboxNext) lightboxNext.hidden = single;
}
function openLightbox(card) {
  if (!lightbox || !lightboxImage) return;
  clearTimeout(lightboxClearTimer);
  const scope = card.closest('section') || document;
  lightboxItems = [...scope.querySelectorAll('.js-lightbox')].filter((el) => !el.closest('[inert]'));
  lightboxReturnFocus = card;
  showLightboxItem(Math.max(0, lightboxItems.indexOf(card)));
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  lightboxClose?.focus({ preventScroll: true });
}
function closeLightbox() {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  lightboxClearTimer = setTimeout(() => { if (lightboxImage) lightboxImage.src = ''; }, 450);
  lightboxReturnFocus?.focus({ preventScroll: true });
}
document.querySelectorAll('.js-lightbox').forEach((card) => {
  card.addEventListener('click', () => openLightbox(card));
});
lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', () => showLightboxItem(lightboxIndex - 1));
lightboxNext?.addEventListener('click', () => showLightboxItem(lightboxIndex + 1));
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox || event.target.classList.contains('lightbox-inner')) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  else if (event.key === 'ArrowLeft' && lightboxItems.length > 1) showLightboxItem(lightboxIndex - 1);
  else if (event.key === 'ArrowRight' && lightboxItems.length > 1) showLightboxItem(lightboxIndex + 1);
  else if (event.key === 'Tab') {
    const focusable = [...lightbox.querySelectorAll('button:not([hidden])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
let lightboxTouch = null;
lightbox?.addEventListener('touchstart', (event) => {
  lightboxTouch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
lightbox?.addEventListener('touchend', (event) => {
  if (!lightboxTouch || lightboxItems.length < 2) return;
  const dx = event.changedTouches[0].clientX - lightboxTouch.x;
  const dy = event.changedTouches[0].clientY - lightboxTouch.y;
  lightboxTouch = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) showLightboxItem(lightboxIndex + (dx < 0 ? 1 : -1));
}, { passive: true });

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
    else completionTimer = setTimeout(finishMove, 1050);
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
}

// Promotion carousel: arrows loop, touch/trackpad scroll natively, and it gently autoplays while in view.
const campaign = document.querySelector('.campaign-carousel');
if (campaign) {
  const rail = campaign.querySelector('.campaign-grid');
  const cards = [...rail.querySelectorAll('.poster-card')];
  const controls = campaign.querySelector('.campaign-controls');
  const previous = campaign.querySelector('.campaign-prev');
  const next = campaign.querySelector('.campaign-next');
  const caption = campaign.querySelector('.campaign-caption');
  const dotsWrap = campaign.querySelector('.campaign-dots');
  const progress = campaign.querySelector('.campaign-progress span');
  const dots = cards.map(() => {
    const dot = document.createElement('span');
    dotsWrap?.append(dot);
    return dot;
  });
  let active = 0;
  let shown = -1;
  let target = 0;
  let settleTimer;
  let swapTimer;
  function writeCaption(index) {
    const offer = cards[index].dataset;
    campaign.querySelector('.campaign-offer-title').textContent = offer.offerTitle;
    campaign.querySelector('.campaign-offer-price').textContent = offer.offerPrice;
    campaign.querySelector('.campaign-offer-description').textContent = offer.offerDescription;
    campaign.querySelector('.campaign-count').textContent =
      `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }
  function paint(index) {
    active = index;
    if (index === shown) return;
    const first = shown === -1;
    shown = index;
    if (progress) progress.style.width = `${(index + 1) / cards.length * 100}%`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    cards.forEach((card, i) => {
      card.tabIndex = i === index ? 0 : -1;
      card.classList.toggle('is-current', i === index);
    });
    clearTimeout(swapTimer);
    if (first || reducedMotion.matches) { writeCaption(index); return; }
    caption.classList.add('is-swapping');
    swapTimer = setTimeout(() => {
      writeCaption(active);
      caption.classList.remove('is-swapping');
    }, 240);
  }
  // While an arrow/autoplay scroll is animating, the caption jumps straight to the destination
  // instead of flickering through every poster it passes.
  let programmatic = false;
  let programmaticTimer;
  function go(index, wrap = false) {
    const count = cards.length;
    target = wrap ? (index + count) % count : Math.max(0, Math.min(count - 1, index));
    programmatic = true;
    clearTimeout(programmaticTimer);
    programmaticTimer = setTimeout(() => { programmatic = false; }, 1200);
    paint(target);
    rail.scrollTo({ left: target * rail.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  function releaseProgrammatic() { programmatic = false; clearTimeout(programmaticTimer); }

  // Autoplay pauses on hover, focus, user interaction, hidden tabs and when the carousel is off-screen.
  let inView = false;
  let hovering = false;
  let focused = false;
  let holdUntil = 0;
  let autoTimer;
  function hold() { holdUntil = Date.now() + 12000; releaseProgrammatic(); }
  function scheduleAutoplay() {
    clearTimeout(autoTimer);
    if (reducedMotion.matches) return;
    autoTimer = setTimeout(() => {
      if (inView && !hovering && !focused && !document.hidden && Date.now() > holdUntil && !drag) go(target + 1, true);
      scheduleAutoplay();
    }, 5200);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.5 }).observe(rail);
  }
  campaign.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') hovering = true; });
  campaign.addEventListener('pointerleave', () => { hovering = false; });
  campaign.addEventListener('focusin', () => { focused = true; });
  campaign.addEventListener('focusout', () => { focused = false; });
  rail.addEventListener('touchstart', hold, { passive: true });
  rail.addEventListener('wheel', hold, { passive: true });

  previous.addEventListener('click', () => { hold(); go(target - 1, true); });
  next.addEventListener('click', () => { hold(); go(target + 1, true); });
  campaign.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.target.closest('.campaign-actions')) return;
    event.preventDefault();
    hold();
    go(target + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  rail.addEventListener('scroll', () => {
    const index = Math.max(0, Math.min(cards.length - 1, Math.round(rail.scrollLeft / rail.clientWidth)));
    if (!programmatic) paint(index);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      releaseProgrammatic();
      paint(Math.max(0, Math.min(cards.length - 1, Math.round(rail.scrollLeft / rail.clientWidth))));
      target = active;
    }, 150);
  }, { passive: true });

  // Mouse dragging follows the pointer; tapping still opens the original lightbox.
  let drag = null;
  let suppressClick = false;
  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, left: rail.scrollLeft, id: event.pointerId, moved: false };
    releaseProgrammatic();
    suppressClick = false;
  });
  rail.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 6 && !drag.moved) {
      drag.moved = true;
      rail.setPointerCapture(drag.id);
      rail.classList.add('is-dragging');
    }
    if (drag.moved) {
      event.preventDefault();
      rail.scrollLeft = drag.left - distance;
    }
  });
  function endDrag(event) {
    if (!drag) return;
    const moved = drag.moved;
    const distance = event.clientX - drag.x;
    const start = Math.round(drag.left / rail.clientWidth);
    drag = null;
    rail.classList.remove('is-dragging');
    if (moved) {
      hold();
      suppressClick = true;
      go(start + (Math.abs(distance) > 45 ? (distance < 0 ? 1 : -1) : 0));
      setTimeout(() => { suppressClick = false; }, 0);
    }
  }
  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', () => { drag = null; rail.classList.remove('is-dragging'); });
  rail.addEventListener('pointerleave', () => { if (drag && !drag.moved) drag = null; });
  rail.addEventListener('dragstart', event => event.preventDefault());
  rail.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  let lastWidth = rail.clientWidth;
  new ResizeObserver(() => {
    if (rail.clientWidth === lastWidth) return;
    lastWidth = rail.clientWidth;
    rail.scrollTo({ left: active * lastWidth, behavior: 'instant' });
    target = active;
  }).observe(rail);

  campaign.querySelector('.campaign-zoom')?.addEventListener('click', () => openLightbox(cards[active]));
  campaign.querySelector('.campaign-book')?.addEventListener('click', () => {
    selectService(`Ưu đãi: ${cards[active].dataset.offerTitle}`, true);
  });

  controls.hidden = false;
  paint(0);
  scheduleAutoplay();
}

// Booking form: each request goes to the clinic's Google Apps Script (apps-script/Code.gs),
// which emails it to the clinic's Gmail. Nothing is put into URLs or stored on the website.
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const nameInput = contactForm.querySelector('[name="name"]');
  const phoneInput = contactForm.querySelector('[name="phone"]');
  const serviceInput = contactForm.querySelector('[name="service"]');
  const dateInput = contactForm.querySelector('[name="date"]');
  const timeInput = contactForm.querySelector('[name="time"]');
  const noteInput = contactForm.querySelector('[name="note"]');
  const honeypot = contactForm.querySelector('[name="_honey"]');
  const endpoint = (contactForm.dataset.endpoint || '').trim();
  // Appointments can only be requested from today onwards (local date, not UTC).
  if (dateInput) {
    const now = new Date();
    dateInput.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  function formatDate(value) {
    const [y, m, d] = value.split('-');
    return y && m && d ? `${d}/${m}/${y}` : value;
  }
  const success = contactForm.querySelector('.form-success');
  const successText = contactForm.querySelector('.form-success-text');
  const errorBox = contactForm.querySelector('.form-error');
  const submit = contactForm.querySelector('[type="submit"]');
  const submitLabel = submit.textContent;
  submit.hidden = false;
  function validateContact() {
    nameInput.setCustomValidity(nameInput.value.trim().length < 2 ? 'Vui lòng nhập họ và tên của bạn.' : '');
    const phone = phoneInput.value.trim();
    const digits = phone.replace(/\D/g, '');
    phoneInput.setCustomValidity(/^[+\d\s().-]+$/.test(phone) && digits.length >= 9 && digits.length <= 15 ? '' : 'Vui lòng nhập số điện thoại hợp lệ.');
    return contactForm.reportValidity();
  }
  [nameInput, phoneInput].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
  function bookingDetails() {
    return {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: serviceInput.value,
      when: [dateInput?.value ? formatDate(dateInput.value) : '', timeInput?.value || ''].filter(Boolean).join(' – '),
      note: noteInput?.value.trim() || ''
    };
  }
  async function emailBooking(details) {
    if (!endpoint) {
      console.warn('Booking form: set data-endpoint on .contact-form to the Google Apps Script web app URL (see README).');
      return false;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      // A plain-text body keeps this a "simple" request, which Apps Script accepts without a CORS preflight.
      const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(details), signal: controller.signal });
      const result = await response.json().catch(() => ({}));
      if (result.success !== true) console.warn('Booking form:', result.message || response.status);
      return response.ok && result.success === true;
    } catch (error) {
      console.warn('Booking form:', error);
      return false;
    } finally {
      clearTimeout(timer);
    }
  }
  function showSuccess(details) {
    successText.textContent = `Cảm ơn ${details.name}. Anrose Clinic đã nhận thông tin và sẽ gọi lại cho bạn qua số ${details.phone} sớm nhất.`;
    contactForm.classList.add('is-sent');
    success.hidden = false;
    success.focus();
  }
  function setSending(sending) {
    submit.disabled = sending;
    submit.classList.toggle('is-loading', sending);
    submit.textContent = sending ? 'Đang gửi…' : submitLabel;
  }
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled || !validateContact()) return;
    errorBox.hidden = true;
    const details = bookingDetails();
    // The hidden field is only ever filled in by bots: pretend it worked and send nothing.
    if (honeypot?.value) { showSuccess(details); return; }
    setSending(true);
    const sent = await emailBooking(details);
    setSending(false);
    if (sent) {
      showSuccess(details);
    } else {
      errorBox.textContent = 'Chưa gửi được đăng ký. Bạn vui lòng thử lại sau ít phút hoặc gọi 0869 833 868 để Anrose hỗ trợ đặt lịch.';
      errorBox.hidden = false;
    }
  });
  contactForm.querySelector('.form-reset')?.addEventListener('click', () => {
    contactForm.reset();
    contactForm.classList.remove('is-sent');
    success.hidden = true;
    errorBox.hidden = true;
    nameInput.focus();
  });
}
