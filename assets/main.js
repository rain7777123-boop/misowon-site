document.documentElement.classList.add('js');

(function () {
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');

  function show(message, kind) {
    status.textContent = message;
    status.className = 'form-status ' + kind;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const consent = form.consent.checked;

    if (!name || !contact) {
      show('이름과 연락처를 적어 주세요.', 'err');
      (name ? form.contact : form.name).focus();
      return;
    }
    if (!consent) {
      show('개인정보 수집·이용에 동의해 주세요.', 'err');
      form.consent.focus();
      return;
    }

    button.disabled = true;
    show('보내는 중이에요…', '');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          message: form.message.value.trim(),
          website: form.website.value,
          consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.');
      form.reset();
      show('고민 상담이 접수됐어요. 확인 후 연락드릴게요.', 'ok');
    } catch (err) {
      show(err.message || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.', 'err');
    } finally {
      button.disabled = false;
    }
  });
})();
