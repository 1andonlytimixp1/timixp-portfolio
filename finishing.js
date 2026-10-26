(() => {
  const links = [...document.querySelectorAll('.nav nav a[href^="#"], .mobile-menu a[href^="#"]')];
  const sections = [...document.querySelectorAll('main > section')];
  const destinations = new Set(links.map(link => link.hash));
  let pending = false;
  function updateLocation() {
    pending = false;
    if (document.documentElement.classList.contains('menu-open')) return;
    const threshold = Math.min(innerHeight * .3, 200);
    let current = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top > threshold) break;
      if (destinations.has('#' + section.id)) current = '#' + section.id;
      else if (section.classList.contains('approach')) current = '#services';
      else if (section.classList.contains('lab')) current = '#work';
      else if (section.classList.contains('questions')) current = '#contact';
    }
    links.forEach(link => {
      if (link.hash === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(updateLocation); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  updateLocation();
  const themeColor = document.querySelector('meta[name="theme-color"]');
  function syncThemeColor() {
    themeColor.content = document.documentElement.dataset.theme === 'dark' ? '#20211f' : '#e9e6de';
  }
  new MutationObserver(syncThemeColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  syncThemeColor();
})();
