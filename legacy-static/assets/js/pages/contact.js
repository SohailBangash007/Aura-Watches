/* ============================================================
   METRA — contact page
   ============================================================ */
(function () {
  /* accordions */
  document.querySelectorAll('.acc-btn').forEach(btn => {
    const item = btn.parentElement;
    const panel = item.querySelector('.acc-panel');
    if (!panel) return;
    if (item.classList.contains('open')) panel.style.maxHeight = panel.scrollHeight + 'px';
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = isOpen ? '' : panel.scrollHeight + 'px';
    });
  });

  /* form */
  const form = document.querySelector('[data-contact-form]');
  const msg = document.querySelector('[data-contact-msg]');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[data-required]').forEach(el => {
      const field = el.closest('.field');
      let bad = !(el.value || '').trim();
      if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
      if (field) field.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });

    if (!ok) {
      window.toast('Please check the highlighted fields', 'error');
      return;
    }

    const name = form.querySelector('[name="name"]').value.trim().split(' ')[0];
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      msg.className = 'form-msg show';
      msg.textContent = `Thank you, ${name}. Your message is with the atelier — we will reply within one business day.`;
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send message';
      window.toast('Message sent — thank you');
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 800);
  });

  form.addEventListener('input', e => {
    const f = e.target.closest('.field');
    if (f) f.classList.remove('invalid');
  });
})();
