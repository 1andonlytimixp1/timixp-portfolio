(() => {
  if (!window.HTMLDialogElement || !HTMLDialogElement.prototype.showModal) return;
  const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
  const dialog = document.createElement('dialog');
  dialog.className = 'finder'; dialog.id = 'quick-finder';
  dialog.setAttribute('aria-labelledby', 'finder-title');
  dialog.innerHTML = '<div class="finder-shell"><div class="finder-head"><div><span class="finder-eyebrow">TIMIX P / SHORTCUTS</span><h2 id="finder-title">Where to?</h2></div><button class="finder-close" type="button" aria-label="Close quick finder">×</button></div><label class="finder-search"><span class="finder-search-icon">' + searchIcon + '</span><input type="search" id="finder-query" aria-label="Search sections and actions" placeholder="Try services, playground, email…" maxlength="100" autocomplete="off" spellcheck="false" aria-controls="finder-results"/></label><p class="finder-count" aria-live="polite" aria-atomic="true"></p><div class="finder-content"><ul class="finder-results" id="finder-results" aria-label="Matching sections and actions"></ul><p class="finder-status" role="status"></p><div class="finder-email" hidden><label for="finder-email-value">Select and copy my email</label><input id="finder-email-value" readonly value="1andonlytimixp@gmail.com"/></div></div><div class="finder-foot"><p class="finder-desktop-hint">↑ ↓ to move · Enter to open · Esc to close</p><p class="finder-mobile-hint">Search, then tap a result.</p><span>MADE TO EXPLORE ↗</span></div></div>';
  document.body.append(dialog);
  const input = dialog.querySelector('#finder-query');
  const list = dialog.querySelector('.finder-results');
  const count = dialog.querySelector('.finder-count');
  const status = dialog.querySelector('.finder-status');
  const fallback = dialog.querySelector('.finder-email');
  const menu = document.querySelector('.mobile-menu');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  let opener, previousBody, savedY = 0, backdropDown = false;
  const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  const items = [
    { title: 'Design playground', description: 'Mix colours, try demos, and find your direction.', icon: '✳', target: '#playground', keywords: 'interactive lab colours colors palette samples demos' },
    { title: 'Explore my services', description: 'Websites, apps, graphics. Clear scope, fair pricing.', icon: '↗', target: '#services', keywords: 'affordable prices pricing budget web development application design' },
    { title: 'Start a project', description: 'Turn your idea into a simple project brief.', icon: '＋', target: '#project-starter', keywords: 'hire booking brief idea contact work together' },
    { title: 'About Timix P', description: 'A little about the person behind the pixels.', icon: '01', target: '#about', keywords: 'bio olugbenga timilehin pamilerin engineer developer' },
    { title: 'My journey', description: 'What I am learning, building, and exploring.', icon: '↗', target: '#journey', keywords: 'experience skills learning career' },
    { title: 'In progress', description: 'Experiments and ideas taking shape.', icon: '⌁', target: '#work', keywords: 'smart systems projects useful software' },
    { title: 'Quick answers', description: 'Small projects, remote work, and getting started.', icon: '?', target: '.questions', keywords: 'faq questions process how' },
    { title: 'Chat on WhatsApp', description: 'Say hello and tell me what you have in mind.', icon: '↗', href: 'https://wa.me/2347019833790', keywords: 'contact message phone talk chat' },
    { title: 'Copy my email', description: '1andonlytimixp@gmail.com', icon: '@', action: 'email', keywords: 'contact address clipboard mail' },
    { title: 'Switch appearance', description: '', icon: '◐', action: 'theme', keywords: 'theme dark light mode appearance colour color' }
  ];
  function render() {
    const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    list.replaceChildren(); status.textContent = ''; fallback.hidden = true;
    const results = items.map(item => item.action === 'theme' ? { ...item, title: document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', description: 'A softer look, saved for your next visit.' } : item)
      .filter(item => terms.every(term => (item.title + ' ' + item.description + ' ' + item.keywords).toLowerCase().includes(term)));
    count.textContent = terms.length ? results.length + (results.length === 1 ? ' result' : ' results') : 'A FEW GOOD PLACES TO START';
    for (const item of results) {
      const li = document.createElement('li');
      const button = document.createElement(item.href ? 'a' : 'button');
      button.className = 'finder-result';
      if (item.href) { button.href = item.href; button.target = '_blank'; button.rel = 'noopener noreferrer'; }
      else button.type = 'button';
      const icon = document.createElement('span'); icon.className = 'finder-result-icon'; icon.textContent = item.icon; icon.setAttribute('aria-hidden', 'true');
      if (item.href) icon.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><use href="#whatsapp-mark"></use></svg>';
      const copy = document.createElement('span'); copy.className = 'finder-result-copy';
      const title = document.createElement('strong'); title.textContent = item.title;
      const desc = document.createElement('small'); desc.textContent = item.description;
      const arrow = document.createElement('span'); arrow.className = 'finder-result-arrow'; arrow.textContent = item.action ? '↵' : '↗'; arrow.setAttribute('aria-hidden', 'true');
      copy.append(title, desc); button.append(icon, copy, arrow); li.append(button); list.append(li);
      button.addEventListener('click', () => activate(item));
    }
    if (!results.length) {
      const li = document.createElement('li'); li.className = 'finder-empty';
      li.innerHTML = '<strong>No matches this time.</strong>Try “website”, “playground”, or “contact”.<br/><button type="button">Clear search</button>';
      li.querySelector('button').addEventListener('click', () => { input.value = ''; render(); input.focus(); });
      list.append(li);
    }
    dialog.querySelector('.finder-content').scrollTop = 0;
  }
  function viewport() {
    const v = window.visualViewport;
    dialog.style.setProperty('--finder-height', (v?.height || innerHeight) + 'px');
    dialog.style.setProperty('--finder-top', (v?.offsetTop || 0) + 'px');
  }
  function open(trigger) {
    if (dialog.open || document.querySelector('#samples-modal.is-open')) return;
    if (document.documentElement.classList.contains('menu-open')) menuToggle.click();
    opener = trigger && !menu.contains(trigger) ? trigger : menuToggle;
    savedY = scrollY; previousBody = document.body.style.cssText;
    document.documentElement.classList.add('finder-open');
    Object.assign(document.body.style, { position: 'fixed', top: -savedY + 'px', left: '0', right: '0' });
    input.value = ''; render(); viewport();
    dialog.showModal(); input.focus({ preventScroll: true });
  }
  dialog.addEventListener('close', () => {
    document.body.style.cssText = previousBody || '';
    document.documentElement.classList.remove('finder-open');
    const old = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, savedY); document.documentElement.style.scrollBehavior = old;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  async function activate(item) {
    if (item.action === 'theme') {
      themeToggle.click(); render();
      const target = [...list.querySelectorAll('.finder-result')].find(el => el.textContent.includes('Switch to'));
      (target || input).focus({ preventScroll: true });
      status.textContent = 'Appearance updated.'; status.scrollIntoView({ block: 'nearest' }); return;
    }
    if (item.action === 'email') {
      try { await navigator.clipboard.writeText('1andonlytimixp@gmail.com'); if (dialog.open) { status.textContent = 'Email copied. Let’s make something good.'; status.scrollIntoView({ block: 'nearest' }); } }
      catch { if (dialog.open) { fallback.hidden = false; status.textContent = 'Copy the email below.'; const field = fallback.querySelector('input'); field.focus(); field.select(); field.scrollIntoView({ block: 'nearest' }); } }
      return;
    }
    dialog.close();
    if (item.target) requestAnimationFrame(() => {
      const target = document.querySelector(item.target); if (!target) return;
      const focusTarget = target.querySelector('h2,h3') || target;
      const tabIndex = focusTarget.getAttribute('tabindex'); focusTarget.tabIndex = -1; focusTarget.focus({ preventScroll: true });
      focusTarget.addEventListener('blur', () => { if (tabIndex === null) focusTarget.removeAttribute('tabindex'); else focusTarget.setAttribute('tabindex', tabIndex); }, { once: true });
      const top = target.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight - 24;
      scrollTo({ top: Math.max(0, top), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }
  input.addEventListener('input', render);
  dialog.querySelector('.finder-close').addEventListener('click', () => dialog.close());
  const outside = event => { const r = dialog.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
  dialog.addEventListener('pointerdown', event => { backdropDown = outside(event); });
  dialog.addEventListener('pointerup', event => { if (backdropDown && outside(event)) dialog.close(); backdropDown = false; });
  dialog.addEventListener('keydown', event => {
    if (event.isComposing) return;
    const results = [...list.querySelectorAll('.finder-result')]; const index = results.indexOf(document.activeElement);
    if (['ArrowDown', 'ArrowUp'].includes(event.key) && (document.activeElement === input || index >= 0)) {
      event.preventDefault(); if (event.key === 'ArrowUp' && index <= 0) { input.focus(); return; }
      const next = event.key === 'ArrowDown' ? Math.min(index + 1, results.length - 1) : index - 1;
      results[next]?.focus({ preventScroll: true }); results[next]?.scrollIntoView({ block: 'nearest' });
    }
    if (event.key === 'Enter' && document.activeElement === input && results.length) { event.preventDefault(); results[0].click(); }
  });
  function launcher(location) {
    const button = document.createElement(location === 'menu' ? 'a' : 'button');
    button.className = 'finder-launch'; button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-controls', dialog.id);
    button.setAttribute('aria-label', 'Open quick finder'); button.title = 'Quick finder (' + shortcut + ')';
    if (location === 'menu') { button.href = '#quick-finder'; button.setAttribute('role', 'button'); button.addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); button.click(); } }); }
    else button.type = 'button';
    button.innerHTML = searchIcon + (location === 'header' ? '' : '<span>Quick finder</span>') + (location === 'footer' ? '<kbd class="finder-kbd">' + shortcut + '</kbd>' : '');
    button.addEventListener('click', e => { e.preventDefault(); open(button); });
    if (location === 'header') themeToggle.before(button); else if (location === 'menu') menu.prepend(button); else document.querySelector('footer').append(button);
  }
  launcher('header'); launcher('menu'); launcher('footer');
  document.addEventListener('keydown', event => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLowerCase() !== 'k' || event.repeat || event.isComposing) return;
    const editing = event.target.closest('input,textarea,select,[contenteditable="true"]');
    if (editing && !dialog.contains(editing)) return;
    if (document.querySelector('#samples-modal.is-open')) return;
    event.preventDefault(); if (dialog.open) dialog.close(); else open(document.activeElement);
  });
  window.visualViewport?.addEventListener('resize', viewport);
  window.visualViewport?.addEventListener('scroll', () => { if (dialog.open) viewport(); });
  window.addEventListener('resize', viewport);
})();
