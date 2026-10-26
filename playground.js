(() => {
  const root = document.querySelector('#playground');
  if (!root) return;
  const layouts = { portfolio: 'Portfolio', launch: 'Product', store: 'Store' };
  const palettes = { sage: 'Sage', clay: 'Clay', ocean: 'Ocean' };
  const views = { fit: 'Fit screen', phone: 'Phone' };
  const addresses = { portfolio: 'form.studio / concept', launch: 'daylight.app / concept', store: 'object.store / concept' };
  const defaults = { layout: 'portfolio', palette: 'sage', view: 'fit' };
  const state = { ...defaults };
  const params = new URLSearchParams(location.search);
  for (const [key, choices] of Object.entries({ layout: layouts, palette: palettes, view: views })) {
    const value = params.get('demo-' + key);
    if (Object.hasOwn(choices, value)) state[key] = value;
  }
  let art = 0;
  let bag = 0;
  const feedback = root.querySelector('.pg-feedback');
  function shareUrl() {
    const url = new URL('https://timixp-portfolio.pages.dev/');
    for (const [key, value] of Object.entries(state)) url.searchParams.set('demo-' + key, value);
    url.hash = 'playground';
    return url.href;
  }
  function render() {
    root.dataset.palette = state.palette;
    root.dataset.view = state.view;
    root.querySelectorAll('.pg-layout').forEach(panel => { panel.hidden = panel.dataset.layout !== state.layout; });
    for (const [key, value] of Object.entries(state)) root.querySelector('input[name="pg-' + key + '"][value="' + value + '"]').checked = true;
    root.querySelector('#pg-address').textContent = addresses[state.layout];
    root.querySelector('#pg-selection').textContent = [layouts[state.layout], palettes[state.palette], views[state.view]].join(' · ');
    const message = [
      "Hi Timix P! I tried your design playground and like this direction:",
      'Layout: ' + layouts[state.layout],
      'Palette: ' + palettes[state.palette],
      'Preview: ' + views[state.view],
      shareUrl(),
      "Could we discuss adapting this idea for my project and a quote?"
    ].join('\n');
    root.querySelector('.pg-send').href = 'https://wa.me/2347019833790?text=' + encodeURIComponent(message);
    root.querySelector('.pg-copy-fallback').hidden = true;
    feedback.textContent = '';
  }
  root.querySelectorAll('fieldset').forEach(fieldset => { fieldset.disabled = false; });
  root.querySelectorAll('button, input[data-task]').forEach(control => { control.disabled = false; });
  root.addEventListener('change', event => {
    if (event.target.matches('input[type="radio"]')) {
      const key = event.target.name.replace('pg-', '');
      const allowed = { layout: layouts, palette: palettes, view: views }[key];
      if (allowed && Object.hasOwn(allowed, event.target.value)) { state[key] = event.target.value; render(); }
    }
    if (event.target.matches('[data-task]')) updateTasks();
  });
  function updateTasks() {
    const done = root.querySelectorAll('[data-task]:checked').length;
    root.querySelector('#pg-task-count').textContent = done === 3 ? '3 of 3 little wins. Nicely done.' : done + ' of 3 little wins';
    root.querySelector('.pg-task-meter i').style.width = (done / 3 * 100) + '%';
  }
  function updateBag() {
    root.querySelector('#pg-bag-count').textContent = 'Demo bag · ' + bag;
  }
  root.querySelector('[data-demo="shuffle"]').addEventListener('click', () => {
    art = (art + 1) % 3;
    root.querySelector('.pg-artwork').dataset.variant = art;
    root.querySelector('#pg-art-number').textContent = '0' + (art + 1) + ' / 03';
  });
  root.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
    if (bag >= 99) { feedback.textContent = 'That is a full demo bag! Empty it to start again.'; return; }
    bag++;
    updateBag();
    feedback.textContent = button.dataset.add + ' added to the demo bag. No purchase is made.';
  }));
  root.querySelector('.pg-empty-bag').addEventListener('click', () => {
    bag = 0; updateBag(); feedback.textContent = 'Demo bag emptied.';
  });
  root.querySelector('.pg-reset').addEventListener('click', () => {
    Object.assign(state, defaults);
    art = 0; bag = 0;
    root.querySelector('.pg-artwork').dataset.variant = '0';
    root.querySelector('#pg-art-number').textContent = '01 / 03';
    root.querySelectorAll('[data-task]').forEach((task, index) => { task.checked = index === 0; });
    updateTasks(); updateBag(); render();
    feedback.textContent = 'Back to the original direction.';
  });
  root.querySelector('.pg-copy').addEventListener('click', async () => {
    const url = shareUrl();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      feedback.textContent = 'Link copied — it opens this exact direction.';
    } catch {
      const fallback = root.querySelector('.pg-copy-fallback');
      const input = root.querySelector('#pg-share-link');
      fallback.hidden = false; input.value = url; input.focus(); input.select();
      feedback.textContent = 'Select and copy the link below to share this direction.';
    }
  });
  render();
})();
