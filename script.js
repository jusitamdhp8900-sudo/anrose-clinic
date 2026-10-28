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

// Promotion carousel: each arrow advances one poster; touch/trackpad scroll natively.
const campaign = document.querySelector('.campaign-carousel');
if (campaign) {
  const rail = campaign.querySelector('.campaign-grid');
  const cards = [...rail.querySelectorAll('.poster-card')];
  const controls = campaign.querySelector('.campaign-controls');
  const previous = campaign.querySelector('.campaign-prev');
  const next = campaign.querySelector('.campaign-next');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let target = 0;
  let settleTimer;
  function paint(index) {
    active = index;
    campaign.querySelector('.campaign-count').textContent =
      `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    campaign.querySelector('.campaign-progress span').style.width = `${(index + 1) / cards.length * 100}%`;
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    cards.forEach((card, i) => { card.tabIndex = i === index ? 0 : -1; });
  }
  function go(index) {
    target = Math.max(0, Math.min(cards.length - 1, index));
    rail.scrollTo({ left: target * rail.clientWidth, behavior: reduced.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => go(target - 1));
  next.addEventListener('click', () => go(target + 1));
  campaign.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    go(target + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  rail.addEventListener('scroll', () => {
    paint(Math.max(0, Math.min(cards.length - 1, Math.round(rail.scrollLeft / rail.clientWidth))));
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => { target = active; }, 150);
  }, { passive: true });
  // Mouse dragging follows the pointer; tapping still opens the original lightbox.
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
  controls.hidden = false;
  paint(0);
}

// Prepare a customer-owned message; no form data is put into URLs or stored.
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const nameInput = contactForm.querySelector('[name="name"]');
  const phoneInput = contactForm.querySelector('[name="phone"]');
  const serviceInput = contactForm.querySelector('[name="service"]');
  const draft = contactForm.querySelector('.message-draft');
  const message = contactForm.querySelector('#contact-message');
  const status = contactForm.querySelector('.message-status');
  const messengerURL = 'https://m.me/anrose.phongkhamdalieu';
  const submit = contactForm.querySelector('[type="submit"]');
  submit.hidden = false;
  function validateContact() {
    nameInput.setCustomValidity(nameInput.value.trim().length < 2 ? 'Vui lòng nhập họ và tên của bạn.' : '');
    const phone = phoneInput.value.trim();
    const digits = phone.replace(/\D/g, '');
    phoneInput.setCustomValidity(/^[+\d\s().-]+$/.test(phone) && digits.length >= 9 && digits.length <= 15 ? '' : 'Vui lòng nhập số điện thoại hợp lệ.');
    return contactForm.reportValidity();
  }
  [nameInput, phoneInput].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
  async function copyMessage() {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'Đã sao chép nội dung. Bạn hãy dán vào Messenger và bấm Gửi. Tin nhắn chưa được gửi từ website.';
    } catch {
      status.textContent = 'Chưa sao chép được. Hãy chọn và sao chép nội dung bên trên, sau đó mở Messenger, dán và bấm Gửi.';
    }
  }
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateContact()) return;
    message.value = [
      'Xin chào Anrose Clinic, tôi muốn được tư vấn và đặt lịch.',
      `Họ và tên: ${nameInput.value.trim()}`,
      `Số điện thoại: ${phoneInput.value.trim()}`,
      `Dịch vụ quan tâm: ${serviceInput.value}`,
      'Nhờ Anrose liên hệ tư vấn giúp tôi. Cảm ơn Anrose!'
    ].join('\n');
    draft.hidden = false;
    status.textContent = 'Đang chuẩn bị nội dung. Nếu Messenger chưa mở, bạn có thể bấm “Mở lại Messenger” bên dưới.';
    // Start copying within the click gesture; open synchronously to avoid popup blocking.
    void copyMessage();
    window.open(messengerURL, '_blank', 'noopener,noreferrer');
  });
  contactForm.querySelector('.copy-message').addEventListener('click', () => {
    message.focus();
    message.select();
    void copyMessage();
  });
}
