/* ============================================================
   FERNANDO QUESADA MORA — PORTAFOLIO
   main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAV: fondo al hacer scroll + enlace activo ── */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const sections = [...navLinks]
    .map(a => document.getElementById(a.dataset.section))
    .filter(Boolean);

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── 2. NAV MÓVIL ── */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navLinks');

  const setMenu = (open) => {
    navList.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  navToggle.addEventListener('click', () => setMenu(!navList.classList.contains('open')));
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));


  /* ── 3. APARICIÓN SUAVE AL HACER SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 5) * 70}ms`;
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }


  /* ── 4. FILTRO DE PROYECTOS ── */
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      projects.forEach(p => {
        const show = f === 'all' || p.dataset.cat === f;
        p.hidden = !show;
        // La tarjeta destacada solo ocupa todo el ancho cuando se ven todos los proyectos
        if (p.classList.contains('wide')) p.style.gridColumn = f === 'all' || f === 'web' ? '' : 'auto';
      });
    });
  });


  /* ── 5. FOTO Y CERTIFICADOS: solo se muestran si la imagen existe ── */
  const portrait = document.getElementById('portrait');
  if (portrait) {
    const probe = new Image();
    probe.onload = () => portrait.classList.add('show');
    probe.src = portrait.querySelector('img').getAttribute('src');
  }

  document.querySelectorAll('.cert[data-img]').forEach(cert => {
    const probe = new Image();
    probe.onload = () => {
      cert.classList.add('has-img');
      cert.addEventListener('click', () => {
        openLightbox([cert.dataset.img], cert.querySelector('.cert-name').textContent);
      });
    };
    probe.src = cert.dataset.img;
  });


  /* ── 6. LIGHTBOX / GALERÍA ── */
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let gallery = [];
  let idx = 0;
  let title = '';
  let lastFocus = null;

  const render = () => {
    lbImg.src = gallery[idx];
    lbImg.alt = `${title} — imagen ${idx + 1} de ${gallery.length}`;
    lbCap.textContent = gallery.length > 1 ? `${title} · ${idx + 1} / ${gallery.length}` : title;
  };

  function openLightbox(images, name) {
    gallery = images;
    title = name;
    idx = 0;
    lastFocus = document.activeElement;
    lb.classList.toggle('single', images.length < 2);
    render();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  const step = (d) => {
    if (gallery.length < 2) return;
    idx = (idx + d + gallery.length) % gallery.length;
    render();
  };

  document.querySelectorAll('[data-gallery]').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.gallery.split(','), el.dataset.title));
  });

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  document.getElementById('lbNext').addEventListener('click', (e) => { e.stopPropagation(); step(1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });


  /* ── 7. FORMULARIO DE CONTACTO (Web3Forms) ── */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const W3F_KEY = '611327eb-a28d-4e98-966a-0ce08265a623';

  const say = (msg, type) => { note.textContent = msg; note.className = 'form-note ' + (type || ''); };
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) return say('Completa nombre, correo y mensaje.', 'err');
      if (!isValidEmail(email)) return say('Ingresa un correo válido.', 'err');

      const btn = form.querySelector('button[type="submit"]');
      const label = btn.querySelector('span');
      btn.disabled = true;
      label.textContent = 'Enviando…';
      say('');

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: W3F_KEY,
            name,
            email,
            subject: subject || 'Contacto desde portafolio',
            message
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Error al enviar');

        say('Mensaje enviado. Te respondo pronto.', 'ok');
        form.reset();
        setTimeout(() => say(''), 6000);
      } catch {
        say('No se pudo enviar. Escríbeme directo a fernando.quesadam@gmail.com', 'err');
      } finally {
        btn.disabled = false;
        label.textContent = 'Enviar mensaje';
      }
    });
  }
});
