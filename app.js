const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const header = $('.site-header');
const menuToggle = $('.menu-toggle');
const mobileMenu = $('.mobile-menu');
const toast = $('#toast');
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
}

function setHeader() { header.classList.toggle('scrolled', window.scrollY > 16); }
window.addEventListener('scroll', setHeader, { passive: true });
setHeader();

menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open'); menuToggle.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

$$('.service-action').forEach(button => button.addEventListener('click', () => notify(`«${button.dataset.service}» جزء من مسارات أبدع المتاحة قريباً.`)));

const filters = $$('.filter');
const ideaCards = $$('.idea-card');
filters.forEach(filter => filter.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active')); filter.classList.add('active');
  const type = filter.dataset.filter;
  ideaCards.forEach(card => {
    const show = type === 'all' || card.dataset.category === type;
    card.style.display = show ? '' : 'none';
  });
}));

const ideaModal = $('#idea-modal');
const registerModal = $('#register-modal');
const detailModal = $('#detail-modal');
function openModal(modal) { if (modal.showModal) modal.showModal(); else modal.setAttribute('open', ''); }
function closeModal(modal) { if (modal.close) modal.close(); else modal.removeAttribute('open'); }
$$('.close-modal').forEach(button => button.addEventListener('click', () => closeModal(button.closest('dialog'))));
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) closeModal(dialog); }));
$$('.open-idea-modal').forEach(button => button.addEventListener('click', () => openModal(ideaModal)));
$('.open-idea-from-detail').addEventListener('click', () => { closeModal(detailModal); openModal(ideaModal); });

const descriptions = {
  'دليلك الجامعي الذكي': 'مثال توضيحي لمنصة تساعد الطالب الجديد على اكتشاف الخدمات والأماكن والفرص في الحرم الجامعي. يحتاج الفريق إلى باحث تجربة مستخدم، مصمم واجهات، ومطوّر ويب لبناء نسخة أولى قابلة للاختبار.',
  'زرعة من كل طالب': 'مثال توضيحي لمبادرة بيئية تربط الطلبة بمساحات خضراء صغيرة. يمكن بدء التجربة بحملة اختيار نبات ومتابعة نموه داخل البيئة الجامعية.',
  'ساعة مهارة': 'مثال توضيحي لسلسلة لقاءات قصيرة يقدّم فيها كل طالب مهارة يتقنها، ويخرج المشاركون بمعرفة عملية وعلاقة جديدة.'
};
$$('.idea-detail').forEach(button => button.addEventListener('click', () => {
  const title = button.dataset.idea;
  $('#detail-title').textContent = title;
  $('#detail-text').textContent = descriptions[title];
  openModal(detailModal);
}));

const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
function formMessage(form, inputs) {
  for (const input of inputs) {
    input.classList.remove('invalid');
    if (!input.value.trim() || (input.type === 'email' && !validEmail(input.value))) {
      input.classList.add('invalid'); input.focus(); return false;
    }
  }
  return true;
}

$('#idea-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget; const inputs = $$('[required]', form);
  if (!formMessage(form, inputs)) return notify('يرجى إكمال عنوان الفكرة ومجالها ووصفها بشكل صحيح.');
  const data = Object.fromEntries(new FormData(form));
  const submitted = JSON.parse(localStorage.getItem('ebdaIdeas') || '[]'); submitted.push({ ...data, submittedAt: new Date().toISOString() }); localStorage.setItem('ebdaIdeas', JSON.stringify(submitted));
  form.reset(); closeModal(ideaModal); notify('تم حفظ فكرتك تجريبياً في هذا المتصفح. شكراً لمشاركتك!');
});

$$('.register-button').forEach(button => button.addEventListener('click', () => {
  const workshop = button.dataset.workshop;
  $('#register-title').textContent = workshop;
  $('[name="workshop"]', registerModal).value = workshop;
  openModal(registerModal);
}));
$('#register-form').addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget; const inputs = $$('[required]', form);
  if (!formMessage(form, inputs)) return notify('يرجى إدخال الاسم والبريد الإلكتروني بشكل صحيح.');
  const data = Object.fromEntries(new FormData(form)); const submissions = JSON.parse(localStorage.getItem('ebdaInterest') || '[]'); submissions.push({ ...data, submittedAt: new Date().toISOString() }); localStorage.setItem('ebdaInterest', JSON.stringify(submissions));
  form.reset(); closeModal(registerModal); notify('تم تسجيل اهتمامك تجريبياً. سنتواصل عند توفر نظام التسجيل الفعلي.');
});

$$('.gallery-item').forEach(item => item.addEventListener('click', () => notify(`«${item.dataset.gallery}» لوحة تجريبية قابلة للاستبدال بصورة النشاط الفعلية.`)));
