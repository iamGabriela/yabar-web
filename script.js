// --- DATOS DE PRUEBA (Mantenemos la lógica de negocio simulada) ---
const PRODUCTS_DATA = [
  { id: 1, name: 'Barra de Construcción 3/8"', brand: 'Aceros Arequipa', category: 'barras', measure: '9m', price: 32.50, stock: 150, branch: 'ambas' },
  { id: 2, name: 'Barra de Construcción 1/2"', brand: 'Aceros Arequipa', category: 'barras', measure: '9m', price: 45.80, stock: 85, branch: 'nasca' },
  { id: 3, name: 'Ladrillo Pandereta', brand: 'Pirámide', category: 'ladrillos', measure: '9x11x23', price: 1.20, stock: 5000, branch: 'ambas' },
  { id: 4, name: 'Ladrillo King Kong 18 Huecos', brand: 'Pirámide', category: 'ladrillos', measure: '9x12.5x23', price: 1.50, stock: 3200, branch: 'acari' },
  { id: 5, name: 'Tubo PVC Luz 5/8"', brand: 'Pavco', category: 'pvc-luz', measure: '3m', price: 8.90, stock: 200, branch: 'nasca' },
  { id: 6, name: 'Tubo PVC Presión C10 1/2"', brand: 'Nicoll', category: 'pvc-c10', measure: '5m', price: 15.20, stock: 120, branch: 'ambas' },
  { id: 7, name: 'Tubo CPVC Agua Caliente 1/2"', brand: 'Pavco', category: 'cpvc', measure: '3m', price: 18.50, stock: 45, branch: 'nasca' },
  { id: 8, name: 'Tubo Desagüe 4"', brand: 'Nicoll', category: 'desague', measure: '3m', price: 28.90, stock: 75, branch: 'acari' },
  { id: 9, name: 'Barra de Construcción 5/8"', brand: 'Aceros Arequipa', category: 'barras', measure: '9m', price: 72.00, stock: 40, branch: 'nasca' },
  { id: 10, name: 'Ladrillo Techo 15', brand: 'Pirámide', category: 'ladrillos', measure: '15x30x30', price: 3.80, stock: 1200, branch: 'ambas' }
];

// --- MAPEO DE IMÁGENES ---
const CATEGORY_IMAGES = {
  'barras': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
  'ladrillos': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
  'pvc-luz': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=400',
  'pvc-c10': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400',
  'cpvc': 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=400',
  'desague': 'https://images.unsplash.com/photo-1590250684049-342084795393?auto=format&fit=crop&q=80&w=400'
};

// --- ESTADO DE LA APP ---
let currentView = 'grid';
let filteredProducts = [...PRODUCTS_DATA];

// --- SELECTORES ---
const catalogContainer = document.getElementById('catalogContainer');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const brandFilter = document.getElementById('brandFilter');
const branchFilter = document.getElementById('branchFilter');
const sortFilter = document.getElementById('sortFilter');
const gridViewBtn = document.getElementById('gridViewBtn');
const tableViewBtn = document.getElementById('tableViewBtn');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');

// --- FUNCIONES DE RENDERIZADO ---
function renderProducts() {
  catalogContainer.innerHTML = '';
  resultsCount.textContent = `${filteredProducts.length} productos encontrados`;

  if (currentView === 'grid') {
    catalogContainer.className = 'grid-view';
    filteredProducts.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-card__image">
          <span class="product-card__badge">${product.branch === 'ambas' ? 'Nasca & Acarí' : product.branch}</span>
          <img src="${CATEGORY_IMAGES[product.category]}" alt="${product.name}">
        </div>
        <div class="product-card__content">
          <span class="product-card__brand">${product.brand}</span>
          <h3 class="product-card__title">${product.name}</h3>
          <p class="product-card__meta">${product.category.replace('-', ' ')} | ${product.measure}</p>
          <div class="product-card__info">
            <div class="info-item">
              <label>Stock</label>
              <span class="${product.stock < 50 ? 'stock-low' : ''}">${product.stock} und</span>
            </div>
            <div class="info-item">
              <label>Sede</label>
              <span>${product.branch}</span>
            </div>
          </div>
          <div class="product-card__price-row">
            <span class="product-card__price">S/ ${product.price.toFixed(2)}</span>
          </div>
          <div class="product-card__actions">
            <button class="btn-icon btn-icon--view">Ver</button>
            <button class="btn-icon btn-icon--edit">Editar</button>
          </div>
        </div>
      `;
      catalogContainer.appendChild(card);
    });
  } else {
    catalogContainer.className = 'table-view';
    const table = document.createElement('table');
    table.className = 'product-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Producto</th>
          <th>Marca</th>
          <th>Medida</th>
          <th>Sede</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${filteredProducts.map(product => `
          <tr>
            <td><img src="${CATEGORY_IMAGES[product.category]}" class="table-img"></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.brand}</td>
            <td>${product.measure}</td>
            <td><span class="product-card__badge" style="position:static">${product.branch}</span></td>
            <td><span class="${product.stock < 50 ? 'stock-low' : ''}">${product.stock}</span></td>
            <td class="table-price">S/ ${product.price.toFixed(2)}</td>
            <td>
              <div style="display:flex; gap:5px">
                <button class="btn-icon btn-icon--view" style="padding:5px 10px">Ver</button>
                <button class="btn-icon btn-icon--edit" style="padding:5px 10px">Edit</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    catalogContainer.appendChild(table);
  }
}

// --- LÓGICA DE FILTROS ---
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const brand = brandFilter.value;
  const branch = branchFilter.value;
  const sortBy = sortFilter.value;

  filteredProducts = PRODUCTS_DATA.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                          product.brand.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || product.category === category;
    const matchesBrand = brand === 'all' || product.brand.toLowerCase().replace(' ', '-') === brand;
    const matchesBranch = branch === 'all' || product.branch === branch || product.branch === 'ambas';

    return matchesSearch && matchesCategory && matchesBrand && matchesBranch;
  });

  // Ordenamiento
  filteredProducts.sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'stock-desc') return b.stock - a.stock;
    return 0;
  });

  renderProducts();
}

// --- EVENT LISTENERS ---
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
brandFilter.addEventListener('change', applyFilters);
branchFilter.addEventListener('change', applyFilters);
sortFilter.addEventListener('change', applyFilters);

gridViewBtn.addEventListener('click', () => {
  currentView = 'grid';
  gridViewBtn.classList.add('active');
  tableViewBtn.classList.remove('active');
  renderProducts();
});

tableViewBtn.addEventListener('click', () => {
  currentView = 'table';
  tableViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');
  renderProducts();
});

mobileMenuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 20) {
    header.style.boxShadow = 'var(--shadow-md)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});