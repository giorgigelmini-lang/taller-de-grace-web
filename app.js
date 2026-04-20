/**
 * El Taller de Grace — app.js  (Logic-Only)
 * ─────────────────────────────────────────────────────────────
 * REGOLA: questo file gestisce SOLO la logica.
 * Non modifica classi CSS né la struttura visiva del design.
 *
 * SOMMARIO:
 *  A. currentMonthData — UNICA FONTE DI VERITÀ (cambia solo qui per passare a Maggio, ecc.)
 *  B. liveSpots        — contatori live dei posti (volatili per sessione)
 *  C. Cursor custom
 *  D. Hero parallax + fade-in
 *  E. Navbar scroll state
 *  F. Reveal on scroll
 *  G. Mobile menu
 *  H. Smooth anchor scroll
 *  I. Calendario → apre modale
 *  J. Modale: pannello dettagli + pannello pagamento (iniettato) + pannello conferma
 *  K. Flusso prenotazione: Dettagli → Metodo di pagamento → Elaborazione → Conferma
 *  L. Countdown posti sul calendario dopo conferma
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     A. currentMonthData — UNICA FONTE DI VERITÀ
     ─────────────────────────────────────────────────────────
     Per passare a Maggio: cambia month/year e la sezione events.
     Il resto del codice si adatta automaticamente.
     ═══════════════════════════════════════════════════════════ */
  /* ─── Definisci SVG ─── */
  var iconBrush = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>';
  var iconWine = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>';
  var iconHand = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/><path d="M6 11V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/></svg>';

  /* ─── Shared taller config ─── */
  var tallerConfig = {
    waNumber:      '34613321899',
    bizumNumber:   '613 321 899',
    bizumDeposit:  10
  };

  /* ─── ABRIL 2026 ─── */
  var aprilData = {
    month: 'Abril',
    year:  '2026',
    waNumber:     tallerConfig.waNumber,
    bizumNumber:  tallerConfig.bizumNumber,
    bizumDeposit: tallerConfig.bizumDeposit,
    events: {
      4: {
        name:       'Pinta tu pieza',
        emoji:      iconBrush,
        dateStr:    'Sábado, 4 de abril 2026',
        desc:       'Elige una pieza de nuestro catálogo y píntala a tu manera. Nosotros la horneamos y te la entregamos lista para usar. ¡Añadimos una bebida de cortesía!',
        price:      28,
        priceStr:   '28€',
        time:       '11:30–13:30',
        duration:   '2h',
        spots:      5,
        totalSpots: 8
      },
      11: {
        name:       'Cerámica y Vino',
        emoji:      iconWine,
        dateStr:    'Sábado, 11 de abril 2026',
        desc:       'Moldea barro, ríete de tus errores y brinda con un buen vino malagueño. La noche más relajada que puedes tener un sábado. Sin experiencia previa. Materiales, copa y vino malagueño incluidos.',
        price:      45,
        priceStr:   '45€',
        time:       '19:00–21:30',
        duration:   '2,5h',
        spots:      3,
        totalSpots: 10
      },
      12: {
        name:       'Torno de Alfarería',
        emoji:      iconHand,
        dateStr:    'Domingo, 12 de abril 2026',
        desc:       'El torno no perdona las prisas. Aprende la técnica ancestral con Grace en un grupo muy reducido. La experiencia más meditativa del taller. Paciencia recompensada. Materiales incluidos.',
        price:      65,
        priceStr:   '65€',
        time:       '11:00–14:00',
        duration:   '3h',
        spots:      2,
        totalSpots: 6
      },
      18: {
        name:       'Pinta tu taza',
        emoji:      iconBrush,
        dateStr:    'Sábado, 18 de abril 2026',
        desc:       'No necesitas ninguna experiencia. Ven y personaliza tu propia taza de cerámica con esmaltes de colores. Cuando esté horneada, puedes recogerla en el taller. Materiales y horneado incluidos.',
        price:      28,
        priceStr:   '28€',
        time:       '12:00–14:00',
        duration:   '2h',
        spots:      6,
        totalSpots: 8
      },
      19: {
        name:       'Cerámica y Vino',
        emoji:      iconWine,
        dateStr:    'Domingo, 19 de abril 2026',
        desc:       'Moldea barro, ríete de tus errores y brinda con un buen vino malagueño. Una tarde perfecta para ir en pareja, con amigas o simplemente sola. Materiales, copa y vino incluidos.',
        price:      45,
        priceStr:   '45€',
        time:       '19:00–21:30',
        duration:   '2,5h',
        spots:      4,
        totalSpots: 10
      },
      25: {
        name:       'Manos en el Barro',
        emoji:      iconHand,
        dateStr:    'Sábado, 25 de abril 2026',
        desc:       'Modelado libre con arcilla. Sin rueda, sin torno — solo tus manos, la arcilla y la guía de Grace. Perfecto para principiantes absolutos que quieren descubrir si la cerámica es lo suyo.',
        price:      35,
        priceStr:   '35€',
        time:       '11:00–13:30',
        duration:   '2,5h',
        spots:      5,
        totalSpots: 8
      }
    }
  };

  /* ─── MAYO 2026 — activar cambiando currentMonthData = mayData ─── */
  var mayData = {
    month: 'Mayo',
    year:  '2026',
    waNumber:     tallerConfig.waNumber,
    bizumNumber:  tallerConfig.bizumNumber,
    bizumDeposit: tallerConfig.bizumDeposit,
    events: {
      2: {
        name:       'Pinta tu pieza',
        emoji:      iconBrush,
        dateStr:    'Sábado, 2 de mayo 2026',
        desc:       'Elige una pieza de nuestro catálogo y píntala a tu manera. Nosotros la horneamos y te la entregamos lista para usar. ¡Añadimos una bebida de cortesía!',
        price:      28,
        priceStr:   '28€',
        time:       '11:30–13:30',
        duration:   '2h',
        spots:      8,
        totalSpots: 8
      },
      9: {
        name:       'Cerámica y Vino',
        emoji:      iconWine,
        dateStr:    'Sábado, 9 de mayo 2026',
        desc:       'Moldea barro, ríete de tus errores y brinda con un buen vino malagueño. La noche más relajada que puedes tener un sábado. Materiales, copa y vino malagueño incluidos.',
        price:      45,
        priceStr:   '45€',
        time:       '19:00–21:30',
        duration:   '2,5h',
        spots:      10,
        totalSpots: 10
      },
      10: {
        name:       'Torno de Alfarería',
        emoji:      iconHand,
        dateStr:    'Domingo, 10 de mayo 2026',
        desc:       'El torno no perdona las prisas. Aprende la técnica ancestral con Grace en un grupo muy reducido. La experiencia más meditativa del taller. Materiales incluidos.',
        price:      65,
        priceStr:   '65€',
        time:       '11:00–14:00',
        duration:   '3h',
        spots:      6,
        totalSpots: 6
      },
      16: {
        name:       'Pinta tu taza',
        emoji:      iconBrush,
        dateStr:    'Sábado, 16 de mayo 2026',
        desc:       'Diseña y pinta tu propia taza de cerámica con esmaltes de colores. Cuando esté horneada, puedes recogerla en el taller. Materiales y horneado incluidos.',
        price:      28,
        priceStr:   '28€',
        time:       '12:00–14:00',
        duration:   '2h',
        spots:      8,
        totalSpots: 8
      },
      23: {
        name:       'Cerámica y Vino',
        emoji:      iconWine,
        dateStr:    'Sábado, 23 de mayo 2026',
        desc:       'Moldea barro y brinda con un buen vino malagueño. Una tarde perfecta para ir en pareja, con amigas o simplemente sola. Materiales, copa y vino incluidos.',
        price:      45,
        priceStr:   '45€',
        time:       '19:00–21:30',
        duration:   '2,5h',
        spots:      10,
        totalSpots: 10
      },
      31: {
        name:       'Manos en el Barro',
        emoji:      iconHand,
        dateStr:    'Domingo, 31 de mayo 2026',
        desc:       'Modelado libre con arcilla. Sin rueda, sin torno — solo tus manos, la arcilla y la guía de Grace. Perfecto para principiantes absolutos.',
        price:      35,
        priceStr:   '35€',
        time:       '11:00–13:30',
        duration:   '2,5h',
        spots:      8,
        totalSpots: 8
      }
    }
  };

  /* ─── MES ACTIVO — cambiar aquí para pasar a Mayo ─── */
  var currentMonthData = aprilData;

  /* ─── RESEÑAS — fuente de verdad ─── */
  var reviewsData = [
    {
      author:  'Aitana López',
      tag:     'Cerámica y Vino',
      stars:   5,
      text:    'Una experiencia única. Fui con mis amigas al taller de Cerámica y Vino y nos encantó. Grace es un amor y explica todo super bien. ¡Repetiremos seguro!'
    },
    {
      author:  'Marisa G.',
      tag:     'Torno de Alfarería',
      stars:   5,
      text:    'El taller es precioso y tiene una energía increíble. He hecho el curso de torno y me he sentido super relajada. Un sitio de 10 en el centro de Málaga.'
    }
  ];

  /* ═══════════════════════════════════════════════════════════
     B. liveSpots — contatori live dei posti (volatili)
     Si decrementano nella sessione quando l'utente prenota.
     Separati da currentMonthData per non sovrascrivere la sorgente.
     ═══════════════════════════════════════════════════════════ */
  var liveSpots = {};
  Object.keys(currentMonthData.events).forEach(function (day) {
    liveSpots[day] = currentMonthData.events[day].spots;
  });

  /* ─── Helper: costruisce link WhatsApp con messaggio pre-compilato ─── */
  function buildWaLink(event, paymentMethod) {
    var method = paymentMethod === 'bizum'
      ? 'He%20pagado%20la%20se%C3%B1al%20de%20' + currentMonthData.bizumDeposit + '%E2%82%AC%20por%20Bizum%20al%20' + encodeURIComponent(currentMonthData.bizumNumber) + '.%20'
      : '';
    var msg =
      'Hola%20Grace!%20' + method +
      'Quiero%20reservar%20una%20plaza%20para%3A%0A' +
      '%F0%9F%93%85%20' + encodeURIComponent(event.name) + '%0A' +
      '%F0%9F%97%93%20' + encodeURIComponent(event.dateStr) + '%0A' +
      '%F0%9F%95%90%20' + encodeURIComponent(event.time) + '%0A' +
      'Precio%3A%20' + encodeURIComponent(event.priceStr) + '%0A' +
      '%C2%BFHay%20plaza%20disponible%3F%20Gracias!%20%F0%9F%8F%BA';
    return 'https://wa.me/' + currentMonthData.waNumber + '?text=' + msg;
  }

  /* ─── Helper: formatta posti rimanenti ─── */
  function formatSpots(spots, urgent) {
    if (spots <= 0) return '¡Completo!';
    if (urgent || spots <= 3) return '¡Solo ' + spots + (spots === 1 ? ' plaza!' : ' plazas!');
    return spots + ' disponibles';
  }

  /* ─── Helper: è urgente? ─── */
  function isUrgent(spots) { return spots <= 3; }


  /* ═══════════════════════════════════════════════════════════
     C. CURSOR CUSTOM (clay dot + ring)
     ═══════════════════════════════════════════════════════════ */
  var supportsHover = window.matchMedia('(hover: hover)').matches;

  if (supportsHover) {
    var dot  = document.getElementById('cursor');
    var ring = document.getElementById('cursor-ring');
    var mouseX = -100, mouseY = -100;
    var ringX  = -100, ringY  = -100;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function registerHoverEl(el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    }
    document.querySelectorAll('a, button, [role="button"], .cal-day.has-event').forEach(registerHoverEl);

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.13;
      ringY += (mouseY - ringY) * 0.13;
      dot.style.transform  = 'translate(' + (mouseX - 4)  + 'px,' + (mouseY - 4)  + 'px)';
      ring.style.transform = 'translate(' + (ringX - 17)  + 'px,' + (ringY - 17)  + 'px)';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }


  /* ═══════════════════════════════════════════════════════════
     D. HERO IMAGE FADE-IN + PARALLAX
     ═══════════════════════════════════════════════════════════ */
  var heroBgImg = document.getElementById('heroBgImg');
  if (heroBgImg) {
    function revealHeroImg() { heroBgImg.classList.add('hero-loaded'); }
    if (heroBgImg.complete && heroBgImg.naturalWidth > 0) {
      requestAnimationFrame(revealHeroImg);
    } else {
      heroBgImg.addEventListener('load', revealHeroImg);
    }
    var hTicking = false;
    window.addEventListener('scroll', function () {
      if (!hTicking) {
        requestAnimationFrame(function () {
          if (window.scrollY < window.innerHeight) {
            heroBgImg.style.transform = 'translateY(' + (window.scrollY * 0.12) + 'px) scale(1.06)';
          }
          hTicking = false;
        });
        hTicking = true;
      }
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════
     E. NAVBAR SCROLL STATE
     ═══════════════════════════════════════════════════════════ */
  var navbar = document.getElementById('navbar');
  function handleNavScroll() { navbar.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ═══════════════════════════════════════════════════════════
     F. REVEAL ON SCROLL (IntersectionObserver)
     ═══════════════════════════════════════════════════════════ */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ═══════════════════════════════════════════════════════════
     G. MOBILE MENU
     ═══════════════════════════════════════════════════════════ */
  var hamburger   = document.getElementById('hamburger');
  var mobileMenu  = document.getElementById('mobileMenu');
  var menuClose   = document.getElementById('menuClose');
  var mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu()  { mobileMenu.classList.add('open'); hamburger.setAttribute('aria-expanded','true');  document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(function (l) { l.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });


  /* ═══════════════════════════════════════════════════════════
     H. SMOOTH ANCHOR SCROLL
     ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
      closeMenu();
    });
  });


  /* ═══════════════════════════════════════════════════════════
     I–L. CALENDARIO + MODALE + BOOKING FLOW
     ═══════════════════════════════════════════════════════════ */

  /* ─── Elementi DOM del modale ─── */
  var modalOverlay  = document.getElementById('modalOverlay');
  var modalCard     = document.getElementById('modalCard');
  var modalPanel    = document.getElementById('modalPanel');
  var modalConfirm  = document.getElementById('modalConfirm');
  var modalClose    = document.getElementById('modalClose');
  var modalDateTag  = document.getElementById('modalDateTag');
  var modalEmoji    = document.getElementById('modalEmoji');
  var modalTitle    = document.getElementById('modalTitle');
  var modalDesc     = document.getElementById('modalDesc');
  var modalPrice    = document.getElementById('modalPrice');
  var modalTime     = document.getElementById('modalTime');
  var modalDuration = document.getElementById('modalDuration');
  var spotsFill     = document.getElementById('spotsFill');
  var spotsCount    = document.getElementById('spotsCount');
  var btnBook       = document.getElementById('btnBook');
  var btnBookWa     = document.getElementById('btnBookWa');
  var confirmSub    = document.getElementById('confirmSub');
  var confirmWaLink = document.getElementById('confirmWaLink');
  var confirmBack   = document.getElementById('confirmBack');

  /* ─── Iniezione pannello pagamento nel modalCard ─────────
     Usa le classi CSS già esistenti — nessuna nuova regola.
     ─────────────────────────────────────────────────────── */
  var paymentPanelEl = document.createElement('div');
  paymentPanelEl.id = 'modalPayment';
  paymentPanelEl.className = 'modal-panel hidden';
  paymentPanelEl.setAttribute('aria-live', 'polite');
  paymentPanelEl.innerHTML = [
    '<div class="modal-header-band">',
    '  <button class="modal-close" id="paymentClose" aria-label="Cerrar">✕</button>',
    '  <span class="modal-date-tag" id="paymentDateTag"></span>',
    '  <div class="modal-emoji-svg" id="paymentEmoji" aria-hidden="true"></div>',
    '  <h2 class="modal-title" id="paymentTitle">¿Cómo prefieres reservar?</h2>',
    '</div>',
    '<div class="modal-body">',
    '  <p class="modal-desc" id="paymentDesc">',
    '    Elige la opción que más te convenga. En todos los casos Grace confirmará tu plaza en menos de 24h.',
    '  </p>',
    '  <div id="paymentOptions" style="display:flex;flex-direction:column;gap:.75rem;margin-bottom:1.2rem;">',
    '    <button class="btn-book" id="payBizum"',
    '      style="background:var(--terracotta);justify-content:flex-start;padding:.9rem 1.4rem;gap:.8rem;">',
    '      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="opacity:0.9;"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
    '      <span style="text-align:left;">',
    '        <strong style="display:block;font-size:.85rem;">Señal por Bizum (10€)</strong>',
    '        <span style="font-weight:300;font-size:.72rem;opacity:.82;letter-spacing:.03em;text-transform:none;">Envía 10€ al <span id="bizumNumDisplay"></span> · resto en el taller</span>',
    '      </span>',
    '    </button>',
    '    <button class="btn-book" id="payTaller"',
    '      style="background:var(--brown-mid);justify-content:flex-start;padding:.9rem 1.4rem;gap:.8rem;">',
    '      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="opacity:0.9;"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
    '      <span style="text-align:left;">',
    '        <strong style="display:block;font-size:.85rem;">Reserva sin señal</strong>',
    '        <span style="font-weight:300;font-size:.72rem;opacity:.82;letter-spacing:.03em;text-transform:none;">Confirma por WhatsApp · pago completo el día del taller</span>',
    '      </span>',
    '    </button>',
    '  </div>',
    '  <div id="paymentProcessing" class="modal-panel hidden" style="text-align:center;padding:2rem 0;">',
    '    <div id="processingSpinner" style="',
    '      width:48px;height:48px;border-radius:50%;',
    '      border:3px solid var(--cream-dark);',
    '      border-top-color:var(--terracotta);',
    '      animation:spinLoader .9s linear infinite;',
    '      margin:0 auto 1.2rem;">',
    '    </div>',
    '    <p style="font-family:var(--font-heading);font-size:1.4rem;font-style:italic;color:var(--brown-dark);">',
    '      Procesando reserva...',
    '    </p>',
    '  </div>',
    '  <p style="font-size:.74rem;color:var(--text-light);text-align:center;margin-top:.4rem;" id="paymentNote">',
    '    Tu plaza queda reservada. Grace te confirma en &lt;24h.',
    '  </p>',
    '</div>'
  ].join('');
  modalCard.appendChild(paymentPanelEl);

  /* Spinner CSS — iniettato una sola volta nel <head> */
  (function () {
    var style = document.createElement('style');
    style.textContent = '@keyframes spinLoader{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }());

  /* ─── Riferimenti ai nuovi elementi ─── */
  var modalPayment      = document.getElementById('modalPayment');
  var paymentClose      = document.getElementById('paymentClose');
  var paymentDateTag    = document.getElementById('paymentDateTag');
  var paymentEmoji      = document.getElementById('paymentEmoji');
  var payBizum          = document.getElementById('payBizum');
  var payTaller         = document.getElementById('payTaller');
  var paymentOptions    = document.getElementById('paymentOptions');
  var paymentProcessing = document.getElementById('paymentProcessing');
  var paymentNote       = document.getElementById('paymentNote');
  var bizumNumDisplay   = document.getElementById('bizumNumDisplay');

  /* Stato sessione */
  var currentDay = null;

  /* ─── Utility: mostra/nasconde pannelli ─── */
  function showPanel(panel) {
    [modalPanel, modalPayment, modalConfirm].forEach(function (p) {
      p.classList.add('hidden');
      if (p !== modalConfirm) p.style.display = '';
    });
    modalConfirm.classList.remove('show');
    panel.classList.remove('hidden');
    if (panel === modalConfirm) panel.classList.add('show');
  }

  /* ─── Apri modale con i dati del corso ─── */
  function openModal(day) {
    var ev = currentMonthData.events[day];
    if (!ev) return;
    currentDay = day;


    var spots = liveSpots[day];
    var urgent = isUrgent(spots);

    /* Pannello dettagli */
    modalDateTag.textContent  = ev.dateStr;
    modalEmoji.innerHTML      = ev.emoji;
    modalTitle.textContent    = ev.name;
    modalDesc.textContent     = ev.desc;
    modalPrice.textContent    = ev.priceStr;
    modalTime.textContent     = ev.time;
    modalDuration.textContent = ev.duration;

    /* Dinamismo icone: */
    var modFeat2 = document.getElementById('modFeat2');
    if (modFeat2) {
      if (ev.name.includes('Vino') || ev.name.includes('pieza')) {
        modFeat2.style.display = 'block';
      } else {
        modFeat2.style.display = 'none';
      }
    }

    /* Barra posti */
    spotsFill.style.width = '0%';
    var pct = Math.round((spots / ev.totalSpots) * 100);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { spotsFill.style.width = pct + '%'; });
    });
    if (urgent) { spotsFill.classList.add('urgent'); spotsCount.classList.add('urgent'); }
    else        { spotsFill.classList.remove('urgent'); spotsCount.classList.remove('urgent'); }
    spotsCount.textContent = formatSpots(spots, urgent);

    /* Pulsante book */
    if (spots <= 0) {
      btnBook.textContent = '¡Lista de espera!';
      btnBook.style.background = 'var(--text-light)';
    } else {
      btnBook.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg> Quiero esta plaza';
      btnBook.style.background = '';
    }

    /* Link WA diretto */
    btnBookWa.href = buildWaLink(ev, 'whatsapp');

    showPanel(modalPanel);

    /* Apri overlay */
    modalOverlay.removeAttribute('aria-hidden');
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { modalClose.focus(); }, 50);
  }

  /* ─── Chiudi modale ─── */
  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      currentDay   = null;
  
      showPanel(modalPanel);
      spotsFill.style.width = '0%';
    }, 320);
  }

  /* ─── Mostra pannello pagamento ─── */
  function showPaymentPanel() {
    var ev = currentMonthData.events[currentDay];
    if (!ev) return;

    paymentDateTag.textContent = ev.dateStr;
    paymentEmoji.innerHTML     = ev.emoji;
    bizumNumDisplay.textContent = currentMonthData.bizumNumber;

    paymentOptions.style.display    = '';
    paymentProcessing.classList.add('hidden');
    paymentNote.style.display       = '';

    showPanel(modalPayment);
    setTimeout(function () { paymentClose.focus(); }, 50);
  }

  /* ─── Simula elaborazione → conferma ─── */
  function simulateBooking(method) {

    /* Mostra spinner */
    paymentOptions.style.display = 'none';
    paymentNote.style.display    = 'none';
    paymentProcessing.classList.remove('hidden');

    setTimeout(function () {
      /* Decrementa posti live */
      if (liveSpots[currentDay] > 0) {
        liveSpots[currentDay]--;
        updateCalendarDay(currentDay);
      }

      /* Popola pannello conferma */
      var ev          = currentMonthData.events[currentDay];
      var methodLabel = method === 'bizum'
        ? 'Has enviado la señal de ' + currentMonthData.bizumDeposit + '€ por Bizum al ' + currentMonthData.bizumNumber + '. '
        : '';

      confirmSub.textContent =
        methodLabel +
        'Tu plaza para "' + ev.name + '" el ' + ev.dateStr +
        ' (' + ev.time + ') está pendiente de confirmación. ' +
        'Grace te responderá en WhatsApp en menos de 24 horas.';

      confirmWaLink.href = buildWaLink(ev, method);

      showPanel(modalConfirm);
      setTimeout(function () { confirmWaLink.focus(); }, 80);
    }, 1600);
  }

  /* ─── Aggiorna giorno sul calendario dopo prenotazione ─── */
  function updateCalendarDay(day) {
    var dayEl = document.querySelector('.cal-day.has-event[data-day="' + day + '"]');
    if (!dayEl) return;
    var spots = liveSpots[day];

    if (spots <= 0) {
      /* Sold out: rimuove interattività, aggiorna visivo */
      dayEl.classList.remove('has-event', 'urgent-event');
      dayEl.removeAttribute('role');
      dayEl.removeAttribute('tabindex');
      dayEl.style.background    = 'var(--cream-dark)';
      dayEl.style.color         = 'var(--text-light)';
      dayEl.style.opacity       = '0.55';
      dayEl.style.boxShadow     = 'none';
      dayEl.style.cursor        = 'default';
      var labelEl = dayEl.querySelector('.event-label');
      if (labelEl) labelEl.textContent = 'Completo';
    } else {
      /* Aggiorna etichetta posti */
      if (isUrgent(spots) && !dayEl.classList.contains('urgent-event')) {
        dayEl.classList.add('urgent-event');
      }
      var labelEl2 = dayEl.querySelector('.event-label');
      if (labelEl2) {
        /* Mantieni la prima riga (nome corso abbreviato), aggiorna seconda */
        var lines = labelEl2.innerHTML.split('<br>');
        if (lines.length >= 2) {
          labelEl2.innerHTML = lines[0] + '<br>' + spots + ' plaza' + (spots !== 1 ? 's' : '');
        }
      }
    }
  }


  /* ─── Listener: giorni calendario ─── */
  document.querySelectorAll('.cal-day.has-event').forEach(function (dayEl) {
    var day = parseInt(dayEl.getAttribute('data-day'), 10);
    if (!day || !currentMonthData.events[day]) return;

    dayEl.addEventListener('click', function () { openModal(day); });
    dayEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(day); }
    });
  });

  /* ─── Listener: chiusura modale ─── */
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  /* ─── Listener: bottone "Quiero esta plaza" ─── */
  btnBook.addEventListener('click', function () {
    if (!currentDay) return;
    if (liveSpots[currentDay] <= 0) {
      /* Lista attesa: va direttamente a WhatsApp */
      var ev = currentMonthData.events[currentDay];
      window.open('https://wa.me/' + currentMonthData.waNumber +
        '?text=Hola%20Grace%2C%20me%20gustar%C3%ADa%20apuntarme%20a%20la%20lista%20de%20espera%20de%20' +
        encodeURIComponent(ev.name) + '%20(' + encodeURIComponent(ev.dateStr) + ').',
        '_blank', 'noopener,noreferrer');
      return;
    }
    showPaymentPanel();
  });

  /* ─── Listener: chiusura pannello pagamento ─── */
  paymentClose.addEventListener('click', function () { showPanel(modalPanel); });

  /* ─── Listener: metodo Bizum ─── */
  payBizum.addEventListener('click', function () { simulateBooking('bizum'); });

  /* ─── Listener: pago en taller ─── */
  payTaller.addEventListener('click', function () { simulateBooking('taller'); });

  /* ─── Listener: "Volver" nel pannello conferma ─── */
  confirmBack.addEventListener('click', function (e) {
    e.preventDefault();
    openModal(currentDay || parseInt(
      document.querySelector('.cal-day.has-event') &&
      document.querySelector('.cal-day.has-event').getAttribute('data-day'), 10
    ));
  });


  /* ═══════════════════════════════════════════════════════════
     NOTE PER IL CAMBIO MESE
     ─────────────────────────────────────────────────────────
     Per passare ad Agosto 2026, per esempio:
     1. Cambia currentMonthData.month e .year
     2. Aggiorna gli eventi in currentMonthData.events con le nuove date
     3. Nel HTML: aggiorna data-day, cal-month-title, aria-label dei giorni
     4. Il resto del codice funziona senza modifiche.
     ═══════════════════════════════════════════════════════════ */

}());
