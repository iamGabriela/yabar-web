// Sombra en el header al hacer scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 14px rgba(22,16,12,.08)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// ===== Carga de productos desde la API =====
// Cambia esto por la URL real de tu backend una vez desplegado en Railway
const API_URL = "https://TU-BACKEND.up.railway.app/api";
const WHATSAPP_NUMERO = "51958345849";

async function cargarProductosPublicos() {
  const contenedor = document.getElementById('cards-productos');
  if (!contenedor) return;

  try {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) throw new Error('Error al traer productos');
    const productos = await res.json();

    if (productos.length === 0) {
      contenedor.innerHTML = '<p style="grid-column:1/-1;color:#9a8f80;">Pronto agregaremos productos aquí.</p>';
      return;
    }

    contenedor.innerHTML = productos.map(p => {
      const mensaje = encodeURIComponent(`Hola, quiero cotizar ${p.nombre}`);
      const precio = p.precio ? `S/ ${p.precio}` : 'Consultar';
      const unidad = p.unidad ? `<span>${p.unidad}</span>` : '';
      return `
        <article class="card">
          <div class="card__tag">${p.categoria || 'Producto'}</div>
          <h3>${p.nombre}</h3>
          <p class="card__price">${precio} ${unidad}</p>
          <a class="card__cta" target="_blank" rel="noopener"
             href="https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}">
            Cotizar →
          </a>
        </article>`;
    }).join('');

  } catch (e) {
    contenedor.innerHTML = '<p style="grid-column:1/-1;color:#9a8f80;">No se pudo cargar el catálogo. Escríbenos por WhatsApp.</p>';
  }
}

cargarProductosPublicos();

// ===== Buscador del header =====
const searchForm = document.getElementById('searchbar');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
      const mensaje = encodeURIComponent(`Hola Yabar, busco: ${query}`);
      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`, '_blank');
    }
  });
}