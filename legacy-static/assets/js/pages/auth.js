/* ============================================================
   METRA — authentication page
   ============================================================ */
(function () {
  const { watchSVG, byId } = window.METRA;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const visual = $('[data-auth-watch]');
  if (visual) visual.innerHTML = watchSVG(byId('azure-moonphase'));

  const titles = {
    login: { t: 'Welcome back.', s: 'Sign in to follow your orders, saved pieces and private editions.' },
    register: { t: 'Join the maison.', s: 'Create an account to save timepieces, track orders and access private editions.' }
  };

  function showTab(name) {
    $$('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    $$('[data-form]').forEach(f => { f.style.display = f.dataset.form === name ? '' : 'none'; });
    const info = titles[name];
    $('[data-auth-title]').textContent = info.t;
    $('[data-auth-sub]').textContent = info.s;
    const msg = $('[data-auth-msg]');
    msg.className = 'form-msg';
    msg.textContent = '';
    try { history.replaceState(null, '', name === 'register' ? '?tab=register' : location.pathname); } catch (e) {}
  }

  $$('[data-tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  $$('[data-switch]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.switch)));

  if (new URLSearchParams(location.search).get('tab') === 'register') showTab('register');

  /* password visibility */
  $$('[data-toggle-pw]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
    });
  });

  /* strength meter */
  const pw = $('[data-pw]');
  const meter = $('[data-pw-meter]');
  if (pw && meter) {
    pw.addEventListener('input', () => {
      const v = pw.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      meter.setAttribute('data-level', String(score));
    });
  }

  function validate(form) {
    let ok = true;
    form.querySelectorAll('[data-required]').forEach(el => {
      const field = el.closest('.field');
      let bad = !(el.value || '').trim();
      if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
      if (!bad && el.hasAttribute('data-pw')) bad = el.value.length < 8;
      if (field) field.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });

    const confirm = form.querySelector('[data-confirm]');
    if (confirm) {
      const pass = form.querySelector('[data-pw]');
      const bad = confirm.value !== pass.value || !confirm.value;
      const field = confirm.closest('.field');
      if (field) field.classList.toggle('invalid', bad);
      if (bad) ok = false;
    }

    const terms = form.querySelector('[data-terms]');
    if (terms && !terms.checked) {
      window.toast('Please accept the terms to continue', 'error');
      ok = false;
    }
    return ok;
  }

  function success(msg) {
    const box = $('[data-auth-msg]');
    box.className = 'form-msg show';
    box.textContent = msg;
  }

  /* login */
  const loginForm = $('[data-form="login"]');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(loginForm)) { window.toast('Please check your details', 'error'); return; }
      const email = loginForm.querySelector('[name="email"]').value.trim();
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Signing in…';
      setTimeout(() => {
        const name = email.split('@')[0].replace(/[._-]/g, ' ');
        try { localStorage.setItem('metra:user', JSON.stringify({ email, name })); } catch (err) {}
        success('Signed in successfully. Welcome back to METRA — redirecting you to the collection.');
        window.toast('Welcome back');
        setTimeout(() => { location.href = 'shop.html'; }, 1200);
      }, 800);
    });
  }

  /* register */
  const regForm = $('[data-form="register"]');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(regForm)) { window.toast('Please check your details', 'error'); return; }
      const first = regForm.querySelector('[name="first"]').value.trim();
      const email = regForm.querySelector('[name="email"]').value.trim();
      const btn = regForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Creating account…';
      setTimeout(() => {
        try { localStorage.setItem('metra:user', JSON.stringify({ email, name: first })); } catch (err) {}
        success(`Welcome to the maison, ${first}. Your account is ready — a confirmation is on its way to ${email}.`);
        window.toast('Account created — welcome to METRA');
        setTimeout(() => { location.href = 'shop.html'; }, 1600);
      }, 900);
    });
  }

  /* social */
  $$('[data-social]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.toast(`Continuing with ${btn.dataset.social}…`);
      setTimeout(() => { location.href = 'shop.html'; }, 900);
    });
  });

  /* clear invalid state */
  document.addEventListener('input', e => {
    const f = e.target.closest('.field');
    if (f) f.classList.remove('invalid');
  });
})();
