/* =========================================================
   Hidelberg Martínez — Portafolio · interacciones
   Sin dependencias. Todo es mejora progresiva: el contenido
   está en el HTML y funciona sin JavaScript.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var EMAIL = 'hidelmartinez21@gmail.com';
  var WHATSAPP = '584224037878';
  var CV_URL = 'assets/cv/Hidelberg-Martinez-CV.pdf';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function store(method, key, value) {
    try {
      if (method === 'get') return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* almacenamiento no disponible */ }
    return null;
  }

  /* ---------- Toast ---------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
  }

  /* ---------- Tema ---------- */
  var themeBtn = $('#theme-toggle');
  function applyTheme(t, persist) {
    root.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    if (persist) store('set', 'theme', t);
  }
  function toggleTheme() {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  }
  applyTheme(root.getAttribute('data-theme') || 'dark', false);
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  /* ---------- Header: estado al hacer scroll y barra de progreso ---------- */
  var header = $('.site-header');
  var progress = $('.scroll-progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle('is-scrolled', y > 8);
      progress.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1) : 0);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var menuBtn = $('.menu-toggle');
  var nav = $('#main-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Enlace activo según la sección visible ---------- */
  var navLinks = $$('.main-nav a');
  if ('IntersectionObserver' in window) {
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) sectionObs.observe(target);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var reveals = $$('.reveal');
  reveals.forEach(function (el) {
    var siblings = $$(':scope > .reveal', el.parentElement);
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 6) * 0.07 + 's');
  });
  if ('IntersectionObserver' in window && !reducedMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contadores animados ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reducedMotion || isNaN(target)) { el.textContent = target; return; }
    var start = performance.now();
    var dur = 1400;
    (function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    })(start);
  }
  var stats = $('.stats');
  if (stats && 'IntersectionObserver' in window) {
    var statObs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      $$('[data-count]', stats).forEach(animateCount);
      statObs.disconnect();
    }, { threshold: 0.4 });
    statObs.observe(stats);
  }

  /* ---------- Palabra rotativa del titular ---------- */
  var rotWord = $('.rotator-word');
  if (rotWord && !reducedMotion) {
    var words = ['escalan.', 'ahorran horas.', 'reducen errores.', 'crecen contigo.'];
    var w = 0;
    setInterval(function () {
      if (document.hidden) return;
      rotWord.classList.add('is-out');
      setTimeout(function () {
        w = (w + 1) % words.length;
        rotWord.textContent = words[w];
        rotWord.classList.remove('is-out');
      }, 350);
    }, 2800);
  }

  /* ---------- Fondo del hero e inclinación de la ventana de código ---------- */
  var hero = $('.hero');
  var gridBg = $('.grid-bg');
  var codeWin = $('.code-window');
  if (hero && finePointer && !reducedMotion) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      gridBg.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      gridBg.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      if (window.innerWidth > 920) {
        codeWin.style.setProperty('--ry', ((px - 0.5) * 10 - 4).toFixed(2) + 'deg');
        codeWin.style.setProperty('--rx', ((0.5 - py) * 8 + 2).toFixed(2) + 'deg');
      }
    });
    hero.addEventListener('pointerleave', function () {
      codeWin.style.removeProperty('--ry');
      codeWin.style.removeProperty('--rx');
    });
  }

  /* ---------- Efecto spotlight en tarjetas ---------- */
  if (finePointer) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.spotlight');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--y', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Ventana de código ---------- */
  var SNIPPETS = [
    {
      lang: 'py',
      foot: 'Odoo 18 · Python 3.11 · Webhook HubSpot',
      code: [
        "@http.route('/hubspot/webhook/deal', type='http',",
        "            auth='public', csrf=False)",
        'def deal_webhook(self, **kw):',
        '    body = request.httprequest.get_data()',
        '    if not self._valid_signature(body):  # HMAC v3',
        '        return Response(status=401)',
        "    Event = request.env['hubspot.webhook.event']",
        '    Event.sudo().enqueue(body)',
        '    return Response(status=200)  # ~50 ms'
      ]
    },
    {
      lang: 'py',
      foot: 'Odoo 19 · Nómina · Liquidación de comisiones',
      code: [
        'class HrPayslip(models.Model):',
        "    _inherit = 'hr.payslip'",
        '',
        '    commission_ids = fields.One2many(',
        "        'commission.line', 'payslip_id')",
        '',
        '    def action_payslip_done(self):',
        '        res = super().action_payslip_done()',
        '        lines = self.commission_ids',
        '        lines._mark_settled(self.date_to)',
        '        return res'
      ]
    },
    {
      lang: 'jsx',
      foot: 'React 18 · TanStack Query · PWA',
      code: [
        'export function Animales() {',
        '  const { data, isPending } = useQuery({',
        "    queryKey: ['animales'],",
        '    queryFn: api.animales.listar,',
        '  });',
        '',
        '  if (isPending) return <Skeleton filas={6} />;',
        '  return data.map((a) => (',
        '    <TarjetaAnimal key={a.id} {...a} />',
        '  ));',
        '}'
      ]
    }
  ];

  var LEX = {
    py: /(#[^\n]*)|('[^'\n]*'|"[^"\n]*")|(@[\w.]+)|\b(def|class|return|if|else|elif|for|in|not|and|or|import|from|self|super|True|False|None|lambda|with|as)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g,
    jsx: /(\/\/[^\n]*)|('[^'\n]*'|"[^"\n]*")|(<\/?[A-Z][\w.]*)|\b(export|function|const|let|return|if|else|import|from|await|async|new|null|true|false)\b|\b(\d+)\b|\b([A-Za-z_]\w*)(?=\()/g
  };
  var CLS = { py: ['com', 'str', 'dec', 'kw', 'num', 'fn'], jsx: ['com', 'str', 'fn', 'kw', 'num', 'fn'] };

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function highlight(line, lang) {
    var re = LEX[lang];
    var out = '';
    var last = 0;
    var m;
    re.lastIndex = 0;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      for (var g = 1; g < m.length; g++) {
        if (m[g] !== undefined) {
          out += '<span class="tok-' + CLS[lang][g - 1] + '">' + esc(m[0]) + '</span>';
          break;
        }
      }
      last = re.lastIndex;
    }
    return out + esc(line.slice(last));
  }

  var codeBody = $('#code-body');
  var codeTabs = $$('.code-tabs [role="tab"]');
  var codeFoot = $('.code-foot-text');
  var currentSnippet = 0;

  function renderSnippet(i) {
    var s = SNIPPETS[i];
    currentSnippet = i;
    var html = s.code.map(function (line, n) {
      var delay = reducedMotion ? 0 : n * 0.06;
      var caret = n === s.code.length - 1 ? '<span class="caret" aria-hidden="true"></span>' : '';
      return '<span class="line typing" style="animation-delay:' + delay + 's">' + (highlight(line, s.lang) || ' ') + caret + '</span>';
    }).join('');
    codeBody.innerHTML = '<code>' + html + '</code>';
    codeBody.setAttribute('aria-labelledby', 'ct-' + i);
    codeFoot.textContent = s.foot;
    codeTabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
  }

  var autoCycle = null;
  function stopCycle() { clearInterval(autoCycle); autoCycle = null; }

  if (codeBody) {
    renderSnippet(0);
    codeTabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { stopCycle(); renderSnippet(i); });
      tab.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        stopCycle();
        var next = (i + dir + codeTabs.length) % codeTabs.length;
        renderSnippet(next);
        codeTabs[next].focus();
      });
    });
    if (!reducedMotion) {
      autoCycle = setInterval(function () {
        if (!document.hidden) renderSnippet((currentSnippet + 1) % SNIPPETS.length);
      }, 7000);
      codeWin.addEventListener('pointerenter', stopCycle);
      codeWin.addEventListener('focusin', stopCycle);
    }
  }

  /* ---------- Pestañas de experiencia ---------- */
  var expTabs = $$('.exp-tabs [role="tab"]');
  function selectExp(i, focus) {
    expTabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) {
      expTabs[i].focus();
      expTabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }
  expTabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectExp(i, false); });
    tab.addEventListener('keydown', function (e) {
      var keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      var n = expTabs.length;
      var next = null;
      if (e.key in keys) next = (i + keys[e.key] + n) % n;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      if (next === null) return;
      e.preventDefault();
      selectExp(next, true);
    });
  });

  /* ---------- Filtros de proyectos ---------- */
  var chips = $$('.filters .chip');
  var projects = $$('#projects-grid .project');
  var filterStatus = $('#filter-status');
  function applyFilter(f) {
    var shown = 0;
    projects.forEach(function (p) {
      var cats = (p.getAttribute('data-category') || '').split(' ');
      var match = f === 'all' || cats.indexOf(f) !== -1;
      var wasHidden = p.classList.contains('is-hidden');
      p.classList.toggle('is-hidden', !match);
      p.classList.toggle('featured', match && f === 'all' && p.hasAttribute('data-featured'));
      if (match) {
        shown++;
        p.classList.add('is-visible');
        if (wasHidden || f !== 'all') {
          p.classList.remove('is-entering');
          void p.offsetWidth;
          p.classList.add('is-entering');
        }
      }
    });
    chips.forEach(function (c) {
      var on = c.getAttribute('data-filter') === f;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    filterStatus.textContent = shown + (shown === 1 ? ' proyecto' : ' proyectos') + ' mostrados';
  }
  projects.forEach(function (p) { if (p.classList.contains('featured')) p.setAttribute('data-featured', ''); });
  chips.forEach(function (c) {
    c.addEventListener('click', function () { applyFilter(c.getAttribute('data-filter')); });
  });

  /* ---------- Actividad en GitHub (API pública) ---------- */
  var LANG_COLORS = {
    Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6', PHP: '#4F5D95',
    HTML: '#e34c26', CSS: '#563d7c', 'Jupyter Notebook': '#DA5B0B', Dart: '#00B4AB',
    Ruby: '#701516', Vue: '#41b883'
  };
  var EXCLUDE = /^(hidel21|github-slideshow|predictor-animalitos.*|FLUTTER-TEST|respository)$/i;

  function relTime(iso) {
    var diff = (new Date(iso) - Date.now()) / 1000;
    var units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    try {
      var rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
      for (var i = 0; i < units.length; i++) {
        if (Math.abs(diff) >= units[i][1] || i === units.length - 1) {
          return rtf.format(Math.round(diff / units[i][1]), units[i][0]);
        }
      }
    } catch (e) { /* Intl no disponible */ }
    return new Date(iso).toLocaleDateString('es');
  }

  function renderGitHub(repos) {
    var list = $('#gh-list');
    var own = repos.filter(function (r) { return !r.fork && !r.archived && !EXCLUDE.test(r.name); });

    var countEl = $('#repo-count');
    if (countEl && repos.length >= 50) countEl.setAttribute('data-count', repos.length);

    var recent = own.slice().sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); }).slice(0, 6);
    list.innerHTML = '';
    recent.forEach(function (r) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener';
      var name = document.createElement('span');
      name.className = 'gh-name';
      name.textContent = r.name;
      var meta = document.createElement('span');
      meta.className = 'gh-meta';
      if (r.language) {
        var lang = document.createElement('span');
        var dot = document.createElement('i');
        dot.style.background = LANG_COLORS[r.language] || 'var(--text-3)';
        lang.appendChild(dot);
        lang.appendChild(document.createTextNode(r.language));
        meta.appendChild(lang);
      }
      var when = document.createElement('span');
      when.textContent = 'Actualizado ' + relTime(r.pushed_at);
      meta.appendChild(when);
      a.appendChild(name);
      a.appendChild(meta);
      li.appendChild(a);
      list.appendChild(li);
    });

    // Distribución de lenguajes (por repositorio propio)
    var counts = {};
    own.forEach(function (r) { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
    var entries = Object.keys(counts).map(function (k) { return [k, counts[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; });
    var total = entries.reduce(function (s, e) { return s + e[1]; }, 0);
    if (!total) return;
    var top = entries.slice(0, 5);
    var rest = entries.slice(5).reduce(function (s, e) { return s + e[1]; }, 0);
    if (rest) top.push(['Otros', rest]);

    var bar = $('#lang-bar');
    var legend = $('#lang-legend');
    bar.innerHTML = '';
    legend.innerHTML = '';
    var label = [];
    top.forEach(function (e) {
      var pct = Math.round((e[1] / total) * 100);
      var color = LANG_COLORS[e[0]] || 'var(--text-3)';
      var seg = document.createElement('span');
      seg.style.flexGrow = e[1];
      seg.style.background = color;
      seg.title = e[0] + ' · ' + pct + '%';
      bar.appendChild(seg);
      var li = document.createElement('li');
      var dot = document.createElement('i');
      dot.style.background = color;
      var b = document.createElement('b');
      b.textContent = pct + '%';
      li.appendChild(dot);
      li.appendChild(document.createTextNode(e[0] + ' '));
      li.appendChild(b);
      legend.appendChild(li);
      label.push(e[0] + ' ' + pct + '%');
    });
    bar.setAttribute('aria-label', 'Lenguajes en repositorios propios: ' + label.join(', '));
    $('#gh-langs').hidden = false;
  }

  function loadGitHub() {
    var KEY = 'gh-repos-v1';
    try {
      var cached = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (cached && Date.now() - cached.t < 3600000) { renderGitHub(cached.d); return; }
    } catch (e) { /* sin caché */ }

    fetch('https://api.github.com/users/hidel21/repos?per_page=100&sort=pushed', {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var slim = data.map(function (r) {
          return { name: r.name, html_url: r.html_url, language: r.language, pushed_at: r.pushed_at, fork: r.fork, archived: r.archived };
        });
        try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: slim })); } catch (e) { /* ignorar */ }
        renderGitHub(slim);
      })
      .catch(function () {
        var list = $('#gh-list');
        list.innerHTML = '';
        var li = document.createElement('li');
        li.className = 'muted';
        li.textContent = 'No se pudo cargar la actividad en este momento. Puedes verla directamente en GitHub.';
        list.appendChild(li);
      });
  }

  var ghSection = $('#gh-activity');
  if (ghSection && 'IntersectionObserver' in window) {
    var ghObs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      ghObs.disconnect();
      loadGitHub();
    }, { rootMargin: '400px 0px' });
    ghObs.observe(ghSection);
  } else if (ghSection) {
    loadGitHub();
  }

  /* ---------- Copiar correo ---------- */
  function copyEmail() {
    var done = function () {
      toast('Correo copiado al portapapeles');
      var btn = $('#copy-email');
      if (btn) {
        btn.classList.add('is-copied');
        setTimeout(function () { btn.classList.remove('is-copied'); }, 1800);
      }
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(done, function () { toast(EMAIL); });
    } else {
      toast(EMAIL);
    }
  }
  var copyBtn = $('#copy-email');
  if (copyBtn) copyBtn.addEventListener('click', copyEmail);

  /* ---------- Formulario de contacto (mailto / WhatsApp) ---------- */
  var form = $('#contact-form');
  if (form) {
    var lastChannel = 'email';
    $$('[data-channel]', form).forEach(function (b) {
      b.addEventListener('click', function () { lastChannel = b.getAttribute('data-channel'); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var channel = (e.submitter && e.submitter.getAttribute('data-channel')) || lastChannel;
      var fName = form.elements.namedItem('name');
      var fMsg = form.elements.namedItem('message');
      var name = fName.value.trim();
      var topic = form.elements.namedItem('topic').value;
      var msg = fMsg.value.trim();
      var err = $('#cf-error');
      fName.setAttribute('aria-invalid', String(!name));
      fMsg.setAttribute('aria-invalid', String(!msg));
      if (!name || !msg) {
        err.hidden = false;
        (name ? fMsg : fName).focus();
        return;
      }
      err.hidden = true;
      if (channel === 'whatsapp') {
        var text = 'Hola Hidelberg, soy ' + name + '.\n*' + topic + '*\n\n' + msg;
        window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      } else {
        var subject = '[Portafolio] ' + topic + ' — ' + name;
        window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg + '\n\n— ' + name);
      }
      toast('Abriendo ' + (channel === 'whatsapp' ? 'WhatsApp' : 'tu correo') + '…');
    });
  }

  /* ---------- Paleta de comandos (Ctrl/⌘ + K) ---------- */
  var palette = $('#palette');
  var pInput = $('#palette-input');
  var pList = $('#palette-list');
  var go = function (hash) { return function () { var el = document.querySelector(hash); if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); }; };
  var open = function (url) { return function () { window.open(url, '_blank', 'noopener'); }; };
  var COMMANDS = [
    { label: 'Inicio', icon: 'i-arrow', hint: 'Sección', run: go('#top') },
    { label: 'Sobre mí', icon: 'i-arrow', hint: 'Sección', run: go('#sobre-mi') },
    { label: 'Servicios', icon: 'i-arrow', hint: 'Sección', run: go('#servicios') },
    { label: 'Experiencia', icon: 'i-arrow', hint: 'Sección', run: go('#experiencia') },
    { label: 'Proyectos', icon: 'i-arrow', hint: 'Sección', run: go('#proyectos') },
    { label: 'Proyectos de Odoo & ERP', icon: 'i-erp', hint: 'Filtro', run: function () { applyFilter('odoo'); go('#proyectos')(); } },
    { label: 'Stack y certificaciones', icon: 'i-arrow', hint: 'Sección', run: go('#stack') },
    { label: 'Contacto', icon: 'i-send', hint: 'Sección', run: go('#contacto') },
    { label: 'Descargar CV (PDF)', icon: 'i-download', hint: 'Acción', run: function () { var a = document.createElement('a'); a.href = CV_URL; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); } },
    { label: 'Copiar correo electrónico', icon: 'i-copy', hint: 'Acción', run: copyEmail },
    { label: 'Cambiar tema claro / oscuro', icon: 'i-sun', hint: 'Acción', run: toggleTheme },
    { label: 'Abrir GitHub', icon: 'i-github', hint: 'Enlace', run: open('https://github.com/hidel21') },
    { label: 'Abrir LinkedIn', icon: 'i-linkedin', hint: 'Enlace', run: open('https://www.linkedin.com/in/hidelberg-martinez-espitia/') },
    { label: 'Escribir por WhatsApp', icon: 'i-whatsapp', hint: 'Enlace', run: open('https://wa.me/' + WHATSAPP) },
    { label: 'Enviar correo', icon: 'i-mail', hint: 'Enlace', run: function () { window.location.href = 'mailto:' + EMAIL; } }
  ];
  var filtered = COMMANDS;
  var activeIdx = 0;

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function renderPalette() {
    var q = norm(pInput.value.trim());
    filtered = COMMANDS.filter(function (c) { return !q || norm(c.label + ' ' + c.hint).indexOf(q) !== -1; });
    activeIdx = Math.min(activeIdx, Math.max(filtered.length - 1, 0));
    pList.innerHTML = '';
    if (!filtered.length) {
      pList.innerHTML = '<li class="palette-empty" role="presentation">Sin resultados</li>';
      pInput.removeAttribute('aria-activedescendant');
      return;
    }
    filtered.forEach(function (c, i) {
      var li = document.createElement('li');
      li.id = 'cmd-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === activeIdx));
      li.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#' + c.icon + '"/></svg>';
      li.appendChild(document.createTextNode(c.label));
      var small = document.createElement('small');
      small.textContent = c.hint;
      li.appendChild(small);
      li.addEventListener('click', function () { runCommand(i); });
      li.addEventListener('pointermove', function () { if (activeIdx !== i) { activeIdx = i; updateActive(); } });
      pList.appendChild(li);
    });
    pInput.setAttribute('aria-activedescendant', 'cmd-' + activeIdx);
  }
  function updateActive() {
    $$('[role="option"]', pList).forEach(function (li, i) { li.setAttribute('aria-selected', String(i === activeIdx)); });
    var el = document.getElementById('cmd-' + activeIdx);
    if (el) { el.scrollIntoView({ block: 'nearest' }); pInput.setAttribute('aria-activedescendant', el.id); }
  }
  function runCommand(i) {
    var c = filtered[i];
    if (!c) return;
    closePalette();
    setTimeout(c.run, 10);
  }
  function openPalette() {
    if (!palette || palette.open) return;
    pInput.value = '';
    activeIdx = 0;
    renderPalette();
    if (typeof palette.showModal === 'function') palette.showModal(); else palette.setAttribute('open', '');
    pInput.focus();
  }
  function closePalette() {
    if (!palette) return;
    if (typeof palette.close === 'function') palette.close(); else palette.removeAttribute('open');
  }

  if (palette) {
    $$('[data-open-palette]').forEach(function (b) { b.addEventListener('click', openPalette); });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (palette.open) closePalette(); else openPalette();
      }
    });
    pInput.addEventListener('input', function () { activeIdx = 0; renderPalette(); });
    pInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % Math.max(filtered.length, 1); updateActive(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = (activeIdx - 1 + filtered.length) % Math.max(filtered.length, 1); updateActive(); }
      else if (e.key === 'Enter') { e.preventDefault(); runCommand(activeIdx); }
    });
    palette.addEventListener('click', function (e) { if (e.target === palette) closePalette(); });
  }

  /* ---------- Año ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
