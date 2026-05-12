/* ================================================
   STUDIO BOOST 46 — Script 2026
   ================================================ */

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
if (cursor) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function lerp() {
    cx += (tx - cx) * .18;
    cy += (ty - cy) * .18;
    cursor.style.transform = `translate(${cx - 7}px,${cy - 7}px)`;
    requestAnimationFrame(lerp);
  }
  lerp();
  document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * .22}px,${y * .32}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* ===== NAV SCROLL STATE ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* ===== MOBILE MENU ===== */
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.querySelector('.nav__mobile');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = burger.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.nav__mobile a').forEach(link =>
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  })
);

/* ===== ACTIVE NAV LINK ===== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ===== REVEAL ON SCROLL ===== */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => io.observe(el));
}

/* ===== 72H LIVE TICKER (index only) ===== */
const ticker = document.getElementById('ticker');
if (ticker) {
  let total = 72 * 3600 - (Math.floor(Math.random() * 30) + 10);
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    total--;
    if (total < 0) total = 72 * 3600;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    ticker.innerHTML = `${pad(h)}<span class="sep">:</span>${pad(m)}<span class="sep">:</span>${pad(s)}`;
  }
  setInterval(tick, 1000);
}

/* ===== COUNT-UP STATS ===== */
const counters = document.querySelectorAll('.stat__num[data-count]');
if (counters.length) {
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1400, start = performance.now();
      const initial = el.innerHTML;
      function step(t) {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.floor(target * eased);
        if (initial.includes('<em>')) {
          el.innerHTML = `<em>${prefix}</em>${v}<span class="unit">${suffix}</span>`;
        } else {
          el.innerHTML = `${v}<span class="unit">${suffix}</span>`;
        }
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => cio.observe(c));
}

/* ===== PROCESS COUNTER (sticky, index only) ===== */
const procCount = document.getElementById('processCount');
if (procCount) {
  const steps = document.querySelectorAll('.process__step');
  const sio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const n = en.target.dataset.step;
        procCount.innerHTML = `${n[0]}<em>${n[1]}</em>`;
      }
    });
  }, { threshold: .6 });
  steps.forEach(s => sio.observe(s));
}

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__q')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ===== CONTACT FORM — Formspree ===== */
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  const success = form.querySelector('.form-success');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';
  try {
    const response = await fetch('https://formspree.io/f/xojrwbzv', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      btn.style.display = 'none';
      if (success) success.style.display = 'block';
      form.reset();
      setTimeout(() => {
        btn.style.display = '';
        btn.disabled = false;
        btn.textContent = 'Envoyer mon message →';
        if (success) success.style.display = 'none';
      }, 6000);
    } else {
      btn.disabled = false;
      btn.textContent = 'Réessayer →';
      alert('Une erreur est survenue. Merci de réessayer.');
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Réessayer →';
    alert('Problème de connexion. Merci de réessayer.');
  }
});
