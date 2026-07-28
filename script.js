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

// Número de WhatsApp de la sede principal (Nasca) para cotizar productos del catálogo
const WHATSAPP_NUMBER = '51958345849';

// Genera el enlace de WhatsApp de cada botón "Cotizar" con el nombre exacto del producto
document.querySelectorAll('.item-quote').forEach(link => {
  const producto = link.dataset.product;
  const mensaje = `Hola Yabar, quisiera cotizar: ${producto}`;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  link.target = '_blank';
  link.rel = 'noopener';
});

// Filtros de categoría en el catálogo de productos
const filterBtns = document.querySelectorAll('.filter-btn');
const catBlocks = document.querySelectorAll('.cat-block');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filtro = btn.dataset.filter;
    catBlocks.forEach(block => {
      const coincide = filtro === 'todos' || block.dataset.cat === filtro;
      block.style.display = coincide ? '' : 'none';
    });
  });
});