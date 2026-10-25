const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => link.addEventListener('click', event => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) {
    event.preventDefault();
    closeMenu();
    section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section').forEach(section => observer.observe(section));

const sampleData = {
  web: { label: '01 / WEB DEVELOPMENT', title: 'Sites with a pulse.', intro: 'A few directions I can build for brands, people, and big ideas. Each can be shaped around your exact goal.', samples: [['Portfolio site', 'A bold personal space that shows the work and personality behind it.'], ['Business landing page', 'A clear online home that turns visitors into customers.'], ['Event / campaign page', 'A focused launch page built to create attention and action.'], ['Creator website', 'A clean hub for content, services, links, and community.']] },
  app: { label: '02 / APP DEVELOPMENT', title: 'Useful, not confusing.', intro: 'App ideas start with the person using them. Here are the kinds of experiences I’m excited to shape.', samples: [['Student dashboard', 'A tidy space for tasks, schedules, resources, and progress.'], ['Booking tool', 'A smooth way for people to request, reserve, and stay updated.'], ['Community app', 'A simple digital home that helps people connect and participate.'], ['Utility tool', 'One job, done well — designed to make a repetitive task easier.']] },
  design: { label: '03 / GRAPHIC DESIGN', title: 'Visuals that speak.', intro: 'Design that catches the eye and still says something useful. Built for the feed, the brand, and the moment.', samples: [['Social campaign', 'Scroll-stopping post sets that keep a campaign looking consistent.'], ['Brand starter kit', 'A confident visual direction for a business with somewhere to go.'], ['Event visuals', 'Posters, social graphics, and announcements with real energy.'], ['Promo graphics', 'Strong digital artwork made to launch an offer or tell a story.']] }
};
const modal = document.querySelector('#samples-modal');
const type = document.querySelector('#modal-type');
const title = document.querySelector('#modal-title');
const intro = document.querySelector('#modal-intro');
const grid = document.querySelector('#sample-grid');
let sampleOpener = null;
let previousOverflow = '';
const closeModal = () => {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = previousOverflow;
  sampleOpener?.focus({ preventScroll: true });
};
modal.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const targets = [...modal.querySelectorAll('button, a[href]')];
  const index = targets.indexOf(document.activeElement);
  event.preventDefault();
  targets[(index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length].focus();
});
document.querySelectorAll('.sample-trigger').forEach(button => button.addEventListener('click', () => {
  const content = sampleData[button.dataset.modal];
  closeMenu();
  sampleOpener = button;
  previousOverflow = document.body.style.overflow;
  type.textContent = content.label; title.textContent = content.title; intro.textContent = content.intro;
  grid.innerHTML = content.samples.map(([name, description], index) => `<article class="sample-item"><span>0${index + 1} / SAMPLE</span><div><h3>${name}</h3><p>${description}</p></div></article>`).join('');
  modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-body').scrollTop = 0;
  modal.querySelector('.modal-close').focus({ preventScroll: true });
}));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeModal(); closeMenu(); } });

const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const savedTheme = localStorage.getItem('timix-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const setTheme = theme => {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  themeToggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  themeLabel.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
};
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  localStorage.setItem('timix-theme', nextTheme);
});

const menuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuScrim = document.querySelector('.menu-scrim');
const menuLabel = menuToggle.querySelector('b');
const backgroundContent = [document.querySelector('main'), document.querySelector('footer')];
let menuIsOpen = false;
let savedScrollY = 0;
let savedBodyStyles = '';
mobileMenu.inert = true;
menuScrim.tabIndex = -1;

const closeMenu = () => {
  if (!menuIsOpen) return;
  const restoreFocus = mobileMenu.contains(document.activeElement) || document.activeElement === menuToggle;
  menuIsOpen = false;
  document.documentElement.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  menuLabel.textContent = 'Menu';
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileMenu.inert = true;
  backgroundContent.forEach(element => { element.inert = false; });
  document.body.style.cssText = savedBodyStyles;
  const previousBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, savedScrollY);
  document.documentElement.style.scrollBehavior = previousBehavior;
  lastScrollY = savedScrollY;
  if (restoreFocus) menuToggle.focus({ preventScroll: true });
};
menuToggle.addEventListener('click', () => {
  if (menuIsOpen) { closeMenu(); return; }
  savedScrollY = window.scrollY;
  savedBodyStyles = document.body.style.cssText;
  menuIsOpen = true;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.documentElement.classList.add('menu-open');
  nav.classList.remove('nav-hidden');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
  menuLabel.textContent = 'Close';
  mobileMenu.setAttribute('aria-hidden', 'false');
  mobileMenu.inert = false;
  backgroundContent.forEach(element => { element.inert = true; });
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
menuScrim.addEventListener('click', closeMenu);
document.addEventListener('keydown', event => {
  if (!menuIsOpen || event.key !== 'Tab') return;
  const focusables = [themeToggle, menuToggle, ...mobileMenu.querySelectorAll('a')];
  const index = focusables.indexOf(document.activeElement);
  event.preventDefault();
  const nextIndex = (index + (event.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
  focusables[nextIndex].focus();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) closeMenu();
});

const nav = document.querySelector('.nav');
const progress = document.querySelector('.scroll-progress');
let lastScrollY = window.scrollY;
let ticking = false;
const updateScrollUI = () => {
  if (menuIsOpen) { ticking = false; return; }
  const currentY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty('--scroll-progress', `${maxScroll ? (currentY / maxScroll) * 100 : 0}%`);
  nav.classList.toggle('nav-scrolled', currentY > 35);
  nav.classList.toggle('nav-hidden', window.innerWidth > 700 && !nav.contains(document.activeElement) && currentY > 145 && currentY > lastScrollY);
  lastScrollY = currentY;
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(updateScrollUI); ticking = true; }
}, { passive: true });
updateScrollUI();
