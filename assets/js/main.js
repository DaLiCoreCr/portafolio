/* ============================================================
   FERNANDO QUESADA MORA — PORTAFOLIO
   main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: scroll shadow + active link ── */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    // Sombra en navbar al hacer scroll
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Resaltar link activo según sección visible
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // llamada inicial


  /* ── 2. NAVBAR MOBILE TOGGLE ── */
  const navToggle   = document.getElementById('navToggle');
  const navLinksEl  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
  });

  // Cerrar menú al hacer clic en un link
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinksEl.classList.remove('open'));
  });


  /* ── 3. REVEAL ON SCROLL (Intersection Observer) ── */
  const revealEls = document.querySelectorAll(
    '.project-card, .contact-card, .cert-card, .info-item, ' +
    '.skill-bar-item, .stag, .soft-item, .gallery-item, .about-text p, .about-lead'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay según índice entre los siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 60}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 4. SKILL BARS ANIMADAS ── */
  const skillBars = document.querySelectorAll('.skill-bar-item');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item  = entry.target;
        const level = item.dataset.level || '0';
        const fill  = item.querySelector('.skill-bar-fill');
        if (fill) {
          setTimeout(() => { fill.style.width = level + '%'; }, 200);
        }
        skillObserver.unobserve(item);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ── 5. LIGHTBOX ── */
  window.openLightbox = (src, caption) => {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    img.src   = src;
    img.alt   = caption;
    cap.textContent = caption;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = () => {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  };

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
  });

  // Cert cards con imagen
  document.querySelectorAll('.cert-card[data-img]').forEach(card => {
    card.addEventListener('click', () => {
      const img   = card.dataset.img;
      const name  = card.querySelector('.cert-name').textContent;
      openLightbox(img, name);
    });
  });


  /* ── 6. FORMULARIO DE CONTACTO (Web3Forms) ── */
  const form     = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  const W3F_KEY = '611327eb-a28d-4e98-966a-0ce08265a623';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formNote.style.color = '#ff6b6b';
        formNote.textContent = 'Por favor completa los campos obligatorios.';
        return;
      }

      if (!isValidEmail(email)) {
        formNote.style.color = '#ff6b6b';
        formNote.textContent = 'Por favor ingresa un email válido.';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Enviando…';

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body:    JSON.stringify({
            access_key: W3F_KEY,
            name,
            email,
            subject: subject || 'Contacto desde portafolio',
            message
          })
        });
        const data = await res.json();

        if (data.success) {
          formNote.style.color = '#00e676';
          formNote.textContent = '✅ ¡Mensaje enviado! Te contactaré pronto.';
          form.reset();
          setTimeout(() => { formNote.textContent = ''; }, 5000);
        } else {
          throw new Error(data.message || 'Error al enviar');
        }
      } catch {
        formNote.style.color = '#ff6b6b';
        formNote.textContent = '❌ No se pudo enviar. Escríbeme directo a fernando.quesadam@gmail.com';
      } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Enviar mensaje';
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ── 7. SMOOTH SCROLL para links internos ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 8. CURSOR GLOW (sutil efecto en desktop) ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.3s ease, top 0.3s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }


  /* ── 9. PARALLAX ── */
  const parallaxImg  = document.getElementById('parallaxImg');
  const parallaxGlow = document.getElementById('parallaxGlow');

  // Parallax al hacer scroll: la imagen se mueve más lento que la página
  const onParallaxScroll = () => {
    const y = window.scrollY;
    if (parallaxImg)  parallaxImg.style.transform  = `translateY(${y * 0.25}px)`;
    if (parallaxGlow) parallaxGlow.style.transform = `translateY(${y * 0.12}px)`;
  };

  window.addEventListener('scroll', onParallaxScroll, { passive: true });
  onParallaxScroll(); // llamada inicial

  // Parallax sutil al mover el mouse (solo dispositivos con cursor fino)
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      const cx   = window.innerWidth  / 2;
      const cy   = window.innerHeight / 2;
      const dx   = (e.clientX - cx) / cx;  // -1 a 1
      const dy   = (e.clientY - cy) / cy;  // -1 a 1
      const base = window.scrollY * 0.25;

      if (parallaxImg) {
        parallaxImg.style.transform =
          `translate(${dx * -12}px, ${base + dy * -10}px)`;
      }
      if (parallaxGlow) {
        parallaxGlow.style.transform =
          `translate(${dx * 28}px, ${window.scrollY * 0.12 + dy * 22}px)`;
      }
    });
  }

});

/* ── 10. MINI SLIDERS PROYECTOS ── */

document.querySelectorAll('.project-preview-slider')
  .forEach((slider) => {

    const slides = slider.querySelectorAll('.project-slide');

    const prevBtn = slider.querySelector('.prev');

    const nextBtn = slider.querySelector('.next');

    let current = 0;

    const showSlide = (index) => {

      slides.forEach(slide => {
        slide.classList.remove('active');
      });

      slides[index].classList.add('active');
    };

    nextBtn.addEventListener('click', () => {

      current++;

      if (current >= slides.length) {
        current = 0;
      }

      showSlide(current);
    });

    prevBtn.addEventListener('click', () => {

      current--;

      if (current < 0) {
        current = slides.length - 1;
      }

      showSlide(current);
    });

  });