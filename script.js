// Sombra en el header al hacer scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 14px rgba(22,16,12,.08)';
  } else {
    header.style.boxShadow = 'none';
  }
});