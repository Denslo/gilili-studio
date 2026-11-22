/* Shared helpers for every page. API documented in docs/BIBLE.md §7. Needs strings.js loaded first. */
const PV = (() => {
  /* ---------- settings (localStorage is optional) ---------- */
  function load(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }
  const settings = { sound: load('pv-sound', true), speak: load('pv-speak', false), hebrew: load('pv-hebrew', true) };
  const lang = settings.hebrew ? 'he' : 'en';
  const he = lang === 'he';
  document.documentElement.lang = lang;
  document.documentElement.dir = he ? 'rtl' : 'ltr';

  /* ---------- text ---------- */
  function t(key, params = {}) {
    const s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
    return s.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
  }
  const eq = s => `<span class="eq">${s}</span>`;

  const EN_ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const HE_ONES = ['אפס', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר',
    'אחת־עשרה', 'שתים־עשרה', 'שלוש־עשרה', 'ארבע־עשרה', 'חמש־עשרה', 'שש־עשרה', 'שבע־עשרה', 'שמונה־עשרה', 'תשע־עשרה'];
  const HE_TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
  const HE_HUNDS = ['', 'מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשע מאות'];

  function wordEn(n) {
    if (n < 20) return EN_ONES[n];
    if (n < 100) return EN_TENS[Math.floor(n / 10)] + (n % 10 ? '-' + EN_ONES[n % 10] : '');
    const h = Math.floor(n / 100), r = n % 100;
    return EN_ONES[h] + ' hundred' + (r ? ' ' + wordEn(r) : '');
  }
  function wordHe(n) {
    if (n < 20) return HE_ONES[n];
    if (n < 100) return HE_TENS[Math.floor(n / 10)] + (n % 10 ? ' ו' + HE_ONES[n % 10] : '');
    const h = Math.floor(n / 100), r = n % 100;
    if (!r) return HE_HUNDS[h];
    return HE_HUNDS[h] + (r < 20 || r % 10 === 0 ? ' ו' : ' ') + wordHe(r);
  }
  const word = n => (he ? wordHe : wordEn)(n);

  /* "2 tens", "1 ten" / "2 עשרות", "עשרת אחת" */
  function units(k, unit) {
    if (he) {
      const [one, many] = { hundred: ['מאה אחת', 'מאות'], ten: ['עשרת אחת', 'עשרות'], one: ['יחידה אחת', 'יחידות'] }[unit];
      return k === 1 ? one : `${k} ${many}`;
    }
    return `${k} ${unit}${k === 1 ? '' : 's'}`;
  }
  /* join place-value parts: "A and B" / "A וB" (ו־ before a digit) */
  function and(parts) {
    if (!he) return parts.map(p => p.html).join(' and ');
    return parts.map((p, i) => i === 0 ? p.html : (/^\d/.test(p.text) ? ' ו־' : ' ו') + p.html).join('');
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = rand(0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

  /* ---------- sound effects ---------- */
  let ctx;
  /* `to` = glide the pitch to another frequency over the note (boings, whooshes) */
  function tone(freq, dur = .12, type = 'sine', when = 0, vol = .15, to = 0) {
    if (!settings.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const at = ctx.currentTime + when, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, at);
      if (to) o.frequency.exponentialRampToValueAtTime(to, at + dur);
      g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.001, at + dur);
      o.connect(g).connect(ctx.destination); o.start(at); o.stop(at + dur);
    } catch { /* no audio */ }
  }
  const sound = {
    pop: () => tone(700, .08, 'triangle'),
    bundle: () => [523, 659, 784].forEach((f, i) => tone(f, .18, 'triangle', i * .1)),
    good: () => [660, 880].forEach((f, i) => tone(f, .15, 'triangle', i * .1)),
    bad: () => tone(180, .25, 'sawtooth', 0, .06),
    win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .22, 'triangle', i * .12)),
    /* celebration flourishes (quiet, layered on top of good/win) */
    twinkle: () => [1320, 1760].forEach((f, i) => tone(f, .16, 'sine', .22 + i * .09, .06)),
    boom: (when = 0) => { tone(90, .45, 'sine', when, .22, 40); tone(900, .12, 'triangle', when, .05, 300); },
    boing: (when = 0) => tone(220, .22, 'triangle', when, .07, 660),
    gallop: (when = 0) => [0, .13, .22].forEach(d => tone(150, .07, 'triangle', when + d, .07, 110)),
    bubbles: (when = 0) => [0, .16, .3, .5].forEach((d, i) => tone(500 + i * 120, .14, 'sine', when + d, .05, 900 + i * 150)),
    bells: (when = 0) => [784, 988, 1175, 1568].forEach((f, i) => tone(f, .2, 'triangle', when + i * .1, .06)),
    whoosh: (when = 0) => tone(392, 1.1, 'sine', when + .1, .07, 1568),
  };

  /* ---------- speech (off by default) ---------- */
  function say(text) {
    if (!settings.speak || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/־/g, ' '));
    u.rate = .9; u.lang = he ? 'he-IL' : 'en-US';
    speechSynthesis.speak(u);
  }

  /* ---------- page setup: translate [data-i18n] and build the toggles ---------- */
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(e => {
      if (e.tagName === 'TITLE') e.textContent = t(e.dataset.i18n).replace(/&amp;/g, '&').replace(/<[^>]+>/g, '');
      else e.innerHTML = t(e.dataset.i18n);
    });
  }
  function initToggles() {
    document.querySelectorAll('[data-toggles]').forEach(box => {
      const mk = (key, label, title, onChange) => {
        const b = document.createElement('button');
        b.className = 'toggle' + (settings[key] ? ' on' : '') + (label.length > 2 ? ' wide' : '');
        b.textContent = label; b.title = t(title); b.setAttribute('aria-pressed', settings[key]);
        b.onclick = () => {
          settings[key] = !settings[key]; save('pv-' + key, settings[key]);
          b.classList.toggle('on', settings[key]); b.setAttribute('aria-pressed', settings[key]);
          onChange && onChange();
        };
        box.append(b);
      };
      mk('hebrew', 'עברית', 'tg_lang', () => location.reload());
      mk('sound', '🔔', 'tg_sound', () => sound.pop());
      mk('speak', '🗣️', 'tg_speak', () => settings.speak && say(t('speak_on')));
    });
  }

  /* ---------- big place-value display ---------- */
  function makeDisplay(container, { hundreds = false } = {}) {
    container.classList.add('pv');
    container.innerHTML = `
      <div class="pv-row">
        <div class="pv-box pv-h" ${hundreds ? '' : 'hidden'}><div class="pv-digit"></div><div class="pv-label">${t('lbl_hundreds')}</div></div>
        <div class="pv-box pv-t"><div class="pv-digit"></div><div class="pv-label">${t('lbl_tens')}</div></div>
        <div class="pv-box pv-o"><div class="pv-digit"></div><div class="pv-label">${t('lbl_ones')}</div></div>
      </div>
      <div class="pv-word"></div>`;
    const boxes = { h: container.querySelector('.pv-h'), t: container.querySelector('.pv-t'), o: container.querySelector('.pv-o') };
    const wordEl = container.querySelector('.pv-word');
    const last = {};
    const part = (k, unit, cls) => { const text = units(k, unit); return { text, html: `<span class="${cls}">${text}</span>` }; };

    function setBox(key, text, { zero = false, overflow = false } = {}) {
      const box = boxes[key];
      box.classList.toggle('zero', zero);
      box.classList.toggle('overflow', overflow);
      if (last[key] !== text) {
        box.querySelector('.pv-digit').textContent = text;
        box.classList.remove('changed'); void box.offsetWidth;
        if (last[key] !== undefined) box.classList.add('changed');
        last[key] = text;
      }
    }
    function show(n) {
      const h = Math.floor(n / 100), tn = Math.floor(n / 10) % 10, o = n % 10;
      if (hundreds) { boxes.h.hidden = false; setBox('h', String(h), { zero: h === 0 }); }
      setBox('t', String(tn), { zero: h === 0 && tn === 0 });
      setBox('o', String(o));
      const parts = [];
      if (h) parts.push(part(h, 'hundred', 'h'));
      parts.push(part(hundreds ? tn : Math.floor(n / 10), 'ten', 't'));
      parts.push(part(o, 'one', 'o'));
      wordEl.innerHTML = `<span class="w">${word(n)}</span> · ${and(parts)}`;
    }
    function showRaw(tens, ones) {
      setBox('t', String(tens), { zero: tens === 0 });
      setBox('o', String(ones), { overflow: ones > 9 });
      wordEl.innerHTML = t('too_many', {
        tens: `<span class="t">${units(tens, 'ten')}</span>`,
        ones: `<span class="o" style="color:var(--bad)">${units(ones, 'one')}</span>`,
      });
    }
    return { show, showRaw };
  }

  /* ---------- the bundling engine (sticks, blocks, ten frames, ten machine) ----------
     `buttons` may hold plain elements (locked while animating) or `{ el, k }` pairs: those are
     also dimmed when a jump of k would leave 0…max. `add(k)` chains k single steps (the slow
     crossing sequence runs in the middle of the jump), ±10 moves a whole bundle instead. */
  function exchange({ onesEl, tensEl, display, caption, makeOne, makeTen, groupClass = 'grouping',
    groupMs = 1000, max = 99, start = 0, onChange = () => {}, buttons = [], cheer = true, stepMs = 280 }) {
    let n = start, busy = false, crossings = 0;
    const tens = () => Math.floor(n / 10), ones = () => n % 10;
    const many = (k, f) => Array.from({ length: k }, f);
    const done = (e) => t('ex_done', { eq: e, tens: `<span class="t">${units(tens(), 'ten')}</span>`, ones: `<span class="o">${units(ones(), 'one')}</span>` });
    /* every crossing of a ten earns a small celebration, every 5th a big one */
    const crossed = () => cheer && celebrate(++crossings % 5 ? 'small' : 'big');
    const btns = buttons.filter(Boolean).map(b => b.nodeType ? { el: b, k: 0 } : b);
    const inRange = k => n + k >= 0 && n + k <= max;

    function setCaption(html, tone = '') {
      if (!caption) return;
      caption.innerHTML = html; caption.className = 'caption ' + tone;
      void caption.offsetWidth; caption.classList.add('bump');
    }
    function lock(v) {
      busy = v;
      btns.forEach(({ el, k }) => { el.disabled = v; el.classList.toggle('dim', !v && !!k && !inRange(k)); });
    }
    function show() { display.show(n); onChange(n); }
    function rebuild() {
      onesEl.replaceChildren(...many(ones(), makeOne));
      tensEl.replaceChildren(...many(tens(), makeTen));
      show(); lock(false);
    }

    /* one stick arrives. Returns true when it was the tenth one and the bundling sequence ran. */
    async function stepUp() {
      const one = makeOne(); one.classList.add('enter'); onesEl.append(one); sound.pop();
      if (ones() < 9) { n++; show(); return false; }
      display.showRaw(tens(), 10);
      setCaption(t('ex_ten_ones'), 'warn');
      say(t('say_ten_ones'));
      await wait(1400);
      onesEl.classList.add(groupClass); sound.bundle();
      setCaption(t('ex_make_ten'));
      await wait(groupMs);
      onesEl.classList.remove(groupClass); onesEl.replaceChildren();
      const ten = makeTen(); ten.classList.add('arrive'); tensEl.append(ten);
      n++; show();
      return true;
    }
    /* one stick leaves. Returns true when a ten had to be opened first. */
    async function stepDown(quick) {
      let opened = false;
      if (ones() === 0) {
        opened = true;
        setCaption(t('ex_open'), 'warn');
        await wait(1200);
        const ten = tensEl.lastElementChild; ten.classList.add('depart');
        await wait(500); ten.remove();
        onesEl.classList.add(groupClass);
        onesEl.replaceChildren(...many(10, makeOne));
        display.showRaw(tens() - 1, 10); sound.bundle();
        void onesEl.offsetWidth;
        await wait(80);
        onesEl.classList.remove(groupClass);
        setCaption(t('ex_opened'));
        await wait(1500);
      }
      const last = onesEl.lastElementChild; last.classList.add('leave'); sound.pop();
      await wait(quick && !opened ? 220 : 300); last.remove();
      n--; show();
      return opened;
    }

    /* add k sticks (k < 0 takes away). Sticks come one after another; ±10 moves a whole bundle. */
    async function add(k) {
      if (busy || !k) return;
      const was = n, K = Math.abs(k), up = k > 0, sign = up ? '+' : '−';
      if (!inRange(k)) {
        sound.bad();
        if (K === 1) setCaption(t(up ? 'ex_max' : 'ex_zero', { max }), 'warn');
        else setCaption(t(up ? 'ex_over' : 'ex_under', { n: was, k: K, max }), 'warn');
        return;
      }
      lock(true);
      const equation = `${was} ${sign} ${K}`, final = eq(`${equation} = <b>%</b>`);
      let crossedAny = false;
      if (K === 10) {
        if (up) { const ten = makeTen(); ten.classList.add('enter'); tensEl.append(ten); sound.bundle(); n += 10; show(); sparkle(ten, 6); }
        else { const ten = tensEl.lastElementChild; ten.classList.add('leave'); sound.pop(); await wait(300); ten.remove(); n -= 10; show(); }
        setCaption(done(final.replace('%', n)), 'good');
        await wait(600);
      } else {
        if (K > 1) setCaption(eq(`${equation} = ?`));
        for (let i = 0; i < K; i++) {
          const c = up ? await stepUp() : await stepDown(K > 1);
          crossedAny = crossedAny || c;
          const last = i === K - 1;
          if (last) setCaption(crossedAny ? done(final.replace('%', n)) : final.replace('%', n), crossedAny ? 'good' : '');
          else if (c) setCaption(eq(`${equation} = ?`));
          if (K === 1 && !c) say(word(n));
          await wait(last ? (c ? 700 : up ? 250 : 0) : (c ? 450 : stepMs));
        }
      }
      if (K === 1) { if (crossedAny) say(t(up ? 'say_plus1' : 'say_minus1', { a: word(was), b: word(n) })); }
      else say(t(up ? 'say_plus' : 'say_minus', { a: word(was), k: word(K), b: word(n) }));
      if (crossedAny) crossed();
      lock(false);
    }
    const plus = () => add(1), minus = () => add(-1);

    function set(k) {
      if (busy) return;
      n = Math.max(0, Math.min(max, k)); rebuild();
      setCaption(t('ex_set', { n }));
    }

    rebuild();
    return { plus, minus, add, set, get value() { return n; }, setCaption };
  }

  /* ---------- small UI helpers ---------- */
  function edgeChips(el, onPick, { up = [9, 19, 29, 39, 49, 59, 69, 79, 89], down = [10, 20, 30, 40, 50, 60, 70, 80, 90] } = {}) {
    const mk = (label, nums) => {
      const row = document.createElement('div'); row.className = 'chips';
      row.innerHTML = `<span class="label">${label}</span>`;
      nums.forEach(k => {
        const c = document.createElement('button'); c.className = 'chip'; c.textContent = k;
        c.onclick = () => onPick(k); row.append(c);
      });
      el.append(row);
    };
    mk(t('edge_up'), up);
    mk(t('edge_down'), down);
  }

  function bindKeys({ plus, minus }) {
    document.addEventListener('keydown', e => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') { e.preventDefault(); plus(); }
      if (e.key === 'ArrowLeft' || e.key === '-') { e.preventDefault(); minus(); }
    });
  }

  /* ---------- celebrations ----------
     Everything draws into one fixed, pointer-events:none, overflow:hidden layer (.fx) that is
     removed when the last effect finishes. Canvas for particles (confetti, fireworks), the Web
     Animations API on emoji / inline-SVG "riders" for the parades. Transform + opacity only. */
  const COLORS = ['#2f6fdb', '#f08a24', '#2a9d5b', '#e04848', '#8e44ad', '#f5c400'];
  const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
  const canWAAPI = !!(window.Element && Element.prototype.animate);
  const vp = () => ({ w: document.documentElement.clientWidth || innerWidth, h: innerHeight });
  let fxLayer = null, fxLive = 0;
  function fxBegin() {
    if (!fxLayer) { fxLayer = document.createElement('div'); fxLayer.className = 'fx'; fxLayer.setAttribute('aria-hidden', 'true'); document.body.append(fxLayer); }
    fxLive++; return fxLayer;
  }
  function fxEnd(node) {
    node && node.remove();
    if (--fxLive <= 0 && fxLayer) { fxLayer.remove(); fxLayer = null; fxLive = 0; }
  }

  /* run draw(g, t, dt, w, h) every frame on a fresh canvas until it returns false or ms passes */
  function canvasFx(draw, ms) {
    const box = fxBegin(), { w, h } = vp(), dpr = Math.min(devicePixelRatio || 1, 2);
    const c = document.createElement('canvas'); c.className = 'fx-canvas';
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); box.append(c);
    const g = c.getContext('2d'); g.scale(dpr, dpr);
    return new Promise(res => {
      const t0 = performance.now(); let last = t0;
      const frame = now => {
        const dt = Math.min((now - last) / 1000, .05); last = now;
        const t = (now - t0) / 1000;
        g.clearRect(0, 0, w, h);
        g.globalAlpha = Math.max(0, Math.min(1, (ms / 1000 - t) / .5));   // fade out at the end
        const alive = draw(g, t, dt, w, h);
        if (alive && now - t0 < ms) requestAnimationFrame(frame); else { fxEnd(c); res(); }
      };
      requestAnimationFrame(frame);
    });
  }

  /* Character effects are slow enough to enjoy: a parade takes CHAR_MS to cross (big ≈ 6.5 s,
     small ≈ 3 s), and characters are staggered so they come one after another. */
  const CHAR_MS = big => big ? 6500 : 3000;
  /* every running WAAPI character animation; a new celebration cancels them (they never pile up) */
  const live = new Set();
  function track(a, onDone) {
    live.add(a);
    const done = () => { live.delete(a); onDone(); };
    a.onfinish = done; a.oncancel = done;
    return a;
  }
  function fxClear() { [...live].forEach(a => a.cancel()); }

  /* a DOM "rider" (emoji or SVG) animated along precomputed keyframes with the Web Animations API */
  function ride(html, frames, ms, { cls = '', delay = 0, size = 56, easing = 'linear' } = {}) {
    const box = fxBegin();
    const el = document.createElement('div'); el.className = 'fx-rider ' + cls; el.style.fontSize = size + 'px';
    el.innerHTML = html; el.style.transform = frames[0].transform; el.style.opacity = 0; box.append(el);
    return new Promise(res => {
      const finish = () => { fxEnd(el); res(); };
      if (!canWAAPI) { setTimeout(finish, ms + delay); return; }
      track(el.animate(frames, { duration: ms, delay, easing, fill: 'forwards' }), finish);
    });
  }
  /* sample a path function p(t) -> {x, y, r, sx, sy, o} into WAAPI keyframes */
  function samplePath(p, steps = 48) {
    return Array.from({ length: steps + 1 }, (_, i) => {
      const k = p(i / steps);
      return { transform: `translate(${k.x.toFixed(1)}px, ${k.y.toFixed(1)}px) rotate(${(k.r || 0).toFixed(1)}deg) scale(${(k.sx ?? 1).toFixed(3)}, ${(k.sy ?? 1).toFixed(3)})`, opacity: k.o ?? 1 };
    });
  }
  /* a small thing that pops in, drifts and fades (sparkle trails, bubbles, clouds) */
  function puff(html, x, y, { dx = 0, dy = -40, ms = 700, size = 20, cls = 'fx-spark', hold = false } = {}) {
    const box = fxBegin();
    const s = document.createElement('div'); s.className = cls; s.innerHTML = html; s.style.fontSize = size + 'px';
    s.style.transform = `translate(${x}px, ${y}px) scale(.3)`; s.style.opacity = 0; box.append(s);
    const frames = hold
      ? [{ transform: `translate(${x}px, ${y}px) scale(.3)`, opacity: 0 }, { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1, offset: .15 },
        { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1, offset: .85 }, { transform: `translate(${x}px, ${y}px) scale(.8)`, opacity: 0 }]
      : [{ transform: `translate(${x}px, ${y}px) scale(.3)`, opacity: 1 }, { transform: `translate(${x + dx * .6}px, ${y + dy * .6}px) scale(1)`, opacity: 1, offset: .4 },
        { transform: `translate(${x + dx}px, ${y + dy}px) scale(.6)`, opacity: 0 }];
    if (canWAAPI) {
      const a = s.animate(frames, { duration: ms, easing: 'ease-out', fill: 'forwards' });
      if (hold) track(a, () => fxEnd(s)); else a.onfinish = () => fxEnd(s);   // only held puffs (clouds) are replaced with their rider
    } else setTimeout(() => fxEnd(s), ms);
  }
  /* call fn(cx, cy) every `every` ms with a rider's centre while it is on screen */
  function follow(el, every, fn, ms) {
    const id = setInterval(() => {
      if (!el.isConnected) return clearInterval(id);
      const r = el.getBoundingClientRect(); if (r.width) fn(r.left + r.width / 2, r.top + r.height / 2);
    }, every);
    setTimeout(() => clearInterval(id), ms);
  }
  /* riders are added to the layer synchronously by ride(); the last one is the one just made */
  const lastRider = () => fxLayer && fxLayer.querySelector('.fx-rider:last-of-type');
  const across = (dir, w, size) => dir > 0 ? { from: -size * 1.6, to: w + size * .6 } : { from: w + size * .6, to: -size * 1.6 };

  /* --- confetti: fluttering paper from the top --- */
  function confetti(count = 80, ms = 3500) {
    const { w } = vp();
    const ps = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w, y: -20 - Math.random() * 100, vx: (Math.random() - .5) * 80, vy: 60 + Math.random() * 120,
      w: 6 + Math.random() * 6, h: 10 + Math.random() * 8, rot: Math.random() * 6.28, vr: (Math.random() - .5) * 10,
      ph: Math.random() * 6.28, color: COLORS[i % COLORS.length], delay: Math.random() * (ms / 1000) * .25,
    }));
    return canvasFx((g, t, dt, W, H) => {
      let alive = false;
      for (const p of ps) {
        if (t < p.delay) { alive = true; continue; }
        p.vy = Math.min(p.vy + 300 * dt, 240);
        p.x += (p.vx + Math.sin(p.ph + t * 3) * 50) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.y > H + 20) continue;
        alive = true;
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(1, Math.cos(p.ph + t * 6));
        g.fillStyle = p.color; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore();
      }
      return alive;
    }, ms);
  }

  /* --- fireworks: rockets rise, burst into sparks with gravity and trails --- */
  function fireworks(bursts = 5, ms = 3600) {
    const { w, h } = vp(), parts = [];
    const rockets = Array.from({ length: bursts }, (_, i) => ({
      at: i * Math.max(0, ms / 1000 - 1.6) / bursts, x: w * (.15 + Math.random() * .7), y: h + 10,
      ty: h * (.12 + Math.random() * .35), color: COLORS[rand(0, COLORS.length - 1)], done: false,
    }));
    const explode = r => {
      const n = 36 + rand(0, 16), c2 = COLORS[rand(0, COLORS.length - 1)];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 6.283 + Math.random() * .2, sp = 120 + Math.random() * 160;
        parts.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color: i % 3 ? r.color : c2, r: 3 + Math.random() * 2.5 });
      }
      sound.boom();
    };
    return canvasFx((g, t, dt, W, H) => {
      let alive = false;
      const fade = g.globalAlpha;
      for (const r of rockets) {
        if (r.done) continue;
        alive = true;
        if (t < r.at) continue;
        r.y -= H * 1.3 * dt;
        g.fillStyle = '#fff'; g.beginPath(); g.arc(r.x, r.y, 3, 0, 7); g.fill();
        g.strokeStyle = r.color; g.lineWidth = 2; g.beginPath(); g.moveTo(r.x, r.y); g.lineTo(r.x, r.y + 26); g.stroke();
        if (r.y <= r.ty) { r.done = true; explode(r); }
      }
      g.lineCap = 'round';
      for (const p of parts) {
        if (p.life <= 0) continue;
        alive = true;
        p.vy += 180 * dt; p.vx *= (1 - 1.6 * dt); p.vy *= (1 - 1.6 * dt);
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt / 1.4;
        g.globalAlpha = Math.max(0, p.life) * fade;
        g.strokeStyle = p.color; g.lineWidth = p.r;
        g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * .05, p.y - p.vy * .05); g.stroke();
      }
      return alive;
    }, ms);
  }

  /* --- rainbow: seven arcs draw in across the screen, a cloud at each end --- */
  function rainbow(big = true) {
    const ms = CHAR_MS(big), box = fxBegin(), { w, h } = vp();
    const R = big ? Math.min(w * .38, h * .46) : Math.min(w * .28, h * .28);
    const cx = w / 2, cy = big ? h * .8 : h * .42, band = Math.max(5, R * .045);
    const bands = ['#e04848', '#f08a24', '#f5c400', '#2a9d5b', '#2f6fdb', '#5b3fd6', '#8e44ad'];
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fx-svg'); svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.style.opacity = .62; box.append(svg);
    bands.forEach((col, i) => {
      const r = R - i * band, p = document.createElementNS(NS, 'path');
      p.setAttribute('d', `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`);
      p.setAttribute('fill', 'none'); p.setAttribute('stroke', col); p.setAttribute('stroke-width', band + .6); p.setAttribute('stroke-linecap', 'round');
      svg.append(p);
      const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      if (canWAAPI) p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: big ? 2400 : 1400, delay: i * 140, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
      else p.style.strokeDashoffset = 0;
    });
    const cs = big ? 48 : 34;
    [-1, 1].forEach(side => puff('☁️', cx + side * (R - band * 3) - cs / 2, cy - cs * .7, { ms: ms - 150, size: cs, hold: true }));
    if (big) sound.whoosh();
    return new Promise(res => {
      const bye = () => { fxEnd(svg); res(); };
      if (canWAAPI) track(svg.animate([{ opacity: .62 }, { opacity: 0 }], { duration: 700, delay: ms - 700, fill: 'forwards' }), bye);
      else setTimeout(bye, ms);
    });
  }

  /* --- a rolling wave along the bottom (mermaids, ships) --- */
  function wave(ms, dir = 1) {
    const box = fxBegin(), el = document.createElement('div'); el.className = 'fx-wave'; box.append(el);
    const kf = [{ transform: 'translate(0, 40px)', opacity: 0 }, { transform: `translate(${60 * dir}px, 0)`, opacity: 1, offset: .2 },
      { transform: `translate(${140 * dir}px, 0)`, opacity: 1, offset: .8 }, { transform: `translate(${200 * dir}px, 40px)`, opacity: 0 }];
    if (canWAAPI) track(el.animate(kf, { duration: ms, fill: 'forwards' }), () => fxEnd(el));
    else setTimeout(() => fxEnd(el), ms);
  }

  /* --- parades: emoji / SVG riders crossing the screen --- */
  const GLIDE = 'cubic-bezier(.3, 0, .7, 1)';     // gentle start and stop for a crossing
  function unicorns(big) {
    const n = big ? 2 : 1, ms = CHAR_MS(big), gap = 1400, { w, h } = vp();
    sound.gallop(.1); if (big) sound.gallop(1.6);
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 64 : 56, y0 = h * (.18 + Math.random() * .45), { from, to } = across(-1, w, size), hops = 8;
      const p = ride('🦄', samplePath(t => ({
        x: from + (to - from) * t, y: y0 - 26 * Math.abs(Math.sin(t * Math.PI * hops)), r: -6 * Math.sin(t * Math.PI * 2 * hops), sy: 1 - .08 * Math.cos(t * Math.PI * 2 * hops),
      }), 96), ms - (n - 1) * gap, { delay: i * gap, size, easing: GLIDE });
      const el = lastRider();
      el && follow(el, 150, (x, y) => puff(['✨', '⭐', '💖'][rand(0, 2)], x + 18, y - 10, { dx: 20 + Math.random() * 30, dy: -20 + Math.random() * 50, ms: 900, size: 16 + rand(0, 8) }), ms);
      return p;
    }));
  }
  function bunnies(big) {
    const n = big ? 3 : 1, ms = CHAR_MS(big), gap = 1100, { w, h } = vp();
    [0, .45, .9].forEach(d => sound.boing(d));
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 58 : 52, dir = i % 2 ? -1 : 1, y0 = h * (.62 + Math.random() * .28) - size, { from, to } = across(dir, w, size), hops = 7;
      return ride('🐰', samplePath(t => {
        const ph = t * Math.PI * hops, up = Math.abs(Math.sin(ph)), ground = Math.pow(1 - up, 6);
        return { x: from + (to - from) * t, y: y0 - 60 * up, r: dir * -10 * Math.sin(ph * 2), sx: 1 + .14 * ground, sy: 1 - .18 * ground + .08 * up };
      }, 96), ms - (n - 1) * gap, { delay: i * gap, size, easing: GLIDE });
    }));
  }
  function mermaids(big) {
    const n = big ? 2 : 1, ms = CHAR_MS(big), gap = 1600, { w, h } = vp();
    sound.bubbles(.1); wave(ms, -1);
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 64 : 56, dir = i % 2 ? -1 : 1, y0 = h * (.45 + i * .18), { from, to } = across(dir, w, size);
      const p = ride('🧜‍♀️', samplePath(t => ({
        x: from + (to - from) * t, y: y0 + 22 * Math.sin(t * Math.PI * 4), r: 12 * Math.cos(t * Math.PI * 4) * dir, sx: dir,
      }), 96), ms - (n - 1) * gap, { delay: i * gap, size, easing: GLIDE });
      const el = lastRider();
      el && follow(el, 220, (x, y) => puff('', x - 10 + rand(-14, 14), y + 10, { dx: rand(-10, 10), dy: -70 - rand(0, 50), ms: 1500, size: 8 + rand(0, 10), cls: 'fx-bub' }), ms);
      return p;
    }));
  }
  /* an original little blue forest elf: leaf hat with an acorn, acorn-brown tunic, green leggings */
  const ELF = `<svg viewBox="0 0 60 84" width="1em" height="1.4em" style="overflow:visible">
    <rect x="20" y="56" width="8" height="20" rx="4" fill="#3b7a3e"/><rect x="32" y="56" width="8" height="20" rx="4" fill="#3b7a3e"/>
    <ellipse cx="23" cy="78" rx="7" ry="4" fill="#6b4423"/><ellipse cx="37" cy="78" rx="7" ry="4" fill="#6b4423"/>
    <path d="M18 42 Q30 36 42 42 L44 62 Q30 68 16 62 Z" fill="#a8722f"/><path d="M22 50 L38 50" stroke="#6b4423" stroke-width="2"/>
    <path d="M18 46 Q8 40 10 30" stroke="#8ec5ff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M42 46 Q52 40 50 30" stroke="#8ec5ff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M15 28 L5 21 L16 34 Z" fill="#8ec5ff"/><path d="M45 28 L55 21 L44 34 Z" fill="#8ec5ff"/>
    <circle cx="30" cy="30" r="15" fill="#8ec5ff"/>
    <circle cx="24" cy="29" r="2.6" fill="#2b2a33"/><circle cx="36" cy="29" r="2.6" fill="#2b2a33"/>
    <circle cx="25" cy="28" r=".9" fill="#fff"/><circle cx="37" cy="28" r=".9" fill="#fff"/>
    <circle cx="21" cy="35" r="2.2" fill="#ffb3c1" opacity=".85"/><circle cx="39" cy="35" r="2.2" fill="#ffb3c1" opacity=".85"/>
    <path d="M25 37 Q30 42 35 37" stroke="#2b2a33" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M13 21 Q30 -4 48 13 Q40 23 30 17 Q21 25 13 21 Z" fill="#4caf50"/><path d="M30 17 Q36 7 46 12" stroke="#2e7d32" stroke-width="1.5" fill="none"/>
    <ellipse cx="48" cy="12" rx="4" ry="5" fill="#a8722f"/><path d="M44 10 Q48 5 52 10 Z" fill="#6b4423"/>
  </svg>`;
  function elves(big) {
    const n = big ? 3 : 1, ms = CHAR_MS(big), gap = 700, { w, h } = vp();
    sound.bells(.1); if (big) sound.bells(2.4);
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 70 : 58, y0 = h - size * 1.6 - 10, { from, to } = across(1, w, size), beats = 9;
      return ride(ELF, samplePath(t => {
        const ph = t * Math.PI * beats, up = Math.abs(Math.sin(ph));
        return { x: from + (to - from) * t, y: y0 - 22 * up, r: 9 * Math.sin(ph), sx: Math.cos(ph / 2) >= 0 ? 1 : -1, sy: 1 - .1 * Math.pow(1 - up, 4) };
      }, 96), ms - (n - 1) * gap, { delay: i * gap, size, easing: GLIDE });
    }));
  }
  /* forest friends: fox, hedgehog, deer, squirrel and owl friends trot across one after another */
  function animals(big) {
    const picks = shuffle(['🦊', '🦔', '🦌', '🐿️', '🦉']).slice(0, big ? 3 : 1), ms = CHAR_MS(big), gap = 800, { w, h } = vp();
    [0, .5].forEach(d => sound.gallop(d));
    return Promise.all(picks.map((em, i) => {
      const size = big ? 56 : 50, y0 = h - size * 1.5 - 6 - (i % 2) * 16, { from, to } = across(-1, w, size), steps = 10;
      return ride(em, samplePath(t => {
        const ph = t * Math.PI * steps;
        return { x: from + (to - from) * t, y: y0 - 14 * Math.abs(Math.sin(ph)), r: -5 * Math.sin(ph * 2), sy: 1 - .06 * Math.cos(ph * 2) };
      }, 96), ms - (picks.length - 1) * gap, { delay: i * gap, size, easing: GLIDE });
    }));
  }
  /* flowers grow up from the bottom edge and open (inline SVG) */
  const FLOWER = col => `<svg viewBox="0 0 40 90" width="1em" height="2.25em" style="overflow:visible">
    <path d="M20 90 Q22 60 20 34" stroke="#2a9d5b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M20 64 Q8 60 6 50 Q18 50 20 64 Z" fill="#2a9d5b"/><path d="M20 72 Q32 68 34 58 Q22 58 20 72 Z" fill="#2a9d5b"/>
    <g class="fx-bloom">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="20" cy="18" rx="7" ry="13" fill="${col}" transform="rotate(${a} 20 30)"/>`).join('')}
      <circle cx="20" cy="30" r="7" fill="#f5c400"/><circle cx="18" cy="28" r="2" fill="#fff" opacity=".7"/></g></svg>`;
  function flowers(big) {
    const n = big ? 5 : 3, ms = CHAR_MS(big), gap = big ? 350 : 250, { w, h } = vp();
    const cols = ['#e04848', '#f08a24', '#8e44ad', '#ff7eb6', '#2f6fdb'];
    sound.bells(.2);
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 60 : 46, x = (i + .5) / n * w - size / 2 + rand(-10, 10), up = size * 2.25;
      return ride(FLOWER(cols[i % cols.length]), samplePath(t => {
        const g = Math.min(1, t * 1.6), grow = 1 - Math.pow(1 - g, 3);
        return { x, y: h + 4 - up * grow, r: 4 * Math.sin(t * Math.PI * 5 + i), o: t > .88 ? 1 - (t - .88) / .12 : 1 };
      }, 96), ms - (n - 1) * gap, { delay: i * gap, size, cls: 'fx-flower' });
    }));
  }
  /* sailing ships cross on a rolling wave */
  function ships(big) {
    const n = big ? 2 : 1, ms = CHAR_MS(big), gap = 1500, { w, h } = vp();
    sound.bubbles(0); wave(ms, 1);
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 64 : 56, y0 = h - size * 1.9 - i * 10, { from, to } = across(1, w, size);
      return ride('⛵', samplePath(t => ({ x: from + (to - from) * t, y: y0 + 10 * Math.sin(t * Math.PI * 7 + i), r: 8 * Math.cos(t * Math.PI * 7 + i) }), 96), ms - (n - 1) * gap, { delay: i * gap, size, easing: GLIDE });
    }));
  }
  /* butterflies flutter upwards in loops (wings = scaleX) */
  function butterflies(big) {
    const n = big ? 4 : 2, ms = CHAR_MS(big), gap = big ? 500 : 350, { w, h } = vp();
    sound.twinkle();
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 44 : 38, x0 = w * (.1 + Math.random() * .8), drift = (Math.random() - .5) * w * .4, ph0 = Math.random() * 6;
      return ride('🦋', samplePath(t => ({
        x: x0 + drift * t + 40 * Math.sin(t * Math.PI * 3 + ph0), y: h + size - (h + size * 2) * t, r: 20 * Math.sin(t * Math.PI * 6 + ph0), sx: .55 + .45 * Math.abs(Math.cos(t * Math.PI * 22)),
      }), 120), ms - (n - 1) * gap, { delay: i * gap, size });
    }));
  }
  /* balloons in the design colors float up, swaying on their strings */
  const BALLOON = col => `<svg viewBox="0 0 40 80" width="1em" height="2em" style="overflow:visible">
    <path d="M20 52 Q24 60 18 70 Q24 76 20 80" stroke="#6b6878" stroke-width="1.5" fill="none"/><path d="M16 50 L24 50 L20 56 Z" fill="${col}"/>
    <ellipse cx="20" cy="27" rx="17" ry="22" fill="${col}"/><ellipse cx="13" cy="18" rx="4" ry="7" fill="#fff" opacity=".45" transform="rotate(-20 13 18)"/></svg>`;
  function balloons(big) {
    const n = big ? 5 : 3, ms = CHAR_MS(big), gap = big ? 450 : 300, { w, h } = vp();
    sound.boing(0); sound.boing(.5);
    return Promise.all(Array.from({ length: n }, (_, i) => {
      const size = big ? 52 : 44, x0 = w * ((i + .5) / n) - size / 2 + rand(-16, 16), ph0 = Math.random() * 6;
      return ride(BALLOON(COLORS[i % COLORS.length]), samplePath(t => {
        const e = t * t * (3 - 2 * t);
        return { x: x0 + 18 * Math.sin(t * Math.PI * 3 + ph0), y: h + size * 2 - (h + size * 4) * e, r: 8 * Math.sin(t * Math.PI * 3 + ph0) };
      }, 96), ms - (n - 1) * gap, { delay: i * gap, size });
    }));
  }
  /* star burst from a point; `gentle` only fades in and out (the reduced-motion fallback) */
  function stars(big, cx, cy, gentle = false) {
    const { w, h } = vp();
    cx = cx ?? w / 2; cy = cy ?? h * .35;
    const n = big ? 18 : 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + Math.random() * .4, d = gentle ? 0 : (big ? 90 : 60) + Math.random() * 60;
      const ox = gentle ? (Math.random() - .5) * Math.min(w * .6, 300) : 0, oy = gentle ? (Math.random() - .5) * 120 : 0;
      puff(['✨', '⭐', '🌟', '💫'][i % 4], cx + ox - 11, cy + oy - 11, { dx: Math.cos(a) * d, dy: Math.sin(a) * d - 20, ms: gentle ? 1400 : 900 + rand(0, 300), size: 18 + rand(0, 10), hold: gentle });
    }
    return wait(gentle ? 1400 : 1200);
  }

  /* burst little stars from an element (a matched card, a correct button) */
  function sparkle(el, n = 8) {
    if (!el || !el.getBoundingClientRect) return;
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (reduced()) return stars(false, cx, cy, true);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + Math.random() * .5, d = Math.max(r.width, r.height) * .5 + 20 + Math.random() * 30;
      puff(['✨', '⭐', '💫'][i % 3], cx - 10 + Math.cos(a) * r.width * .25, cy - 10 + Math.sin(a) * r.height * .25,
        { dx: Math.cos(a) * d, dy: Math.sin(a) * d - 10, ms: 650 + rand(0, 250), size: 16 + rand(0, 8) });
    }
  }

  const EFFECTS = {
    confetti: big => confetti(big ? 140 : 45, big ? 3600 : 1700), fireworks: big => fireworks(big ? 5 : 1, big ? 3600 : 1700),
    rainbow, unicorns, bunnies, mermaids, elves, animals, flowers, ships, butterflies, balloons, stars: big => stars(big),
  };
  let lastPick = [], gen = 0;
  /* level: 'small' (one right answer, a crossing, a pair) ≈3 s; 'big' (game done, every 5th point) ≈6.5–8 s.
     Picks randomly; big combines 1–2 effects (a second one joins 1.2 s later); never repeats the
     previous pick. A new celebration replaces the characters still on screen, so they never pile up.
     Returns a Promise. */
  function celebrate(level = 'small', { sound: withSound = true, only = null } = {}) {
    const big = level === 'big', my = ++gen;
    if (withSound) big ? sound.win() : sound.twinkle();
    // let the characters finish: a small win during a running parade only adds a star burst; a big win replaces it
    if (!big && live.size) return stars(false);
    fxClear();
    if (reduced()) return stars(big, undefined, undefined, true);
    const names = Object.keys(EFFECTS).filter(k => k !== 'stars' && !lastPick.includes(k));
    const k = big ? (Math.random() < .45 ? 1 : 2) : 1;
    const picks = only ? only.filter(n => EFFECTS[n]) : shuffle(names).slice(0, k);   // only: ['unicorns', …] forces effects (testing)
    if (!only && !big && Math.random() < .3) picks.push('stars');
    lastPick = picks;
    return Promise.all(picks.map((name, i) => wait(i * (big ? 1200 : 0)).then(() => my === gen ? EFFECTS[name](big) : undefined))).then(() => undefined);
  }

  // common.js is loaded at the end of <body>, so the page markup above already exists.
  applyI18n();
  initToggles();

  return { lang, t, eq, word, units, wait, rand, shuffle, sound, say, makeDisplay, exchange, edgeChips, bindKeys, confetti, celebrate, sparkle, effects: Object.keys(EFFECTS), settings };
})();
