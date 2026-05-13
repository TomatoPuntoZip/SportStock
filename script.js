// script.js - Lógica de gestión de inventario con roles de admin y usuario

const loginScreen = document.getElementById('loginScreen');
const adminScreen = document.getElementById('adminScreen');
const userScreen = document.getElementById('userScreen');
const topbar = document.getElementById('topbar');
const roleBadge = document.getElementById('roleBadge');
const topbarSubtitle = document.getElementById('topbarSubtitle');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const openAddBtn = document.getElementById('openAddBtn');
const adminSearchInput = document.getElementById('adminSearchInput');
const userSearchInput = document.getElementById('userSearchInput');
const inventorySummary = document.getElementById('inventorySummary');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const userList = document.getElementById('userList');
const userEmpty = document.getElementById('userEmpty');
const profileName = document.getElementById('profileName');
const profileRole = document.getElementById('profileRole');
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productCategorySelect = document.getElementById('productCategory');
const productAmountInput = document.getElementById('productAmount');
const productStatusSelect = document.getElementById('productStatus');
const productError = document.getElementById('productError');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');

const authUsers = {
  admin: {
    password: 'admin123',
    role: 'ADMIN',
    displayName: 'Administrador'
  },
  user: {
    password: 'user123',
    role: 'USUARIO',
    displayName: 'Usuario estándar'
  }
};

let currentRole = null;
let currentUser = null;
let currentProductId = null;
let isEditing = false;

const products = [
  { id: 1, name: 'Balón de fútbol profesional', category: 'Balones', amount: 12, status: 'Disponible' },
  { id: 2, name: 'Camiseta de entrenamiento', category: 'Camisetas', amount: 24, status: 'Reservado' },
  { id: 3, name: 'Guayos de césped', category: 'Guayos', amount: 8, status: 'Disponible' },
  { id: 4, name: 'Protector de espinillas', category: 'Protección', amount: 16, status: 'Agotado' },
  { id: 5, name: 'Medias deportivas', category: 'Accesorios', amount: 40, status: 'Disponible' }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function switchScreen(role) {
  loginScreen.classList.add('hidden');
  topbar.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');

  if (role === 'ADMIN') {
    adminScreen.classList.remove('hidden');
    userScreen.classList.add('hidden');
    topbarSubtitle.textContent = 'Dashboard administrativo';
    roleBadge.textContent = 'ADMIN';
    profileName.textContent = currentUser;
    profileRole.textContent = 'ADMIN';
    renderAdminInventory();
    renderAdminStats();
  } else {
    adminScreen.classList.add('hidden');
    userScreen.classList.remove('hidden');
    topbarSubtitle.textContent = 'Vista de usuario';
    roleBadge.textContent = 'USUARIO';
    renderUserList();
  }
}

function resetView() {
  loginScreen.classList.remove('hidden');
  adminScreen.classList.add('hidden');
  userScreen.classList.add('hidden');
  topbar.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  setActivePanel('adminInventory');
  loginForm.reset();
  loginError.textContent = '';
}

function loginUser(username, password) {
  if (!username || !password) {
    loginError.textContent = 'Ambos campos son obligatorios.';
    return;
  }

  const user = authUsers[username.toLowerCase()];
  if (!user || user.password !== password) {
    loginError.textContent = 'Credenciales incorrectas. Usa admin/admin123 o user/user123.';
    return;
  }

  currentUser = user.displayName;
  currentRole = user.role;
  loginError.textContent = '';
  showToast(`Bienvenido ${currentUser}`);
  switchScreen(currentRole);
}

function getFilteredProducts(query) {
  return products.filter((product) => {
    const lower = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(lower) ||
      product.category.toLowerCase().includes(lower) ||
      product.status.toLowerCase().includes(lower)
    );
  });
}

function renderAdminStats() {
  const total = products.length;
  const available = products.filter((product) => product.status === 'Disponible').length;
  const outOfStock = products.filter((product) => product.status === 'Agotado').length;
  const categories = new Set(products.map((product) => product.category)).size;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statAvailable').textContent = available;
  document.getElementById('statOut').textContent = outOfStock;
  document.getElementById('statCategories').textContent = categories;
}

