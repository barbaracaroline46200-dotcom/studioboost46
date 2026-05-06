/* ================================================
   STUDIO BOOST 46 — Script principal
   ================================================ */

/* Navigation : effet au scroll */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* Menu burger mobile */
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.querySelector('.nav__mobile');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});
document.querySelectorAll('.nav__mobile a').forEach(link =>
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  })
);

/* Lien actif dans la nav */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

/* Animations fade-up au scroll */
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => io.observe(el));
}

/* Compteurs animés */
function countUp(el, target, duration = 1800) {
  const suffix = el.dataset.suffix || '';
  let startTs = null;
  function step(ts) {
    if (!startTs) startTs = ts;
    const p = Math.min((ts - startTs) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statNums = document.querySelectorAll('.stat__num[data-count]');
if (statNums.length) {
  const statsIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target, parseInt(e.target.dataset.count));
        statsIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsIo.observe(el));
}

/* Accordéon FAQ */
document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__q')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* Filtres projets */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.projet-card').forEach(card => {
      const visible = filter === 'all' || card.dataset.type === filter;
      card.style.display = visible ? '' : 'none';
      if (visible) setTimeout(() => card.classList.add('visible'), 10);
    });
  });
});

/* Formulaire de contact */
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  const success = form.querySelector('.form-success');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';
  setTimeout(() => {
    btn.style.display = 'none';
    if (success) { success.style.display = 'block'; }
    form.reset();
    setTimeout(() => {
      btn.style.display = '';
      btn.disabled = false;
      btn.textContent = 'Envoyer mon message →';
      if (success) success.style.display = 'none';
    }, 5000);
  }, 1200);
});
