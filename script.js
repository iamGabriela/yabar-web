// =========================================================
// MENÚ HAMBURGUESA (off-canvas) — se activa PRIMERO y SIEMPRE,
// sin depender de que Bootstrap u otras cosas carguen bien.
// =========================================================
const btnHamburger = document.getElementById('btn-hamburger');
const btnCloseMenu = document.getElementById('btn-close-menu');
const offcanvas = document.getElementById('site-menu');
const offcanvasBackdrop = document.getElementById('site-menu-backdrop');

function abrirMenu() {
  if (!offcanvas || !offcanvasBackdrop) return;
  offcanvas.classList.add('is-open');
  offcanvasBackdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (btnHamburger) btnHamburger.setAttribute('aria-expanded', 'true');
  const primerLink = offcanvas.querySelector('.site-menu__nav a');
  if (primerLink) primerLink.focus();
}
function cerrarMenu() {
  if (!offcanvas || !offcanvasBackdrop) return;
  offcanvas.classList.remove('is-open');
  offcanvasBackdrop.classList.remove('is-open');
  document.body.style.overflow = '';
  if (btnHamburger) btnHamburger.setAttribute('aria-expanded', 'false');
}

if (btnHamburger) btnHamburger.addEventListener('click', abrirMenu);
if (btnCloseMenu) btnCloseMenu.addEventListener('click', cerrarMenu);
if (offcanvasBackdrop) offcanvasBackdrop.addEventListener('click', cerrarMenu);
document.querySelectorAll('.site-menu__nav a').forEach(a => a.addEventListener('click', cerrarMenu));

// =========================================================
// BOTÓN VOLVER ARRIBA — se crea por JS para no repetir
// el markup en cada página, aparece tras hacer scroll.
// =========================================================
const btnBackToTop = document.createElement('button');
btnBackToTop.type = 'button';
btnBackToTop.className = 'back-to-top';
btnBackToTop.id = 'btn-back-to-top';
btnBackToTop.setAttribute('aria-label', 'Volver arriba');
btnBackToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
document.body.appendChild(btnBackToTop);
btnBackToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', () => {
  btnBackToTop.classList.toggle('is-visible', window.scrollY > 500);
});

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
// BUSCADOR MOBILE — el icono de lupa expande el buscador
// en vez de dejarlo desaparecido sin reemplazo.
// =========================================================
const btnSearchMobile = document.getElementById('btn-search-mobile');
const searchbarEl = document.getElementById('searchbar');
if (btnSearchMobile && searchbarEl) {
  btnSearchMobile.addEventListener('click', () => {
    const abierto = searchbarEl.classList.toggle('is-open');
    btnSearchMobile.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (abierto) {
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }
  });
}

// =========================================================
// BUSCADOR DEL HEADER — ahora sí busca en el catálogo real.
// En productos.html filtra en vivo; en el resto de páginas
// redirige al catálogo con el término precargado.
// =========================================================
const WHATSAPP_NUMERO = "51958345849";
const searchForm = document.getElementById('searchbar');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    const catalogoSearchInput = document.getElementById('catalogo-search');
    if (catalogoSearchInput) {
      catalogoSearchInput.value = query;
      catalogoSearchInput.dispatchEvent(new Event('input'));
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `productos.html?q=${encodeURIComponent(query)}#productos`;
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
  if (!listaEl) return;

  const categorias = {};
  productos.forEach(p => {
    const cat = p.categoria || 'Otros';
    categorias[cat] = (categorias[cat] || 0) + 1;
  });

  const chipsCategorias = Object.keys(categorias).sort().map(cat => `
    <button type="button" class="chip" data-categoria="${cat}">${cat}</button>`).join('');

  listaEl.insertAdjacentHTML('beforeend', chipsCategorias);

  listaEl.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      listaEl.querySelectorAll('.chip').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      FILTRO_CATEGORIA = btn.dataset.categoria;
      renderProductos();
    });
  });
}