function renderAdminInventory() {
  const query = adminSearchInput.value.trim();
  const filtered = getFilteredProducts(query);
  inventoryTableBody.innerHTML = '';

  if (filtered.length === 0) {
    inventoryTableBody.innerHTML = '<tr><td colspan="5" class="empty-row">No hay productos para mostrar.</td></tr>';
  } else {
    filtered.forEach((product) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.amount}</td>
        <td>${product.status}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary" data-action="edit" data-id="${product.id}">Editar</button>
            <button class="btn btn-danger" data-action="delete" data-id="${product.id}">Eliminar</button>
          </div>
        </td>
      `;

      const editBtn = row.querySelector('[data-action="edit"]');
      const deleteBtn = row.querySelector('[data-action="delete"]');

      editBtn.addEventListener('click', () => openModal(true, product.id));
      deleteBtn.addEventListener('click', () => deleteProduct(product.id));
      inventoryTableBody.appendChild(row);
    });
  }

  inventorySummary.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`;
}

function renderUserList() {
  const query = userSearchInput.value.trim();
  const filtered = getFilteredProducts(query);
  userList.innerHTML = '';

  if (filtered.length === 0) {
    userEmpty.classList.remove('hidden');
    return;
  }

  userEmpty.classList.add('hidden');

  filtered.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div>
        <span class="product-badge">${product.category}</span>
        <h3>${product.name}</h3>
      </div>
      <div class="product-meta">
        <span>Cantidad <strong>${product.amount}</strong></span>
        <span>Estado <strong>${product.status}</strong></span>
      </div>
      <p>Consulta rápida para ver disponibilidad y categoría del producto.</p>
    `;

    userList.appendChild(card);
  });
}

function openModal(edit = false, productId = null) {
  isEditing = edit;
  currentProductId = productId;
  productForm.reset();
  productError.textContent = '';

  if (edit) {
    modalTitle.textContent = 'Editar producto';
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    productNameInput.value = product.name;
    productCategorySelect.value = product.category;
    productAmountInput.value = product.amount;
    productStatusSelect.value = product.status;
  } else {
    modalTitle.textContent = 'Agregar producto';
    productAmountInput.value = 1;
  }

  productModal.classList.remove('hidden');
}

function closeModal() {
  productModal.classList.add('hidden');
  isEditing = false;
  currentProductId = null;
}

function deleteProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const confirmation = confirm(`¿Eliminar "${product.name}" del inventario?`);
  if (!confirmation) return;

  const index = products.findIndex((item) => item.id === productId);
  products.splice(index, 1);
  renderAdminInventory();
  renderUserList();
  renderAdminStats();
  showToast('Producto eliminado correctamente.');
}

function saveProduct(event) {
  event.preventDefault();

  const name = productNameInput.value.trim();
  const category = productCategorySelect.value;
  const amount = Number(productAmountInput.value);
  const status = productStatusSelect.value;

  if (!name || !category || !status || Number.isNaN(amount) || amount < 0) {
    productError.textContent = 'Por favor completa todos los campos correctamente.';
    return;
  }

  productError.textContent = '';

  if (isEditing && currentProductId !== null) {
    const product = products.find((item) => item.id === currentProductId);
    if (product) {
      product.name = name;
      product.category = category;
      product.amount = amount;
      product.status = status;
      showToast('Producto actualizado con éxito.');
    }
  } else {
    const nextId = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;
    products.push({ id: nextId, name, category, amount, status });
    showToast('Producto agregado al inventario.');
  }

  closeModal();
  renderAdminInventory();
  renderUserList();
  renderAdminStats();
}

function setActivePanel(panelId) {
  const panels = document.querySelectorAll('.admin-panel');
  panels.forEach((panel) => panel.classList.toggle('hidden', panel.id !== panelId));

  sidebarLinks.forEach((link) => {
    if (link.dataset.panel) {
      link.classList.toggle('active', link.dataset.panel === panelId);
    }
  });
}

function logout() {
  currentRole = null;
  currentUser = null;
  resetView();
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  loginUser(username, password);
});

openAddBtn.addEventListener('click', () => openModal(false));
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);
productModal.addEventListener('click', (event) => {
  if (event.target === productModal) {
    closeModal();
  }
});
productForm.addEventListener('submit', saveProduct);
adminSearchInput.addEventListener('input', renderAdminInventory);
userSearchInput.addEventListener('input', renderUserList);
logoutBtn.addEventListener('click', logout);
sidebarLogoutBtn.addEventListener('click', logout);

sidebarLinks.forEach((link) => {
  if (link.dataset.panel) {
    link.addEventListener('click', () => setActivePanel(link.dataset.panel));
  }
});

resetView();
renderUserList();
