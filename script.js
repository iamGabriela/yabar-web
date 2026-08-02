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
const API_URL = "https://yabar-web.onrender.com/api";
const WHATSAPP_NUMERO = "51958345849";
let PRODUCTOS_CACHE = [];

async function cargarProductosPublicos() {
  const contenedor = document.getElementById('cards-productos');
  if (!contenedor) return;

  // Skeleton mientras carga
  contenedor.innerHTML = Array.from({length: 8}).map(() => `
    <div class="card-skeleton">
      <div class="card-skeleton__img"></div>
      <div class="card-skeleton__body">
        <div class="card-skeleton__line card-skeleton__line--short"></div>
        <div class="card-skeleton__line"></div>
        <div class="card-skeleton__line card-skeleton__line--short"></div>
      </div>
    </div>`).join('');

  try {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) throw new Error('Error al traer productos');
    const productos = await res.json();
    PRODUCTOS_CACHE = productos;

    if (productos.length === 0) {
      contenedor.innerHTML = '<p style="grid-column:1/-1;color:#7d7263;text-align:center;padding:40px 0;">Estamos cargando el catálogo. Mientras tanto, escríbenos por WhatsApp y te ayudamos directo.</p>';
      return;
    }

    contenedor.innerHTML = productos.map((p, i) => {
      const unidad = p.unidad ? `<p class="card__unit">${p.unidad}</p>` : '';
      const esNuevo = i < 3;
      const badge = esNuevo ? '<span class="badge text-bg-warning card__badge">Nuevo</span>' : '';
      const imgHtml = p.imagenUrl
        ? `<div class="card__img"><img src="${p.imagenUrl}" alt="${p.nombre}" loading="lazy"></div>`
        : `<div class="card__img card__img--empty"><span>YABAR</span></div>`;
      return `
        <article class="card">
          ${imgHtml}
          <div class="card__body">
            ${badge}
            <div class="card__tag">${p.categoria || 'Producto'}</div>
            <h3>${p.nombre}</h3>
            ${unidad}
            <button type="button" class="card__cta card__cta--btn" data-producto-id="${p.id}">
              Ver detalle <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>`;
    }).join('');

    document.querySelectorAll('[data-producto-id]').forEach(btn => {
      btn.addEventListener('click', () => abrirModalProducto(btn.dataset.productoId));
    });

  } catch (e) {
    contenedor.innerHTML = '<p style="grid-column:1/-1;color:#7d7263;text-align:center;padding:40px 0;">No pudimos cargar el catálogo ahora mismo. Escríbenos por WhatsApp y te ayudamos directo con lo que buscas.</p>';
  }
}

// ===== Modal de detalle de producto (Bootstrap) =====
function abrirModalProducto(id) {
  const p = PRODUCTOS_CACHE.find(x => String(x.id) === String(id));
  if (!p) return;

  const modalEl = document.getElementById('producto-modal');
  if (!modalEl) return;

  modalEl.querySelector('.modal-title').textContent = p.nombre;
  modalEl.querySelector('.modal-body-cat').textContent = p.categoria || 'Producto';
  modalEl.querySelector('.modal-body-desc').textContent = p.descripcion || 'Consulta disponibilidad y detalles con nuestro equipo.';
  modalEl.querySelector('.modal-body-unit').textContent = p.unidad ? `Presentación: ${p.unidad}` : '';

  const img = modalEl.querySelector('.modal-body-img');
  if (p.imagenUrl) {
    img.src = p.imagenUrl;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }

  const mensaje = encodeURIComponent(`Hola, quiero cotizar ${p.nombre}`);
  modalEl.querySelector('.modal-body-cta').href = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;

  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  bsModal.show();
}

cargarProductosPublicos();

// ===== Tooltips de Bootstrap =====
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
  new bootstrap.Tooltip(el);
});

// ===== Toast: copiar teléfono =====
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    const texto = btn.dataset.copy;
    navigator.clipboard.writeText(texto).then(() => {
      const toastEl = document.getElementById('copy-toast');
      if (toastEl) {
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        toast.show();
      }
    });
  });
});

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

// ===== Menú off-canvas (hamburguesa) =====
const btnHamburger = document.getElementById('btn-hamburger');
const btnCloseMenu = document.getElementById('btn-close-menu');
const offcanvas = document.getElementById('offcanvas');
const offcanvasBackdrop = document.getElementById('offcanvas-backdrop');

function abrirMenu() {
  offcanvas.classList.add('is-open');
  offcanvasBackdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function cerrarMenu() {
  offcanvas.classList.remove('is-open');
  offcanvasBackdrop.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (btnHamburger) btnHamburger.addEventListener('click', abrirMenu);
if (btnCloseMenu) btnCloseMenu.addEventListener('click', cerrarMenu);
if (offcanvasBackdrop) offcanvasBackdrop.addEventListener('click', cerrarMenu);
document.querySelectorAll('.offcanvas__nav a').forEach(a => a.addEventListener('click', cerrarMenu));
