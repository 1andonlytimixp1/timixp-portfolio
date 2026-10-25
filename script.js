const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => link.addEventListener('click', event => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) { event.preventDefault(); section.scrollIntoView({ behavior: 'smooth' }); }
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
const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
document.querySelectorAll('.sample-trigger').forEach(button => button.addEventListener('click', () => {
  const content = sampleData[button.dataset.modal];
  type.textContent = content.label; title.textContent = content.title; intro.textContent = content.intro;
  grid.innerHTML = content.samples.map(([name, description], index) => `<article class="sample-item"><span>0${index + 1} / SAMPLE</span><div><h3>${name}</h3><p>${description}</p></div></article>`).join('');
  modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('timix-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const setTheme = theme => {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  themeToggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
};
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  localStorage.setItem('timix-theme', nextTheme);
});

const nav = document.querySelector('.nav');
const progress = document.querySelector('.scroll-progress');
let lastScrollY = window.scrollY;
let ticking = false;
const updateScrollUI = () => {
  const currentY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty('--scroll-progress', `${maxScroll ? (currentY / maxScroll) * 100 : 0}%`);
  nav.classList.toggle('nav-scrolled', currentY > 35);
  nav.classList.toggle('nav-hidden', currentY > 145 && currentY > lastScrollY);
  lastScrollY = currentY;
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(updateScrollUI); ticking = true; }
}, { passive: true });
updateScrollUI();
