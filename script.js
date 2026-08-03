// =========================================================
// MENÚ HAMBURGUESA (off-canvas) — se activa PRIMERO y SIEMPRE,
// sin depender de que Bootstrap u otras cosas carguen bien.
// =========================================================
const btnHamburger = document.getElementById('btn-hamburger');
const btnCloseMenu = document.getElementById('btn-close-menu');
const offcanvas = document.getElementById('offcanvas');
const offcanvasBackdrop = document.getElementById('offcanvas-backdrop');

function abrirMenu() {
  if (!offcanvas || !offcanvasBackdrop) return;
  offcanvas.classList.add('is-open');
  offcanvasBackdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function cerrarMenu() {
  if (!offcanvas || !offcanvasBackdrop) return;
  offcanvas.classList.remove('is-open');
  offcanvasBackdrop.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (btnHamburger) btnHamburger.addEventListener('click', abrirMenu);
if (btnCloseMenu) btnCloseMenu.addEventListener('click', cerrarMenu);
if (offcanvasBackdrop) offcanvasBackdrop.addEventListener('click', cerrarMenu);
document.querySelectorAll('.offcanvas__nav a').forEach(a => a.addEventListener('click', cerrarMenu));

// =========================================================
// SOMBRA EN EL HEADER AL HACER SCROLL
// =========================================================
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10 ? '0 4px 14px rgba(0,0,0,.18)' : 'none';
  });
}

// =========================================================
// MODO OSCURO / CLARO
// =========================================================
const THEME_KEY = 'yabar_theme';
const btnTheme = document.getElementById('btn-theme');

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem(THEME_KEY, tema);
  if (btnTheme) {
    btnTheme.innerHTML = tema === 'dark'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
}

const temaGuardado = localStorage.getItem(THEME_KEY) || 'light';
aplicarTema(temaGuardado);

if (btnTheme) {
  btnTheme.addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme') || 'light';
    aplicarTema(actual === 'light' ? 'dark' : 'light');
  });
}

// =========================================================
// BUSCADOR DEL HEADER
// =========================================================
const WHATSAPP_NUMERO = "51958345849";
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

// =========================================================
// PRODUCTOS: carga desde la API
// =========================================================
const API_URL = "https://yabar-web.onrender.com/api";
let PRODUCTOS_CACHE = [];
let FILTRO_CATEGORIA = 'todos';
let FILTRO_TEXTO = '';

async function cargarProductosPublicos() {
  const contenedor = document.getElementById('cards-productos');
  if (!contenedor) return;

  contenedor.innerHTML = Array.from({ length: 8 }).map(() => `
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
      contenedor.innerHTML = '<p class="cards-empty">Estamos cargando el catálogo. Mientras tanto, escríbenos por WhatsApp y te ayudamos directo.</p>';
      return;
    }

    construirFiltrosCategoria(productos);
    renderProductos();

  } catch (e) {
    contenedor.innerHTML = '<p class="cards-empty">No pudimos cargar el catálogo ahora mismo. Escríbenos por WhatsApp y te ayudamos directo con lo que buscas.</p>';
  }
}

function construirFiltrosCategoria(productos) {
  const listaEl = document.getElementById('filtros-categorias');
  const countTodosEl = document.getElementById('count-todos');
  if (!listaEl) return;

  const categorias = {};
  productos.forEach(p => {
    const cat = p.categoria || 'Otros';
    categorias[cat] = (categorias[cat] || 0) + 1;
  });

  if (countTodosEl) countTodosEl.textContent = productos.length;

  const botonesCategorias = Object.keys(categorias).sort().map(cat => `
    <button type="button" class="filtro-btn" data-categoria="${cat}">
      ${cat} <span class="filtro-btn__count">${categorias[cat]}</span>
    </button>`).join('');

  listaEl.insertAdjacentHTML('beforeend', botonesCategorias);

  listaEl.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      listaEl.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      FILTRO_CATEGORIA = btn.dataset.categoria;
      renderProductos();
    });
  });
}

function renderProductos() {
  const contenedor = document.getElementById('cards-productos');
  const countEl = document.getElementById('catalogo-count');
  if (!contenedor) return;

  let lista = PRODUCTOS_CACHE;

  if (FILTRO_CATEGORIA !== 'todos') {
    lista = lista.filter(p => (p.categoria || 'Otros') === FILTRO_CATEGORIA);
  }
  if (FILTRO_TEXTO) {
    const q = FILTRO_TEXTO.toLowerCase();
    lista = lista.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.categoria || '').toLowerCase().includes(q)
    );
  }

  if (countEl) {
    countEl.innerHTML = `<strong>${lista.length}</strong> producto${lista.length === 1 ? '' : 's'} encontrado${lista.length === 1 ? '' : 's'}`;
  }

  if (lista.length === 0) {
    contenedor.innerHTML = '<p class="cards-empty">No encontramos productos con ese filtro. Prueba con otra palabra o escríbenos por WhatsApp.</p>';
    return;
  }

  contenedor.innerHTML = lista.map((p, i) => {
    const esNuevo = i < 3 && FILTRO_CATEGORIA === 'todos' && !FILTRO_TEXTO;
    const badge = esNuevo ? '<span class="card__badge">Nuevo</span>' : '';
    const imgHtml = p.imagenUrl
      ? `<div class="card__img"><img src="${p.imagenUrl}" alt="${p.nombre}" loading="lazy"></div>`
      : `<div class="card__img card__img--empty"><span>YABAR</span></div>`;
    const unidadHtml = p.unidad
      ? `<p class="card__unit"><strong>Presentación:</strong> ${p.unidad}</p>`
      : '';
    return `
      <article class="card">
        ${imgHtml}
        <div class="card__body">
          ${badge}
          <span class="card__tag">${p.categoria || 'Producto'}</span>
          <h3 class="card__title">${p.nombre}</h3>
          ${unidadHtml}
          <button type="button" class="card__cta card__cta--btn" data-producto-id="${p.id}">
            Ver detalle <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>`;
  }).join('');

  document.querySelectorAll('[data-producto-id]').forEach(btn => {
    btn.addEventListener('click', () => abrirModalProducto(btn.dataset.productoId));
  });
}

const catalogoSearch = document.getElementById('catalogo-search');
if (catalogoSearch) {
  catalogoSearch.addEventListener('input', (e) => {
    FILTRO_TEXTO = e.target.value.trim();
    renderProductos();
  });
}

function abrirModalProducto(id) {
  const p = PRODUCTOS_CACHE.find(x => String(x.id) === String(id));
  if (!p) return;

  const modalEl = document.getElementById('producto-modal');
  if (!modalEl || typeof bootstrap === 'undefined') return;

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

  try {
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  } catch (e) { /* silencioso: si Bootstrap falló, no rompe el resto de la página */ }
}

cargarProductosPublicos();

// =========================================================
// EXTRAS DE BOOTSTRAP (tooltips, toasts) — protegidos con try/catch
// para que un fallo aquí NUNCA afecte el resto del sitio.
// =========================================================
try {
  if (typeof bootstrap !== 'undefined') {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el);
    });
  }
} catch (e) { /* silencioso */ }

document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    const texto = btn.dataset.copy;
    navigator.clipboard.writeText(texto).then(() => {
      try {
        const toastEl = document.getElementById('copy-toast');
        if (toastEl && typeof bootstrap !== 'undefined') {
          bootstrap.Toast.getOrCreateInstance(toastEl).show();
        }
      } catch (e) { /* silencioso */ }
    });
  });
});