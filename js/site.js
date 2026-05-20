/**
 * سكربت مشترك — واتساب، قائمة، فوتر، نماذج (بدون Backend)
 */
(function () {
  'use strict';

  const cfg = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {
    whatsapp: { default: '201223962139', messagePrefix: 'مرحباً، ' },
    siteName: 'ميديكال زون',
    social: { facebook: '#', facebookPhotos: '#' }
  };

  const LEGAL_LINKS = {
    'الشروط والأحكام': 'terms.html',
    'سياسة الخصوصية': 'privacy.html',
    'الدعم الفني': 'support.html',
    'الأسئلة الشائعة': 'faq.html'
  };

  function waDigits(num) {
    return String(num || cfg.whatsapp.default).replace(/\D/g, '');
  }

  function buildWhatsAppUrl(text) {
    const phone = waDigits(cfg.whatsapp.default);
    const msg = (cfg.whatsapp.messagePrefix || '') + (text || '');
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }

  window.MZ = {
    buildWhatsAppUrl,
    formatPrice: function (n) {
      return Number(n).toLocaleString('ar-EG') + ' ' + (cfg.shipping?.currency || 'ج.م');
    },
    orderProductWhatsApp: function (product) {
      const lines = [
        'مرحباً ميديكال زون،',
        'أرغب في الاستفسار عن المنتج:',
        '• ' + (product.title || product.name || ''),
        product.category ? '• القسم: ' + product.category : '',
        product.price != null ? '• السعر: ' + Number(product.price).toLocaleString('ar-EG') + ' ج.م' : '',
        '• الرابط: ' + window.location.href
      ].filter(Boolean);
      window.open(buildWhatsAppUrl(lines.join('\n')), '_blank', 'noopener');
    }
  };

  function initHeader() {
    const header = document.getElementById('site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });
    }

    const menuBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const closeBtn = document.getElementById('drawerClose');
    if (!menuBtn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
  }

  function initWhatsAppFloat() {
    if (document.getElementById('mz-whatsapp-float')) return;
    const a = document.createElement('a');
    a.id = 'mz-whatsapp-float';
    a.className = 'mz-whatsapp-float';
    a.href = buildWhatsAppUrl('أرغب في الاستفسار عن الأجهزة الطبية.');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'تواصل عبر واتساب');
    a.innerHTML = '<i class="fab fa-whatsapp"></i><span>واتساب</span>';
    document.body.appendChild(a);
  }

  function initHeaderWhatsApp() {
    document.querySelectorAll('.header-actions').forEach(function (actions) {
      if (actions.querySelector('.header-wa-btn')) return;
      const cart = actions.querySelector('.cart-btn');
      if (cart) cart.remove();
      actions.querySelectorAll('a.btn-outline-sm[href="#"]').forEach(function (el) { el.remove(); });
      const wa = document.createElement('a');
      wa.href = buildWhatsAppUrl('مرحباً، أريد الاستفسار.');
      wa.className = 'header-wa-btn';
      wa.target = '_blank';
      wa.rel = 'noopener';
      wa.innerHTML = '<i class="fab fa-whatsapp"></i> واتساب';
      actions.appendChild(wa);
    });
  }

  function patchFooterAndSocial() {
    document.querySelectorAll('.footer-links a, .footer-col ul.footer-links a').forEach(function (a) {
      const t = a.textContent.trim();
      if (LEGAL_LINKS[t]) a.href = LEGAL_LINKS[t];
    });

    const waUrl = buildWhatsAppUrl('');
    document.querySelectorAll('.social-links a, .social-icons-large a').forEach(function (a) {
      const icon = a.querySelector('.fa-whatsapp');
      if (icon) {
        a.href = waUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      if (a.querySelector('.fa-facebook-f') && cfg.social.facebook) {
        a.href = cfg.social.facebook;
      }
      if (a.querySelector('.fa-instagram') && cfg.social.instagram) {
        a.href = cfg.social.instagram;
      }
    });

    document.querySelectorAll('.payment-icons').forEach(function (el) {
      el.style.display = 'none';
    });
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value?.trim() || '';
      const email = form.querySelector('[name="email"]')?.value?.trim() || '';
      const subject = form.querySelector('[name="subject"]')?.value?.trim() || 'استفسار من الموقع';
      const message = form.querySelector('[name="message"]')?.value?.trim() || '';
      const text = [
        'رسالة من موقع ميديكال زون',
        'الاسم: ' + name,
        email ? 'البريد: ' + email : '',
        'الموضوع: ' + subject,
        'الرسالة:',
        message
      ].filter(Boolean).join('\n');
      window.open(buildWhatsAppUrl(text), '_blank', 'noopener');
    });
  }

  function initMaintenanceForm() {
    const form = document.getElementById('maintenanceForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const get = function (n) { return form.querySelector('[name="' + n + '"]')?.value?.trim() || ''; };
      const text = [
        'طلب صيانة — ميديكال زون',
        'الاسم: ' + get('name'),
        'الموبايل: ' + get('phone'),
        'المستشفى/المركز: ' + get('facility'),
        'نوع الجهاز: ' + get('device'),
        'الأهمية: ' + get('priority'),
        'وصف العطل:',
        get('description'),
        '(يمكن إرسال صور العطل في نفس المحادثة على واتساب)'
      ].join('\n');
      window.open(buildWhatsAppUrl(text), '_blank', 'noopener');
    });

    const fileWrap = form.querySelector('.file-upload-wrapper');
    const fileInput = form.querySelector('#fileInput');
    if (fileWrap && fileInput) {
      fileWrap.addEventListener('click', function () { fileInput.click(); });
    }
  }

  function initMaintenanceMobileNav() {
    if (document.getElementById('mobileMenuBtn') || !document.querySelector('.maintenance-form, #maintenanceForm')) return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initWhatsAppFloat();
    initHeaderWhatsApp();
    patchFooterAndSocial();
    initContactForm();
    initMaintenanceForm();
  });
})();