function renderProductos() {
  const contenedor = document.getElementById('cards-productos');
  const contador = document.getElementById('productos-count');
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

  if (contador) {
    const total = PRODUCTOS_CACHE.length;
    contador.textContent = (FILTRO_CATEGORIA !== 'todos' || FILTRO_TEXTO)
      ? `${lista.length} de ${total} productos`
      : `${total} productos`;
  }

  if (lista.length === 0) {
    const consultaWa = encodeURIComponent(`Hola Yabar, busco: ${FILTRO_TEXTO || 'un producto que no encuentro en el catálogo'}`);
    contenedor.innerHTML = `
      <div class="cards-empty">
        <p class="cards-empty__title">No encontramos productos con ese filtro</p>
        <p class="cards-empty__sub">Prueba con otra palabra, o pregúntanos directo: seguro lo tenemos igual.</p>
        <a class="btn btn--primary" target="_blank" rel="noopener"
           href="https://wa.me/${WHATSAPP_NUMERO}?text=${consultaWa}">Preguntar por WhatsApp</a>
      </div>`;
    return;
  }

  contenedor.innerHTML = lista.map((p, i) => {
    const nombreProducto = (p.nombre || '').trim() || 'Producto Yabar';
    const esNuevo = i < 3 && FILTRO_CATEGORIA === 'todos' && !FILTRO_TEXTO;
    const badge = esNuevo ? '<span class="card__badge">Nuevo</span>' : '';
    const imgHtml = p.imagenUrl
      ? `<div class="card__img"><img src="${p.imagenUrl}" alt="${nombreProducto}" loading="lazy"></div>`
      : `<div class="card__img card__img--empty"><span>YABAR</span></div>`;
    const unidadLimpia = p.unidad
      ? p.unidad.replace(/^(el|la|los|las)\s+/i, '').replace(/^./, c => c.toUpperCase())
      : '';
    const unidadHtml = unidadLimpia
      ? `<p class="card__unit"><strong>Presentación:</strong> ${unidadLimpia}</p>`
      : '';
    const mensaje = encodeURIComponent(`Hola Yabar, quiero cotizar: ${nombreProducto}`);
    return `
      <article class="card">
        ${imgHtml}
        <div class="card__body">
          ${badge}
          <span class="card__tag">${p.categoria || 'Producto'}</span>
          <h3 class="card__title">${nombreProducto}</h3>
          ${unidadHtml}
          <a class="card__cta--btn" target="_blank" rel="noopener"
             href="https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}">
            Cotizar por WhatsApp <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>`;
  }).join('');
}

const catalogoSearch = document.getElementById('catalogo-search');
if (catalogoSearch) {
  catalogoSearch.addEventListener('input', (e) => {
    FILTRO_TEXTO = e.target.value.trim();
    renderProductos();
  });

  const qParam = new URLSearchParams(window.location.search).get('q');
  if (qParam) {
    catalogoSearch.value = qParam;
    FILTRO_TEXTO = qParam.trim();
  }
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

// =========================================================
// FORMULARIO DE CONTACTO: arma el mensaje y abre WhatsApp
// =========================================================
// =========================================================
// WHATSAPP FLOTANTE: menú de sede (Nasca / Acarí)
// =========================================================
const btnWaFloat = document.getElementById('btn-whatsapp-float');
const waFloatMenu = document.getElementById('wa-float-menu');
if (btnWaFloat && waFloatMenu) {
  btnWaFloat.addEventListener('click', (e) => {
    e.stopPropagation();
    const abierto = waFloatMenu.classList.toggle('is-open');
    btnWaFloat.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (!waFloatMenu.contains(e.target) && e.target !== btnWaFloat) {
      waFloatMenu.classList.remove('is-open');
      btnWaFloat.setAttribute('aria-expanded', 'false');
    }
  });
}

const mapFrame = document.getElementById('contacto-map-frame');
const mapTabs = document.querySelectorAll('.map-tabs__btn');
const mapSrc = {
  nasca: 'https://www.google.com/maps?q=Carr.+Interoce%C3%A1nica+8450,+Nazca+11401,+Peru&output=embed',
  acari: 'https://www.google.com/maps?q=Calle+Ricardo+Palma+Mz+15+Lote+17,+Acar%C3%AD,+Peru&output=embed'
};
function setMap(sede) {
  if (!mapFrame || !mapSrc[sede]) return;
  mapFrame.src = mapSrc[sede];
  mapTabs.forEach((btn) => {
    const active = btn.dataset.map === sede;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}
mapTabs.forEach((btn) => {
  btn.addEventListener('click', () => setMap(btn.dataset.map));
});
const cfSede = document.getElementById('cf-sede');
if (cfSede) {
  cfSede.addEventListener('change', () => {
    const sedeNombre = cfSede.selectedOptions[0].text.trim().toLowerCase();
    setMap(sedeNombre === 'acarí' ? 'acari' : 'nasca');
  });
}

const formContacto = document.getElementById('form-contacto');
if (formContacto) {
  formContacto.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('cf-nombre').value.trim();
    const telefono = document.getElementById('cf-telefono').value.trim();
    const sede = document.getElementById('cf-sede').value;
    const sedeNombre = document.getElementById('cf-sede').selectedOptions[0].text;
    const motivo = document.getElementById('cf-motivo').value;
    const mensaje = document.getElementById('cf-mensaje').value.trim();

    const texto = `Hola Yabar (sede ${sedeNombre}), soy ${nombre} (tel: ${telefono}).\nMotivo: ${motivo}.\n${mensaje}`;
    const url = `https://wa.me/${sede}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
}