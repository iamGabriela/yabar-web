// Sombra en el header al hacer scroll
const header = document.querySelector('.header');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 8px 24px rgba(43, 28, 20, 0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// Lógica del menú hamburguesa
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Cerrar menú al hacer click en un enlace
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}