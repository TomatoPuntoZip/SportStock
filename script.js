// script.js - SportStock - Gestor de Inventario Deportivo (v2)

// ─── Storage keys ─────────────────────────────────────────────────────────────
const STORAGE_KEY  = 'sportstock_users';
const PRODUCTS_KEY = 'sportstock_products';
const SESSION_KEY  = 'sportstock_session';
const REQUESTS_KEY = 'sportstock_requests';

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const loginScreen        = document.getElementById('loginScreen');
const adminScreen        = document.getElementById('adminScreen');
const userScreen         = document.getElementById('userScreen');
const topbar             = document.getElementById('topbar');
const roleBadge          = document.getElementById('roleBadge');
const topbarSubtitle     = document.getElementById('topbarSubtitle');
const loginForm          = document.getElementById('loginForm');
const loginError         = document.getElementById('loginError');
const logoutBtn          = document.getElementById('logoutBtn');
const sidebarLogoutBtn   = document.getElementById('sidebarLogoutBtn');
const sidebarLinks       = document.querySelectorAll('.sidebar-link');
const openAddBtn         = document.getElementById('openAddBtn');
const adminSearchInput   = document.getElementById('adminSearchInput');
const userSearchInput    = document.getElementById('userSearchInput');
const usersSearchInput   = document.getElementById('usersSearchInput');
const inventorySummary   = document.getElementById('inventorySummary');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const requestTableBody   = document.getElementById('requestTableBody');
const requestSummary     = document.getElementById('requestSummary');
const userList           = document.getElementById('userList');
const userEmpty          = document.getElementById('userEmpty');
const profileName        = document.getElementById('profileName');
const profileRole        = document.getElementById('profileRole');
const productModal       = document.getElementById('productModal');
const closeModalBtn      = document.getElementById('closeModalBtn');
const cancelModalBtn     = document.getElementById('cancelModalBtn');
const productForm        = document.getElementById('productForm');
const productNameInput   = document.getElementById('productName');
const productCategorySelect = document.getElementById('productCategory');
const productAmountInput = document.getElementById('productAmount');
const productStatusSelect= document.getElementById('productStatus');
const productError       = document.getElementById('productError');
const modalTitle         = document.getElementById('modalTitle');
const toast              = document.getElementById('toast');
const registerForm       = document.getElementById('registerForm');
const registerError      = document.getElementById('registerError');
const registerSuccess    = document.getElementById('registerSuccess');
const toggleToRegister   = document.getElementById('toggleToRegister');
const toggleToLogin      = document.getElementById('toggleToLogin');
const adminNotification  = document.getElementById('adminNotification');
const notificationText   = document.getElementById('notificationText');
const requestConfirmModal= document.getElementById('requestConfirmModal');
const requestConfirmMessage = document.getElementById('requestConfirmMessage');
const closeRequestConfirmBtn = document.getElementById('closeRequestConfirmBtn');
const closeRequestConfirmActionBtn = document.getElementById('closeRequestConfirmActionBtn');
const exportCsvBtn       = document.getElementById('exportCsvBtn');
const rentalFilterTabs   = document.getElementById('rentalFilterTabs');
// Rent modal
const rentModal          = document.getElementById('rentModal');
const closeRentModalBtn  = document.getElementById('closeRentModalBtn');
const cancelRentModalBtn = document.getElementById('cancelRentModalBtn');
const rentForm           = document.getElementById('rentForm');
const rentAmount         = document.getElementById('rentAmount');
const rentDateStart      = document.getElementById('rentDateStart');
const rentDateEnd        = document.getElementById('rentDateEnd');
const rentError          = document.getElementById('rentError');
const rentModalProductInfo = document.getElementById('rentModalProductInfo');
const rentModalStock     = document.getElementById('rentModalStock');
// Review modal
const reviewModal        = document.getElementById('reviewModal');
const closeReviewModalBtn= document.getElementById('closeReviewModalBtn');
const closeReviewModalBtn2=document.getElementById('closeReviewModalBtn2');
const reviewComment      = document.getElementById('reviewComment');
const reviewModalInfo    = document.getElementById('reviewModalInfo');
const approveReviewBtn   = document.getElementById('approveReviewBtn');
const rejectReviewBtn    = document.getElementById('rejectReviewBtn');
// User history
const toggleUserHistoryBtn = document.getElementById('toggleUserHistoryBtn');
const userHistorySection   = document.getElementById('userHistorySection');
const userHistoryTableBody = document.getElementById('userHistoryTableBody');
const userHistorySummary   = document.getElementById('userHistorySummary');

// ─── State ────────────────────────────────────────────────────────────────────
const authUsers     = loadUsersFromStorage();
let products        = loadProductsFromStorage();
let rentalRequests  = loadRequestsFromStorage();
let currentRole     = null;
let currentUser     = null;
let currentUsername = null;
let currentProductId= null;
let isEditing       = false;
let rentingProductId= null;
let reviewingRequestId = null;
let activeRentalFilter = 'Todos';

// ─── Storage: Users ───────────────────────────────────────────────────────────
function loadUsersFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { return JSON.parse(raw); } catch { localStorage.removeItem(STORAGE_KEY); } }
  const defaults = {
    admin: { username:'admin', email:'admin@sportstock.local', password:'admin123', role:'ADMIN', displayName:'Administrador' },
    user:  { username:'user',  email:'user@sportstock.local',  password:'user123',  role:'USUARIO', displayName:'Usuario estándar' }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}
function saveUsersToStorage() { localStorage.setItem(STORAGE_KEY, JSON.stringify(authUsers)); }

// ─── Storage: Products ────────────────────────────────────────────────────────
function loadProductsFromStorage() {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p)) return p; } catch { localStorage.removeItem(PRODUCTS_KEY); } }
  const defaults = [
    { id:1, name:'Balón de fútbol profesional', category:'Balones',    amount:12, status:'Disponible' },
    { id:2, name:'Camiseta de entrenamiento',   category:'Camisetas',  amount:24, status:'Disponible' },
    { id:3, name:'Guayos de césped',            category:'Guayos',     amount:8,  status:'Disponible' },
    { id:4, name:'Protector de espinillas',     category:'Protección', amount:0,  status:'Agotado'    },
    { id:5, name:'Medias deportivas',           category:'Accesorios', amount:40, status:'Disponible' }
  ];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaults));
  return defaults;
}
function saveProductsToStorage() { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }

// ─── Storage: Session ─────────────────────────────────────────────────────────
function loadSessionFromStorage() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    if (!session?.username) { localStorage.removeItem(SESSION_KEY); return null; }
    const user = authUsers[session.username.toLowerCase()];
    if (!user) { localStorage.removeItem(SESSION_KEY); return null; }
    currentUser = user.displayName; currentUsername = user.username; currentRole = user.role;
    return session;
  } catch { localStorage.removeItem(SESSION_KEY); return null; }
}
function saveSessionToStorage(username) { localStorage.setItem(SESSION_KEY, JSON.stringify({ username: username.toLowerCase() })); }
function clearSessionStorage() { localStorage.removeItem(SESSION_KEY); }

// ─── Storage: Requests ────────────────────────────────────────────────────────
function loadRequestsFromStorage() {
  const raw = localStorage.getItem(REQUESTS_KEY);
  if (raw) { try { const r = JSON.parse(raw); if (Array.isArray(r)) return r; } catch { localStorage.removeItem(REQUESTS_KEY); } }
  localStorage.setItem(REQUESTS_KEY, JSON.stringify([]));
  return [];
}
function saveRequestsToStorage() { localStorage.setItem(REQUESTS_KEY, JSON.stringify(rentalRequests)); }

// ─── Utils ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(message, type = 'default') {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast show toast-${type}`;
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2800);
}

function getPendingRequests() { return rentalRequests.filter(r => r.status === 'Pendiente'); }

function getProductPendingRequest(productId) {
  return rentalRequests.find(r => r.productId === productId && r.username === currentUsername && r.status === 'Pendiente');
}

function getFilteredProducts(query) {
  const lower = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower) ||
    p.status.toLowerCase().includes(lower)
  );
}

function getFilteredUsers(query) {
  const all = Object.values(authUsers);
  if (!query) return all;
  const lower = query.toLowerCase();
  return all.filter(u =>
    u.username.toLowerCase().includes(lower) ||
    u.email.toLowerCase().includes(lower) ||
    u.role.toLowerCase().includes(lower) ||
    u.displayName.toLowerCase().includes(lower)
  );
}

function formatDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}

function timeSince(isoStr) {
  if (!isoStr) return '—';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days > 0)  return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (mins > 0)  return `hace ${mins}min`;
  return 'ahora';
}

function statusBadgeHtml(status) {
  const map = {
    'Pendiente': 'badge-warning',
    'Aprobado':  'badge-success',
    'Rechazado': 'badge-danger',
    'Devuelto':  'badge-neutral',
  };
  return `<span class="status-badge ${map[status] || 'badge-neutral'}">${status}</span>`;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function switchScreen(role) {
  loginScreen.classList.add('hidden');
  topbar.classList.remove('hidden');
  if (role === 'ADMIN') {
    adminScreen.classList.remove('hidden');
    userScreen.classList.add('hidden');
    topbarSubtitle.textContent = 'Dashboard administrativo';
    roleBadge.textContent = 'ADMIN';
    profileName.textContent = currentUser;
    profileRole.textContent = 'ADMIN';
    bellWrapper.classList.remove('hidden');
    renderAdminInventory();
    renderAdminStats();
    renderAdminRentals();
    updateBellNotifications();
  } else {
    adminScreen.classList.add('hidden');
    userScreen.classList.remove('hidden');
    topbarSubtitle.textContent = 'Vista de usuario';
    roleBadge.textContent = 'USUARIO';
    bellWrapper.classList.add('hidden');
    renderUserList();
    renderUserHistory();
  }
}

function resetView() {
  loginScreen.classList.remove('hidden');
  adminScreen.classList.add('hidden');
  userScreen.classList.add('hidden');
  topbar.classList.add('hidden');
  setActivePanel('adminInventory');
  loginForm.reset(); registerForm.reset();
  loginError.textContent = ''; registerError.textContent = ''; registerSuccess.textContent = '';
  showLoginForm();
}

function setActivePanel(panelId) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.toggle('hidden', p.id !== panelId));
  sidebarLinks.forEach(link => {
    if (link.dataset.panel) link.classList.toggle('active', link.dataset.panel === panelId);
  });
  if (panelId === 'adminUsers')   renderUsersPanel();
  if (panelId === 'adminRentals') renderAdminRentals();
}

function logout() {
  currentRole = currentUser = currentUsername = null;
  clearSessionStorage();
  resetView();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function loginUser(username, password) {
  if (!username || !password) { loginError.textContent = 'Ambos campos son obligatorios.'; return; }
  const user = authUsers[username.toLowerCase()];
  if (!user || user.password !== password) { loginError.textContent = 'Credenciales incorrectas.'; return; }
  currentUser = user.displayName; currentUsername = user.username; currentRole = user.role;
  saveSessionToStorage(username);
  loginError.textContent = '';
  showToast(`Bienvenido, ${currentUser}`, 'success');
  switchScreen(currentRole);
}

function registerUser(event) {
  event.preventDefault();
  const username        = document.getElementById('registerUsername').value.trim().toLowerCase();
  const email           = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password        = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  registerError.textContent = ''; registerSuccess.textContent = '';
  if (!username || !email || !password || !confirmPassword) { registerError.textContent = 'Completa todos los campos.'; return; }
  if (!email.includes('@') || !email.includes('.'))          { registerError.textContent = 'Ingresa un email válido.'; return; }
  if (password !== confirmPassword)                          { registerError.textContent = 'Las contraseñas no coinciden.'; return; }
  if (authUsers[username])                                   { registerError.textContent = 'El usuario ya existe.'; return; }
  if (Object.values(authUsers).some(u => u.email === email)) { registerError.textContent = 'Ese email ya está registrado.'; return; }
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);
  authUsers[username] = { username, email, password, role: 'USUARIO', displayName };
  saveUsersToStorage();
  registerForm.reset();
  showToast(`Cuenta creada para ${displayName}. Inicia sesión.`, 'success');
  showLoginForm();
}

function showRegisterForm() {
  loginForm.classList.add('hidden'); registerForm.classList.remove('hidden');
  loginError.textContent = registerError.textContent = registerSuccess.textContent = '';
  document.getElementById('authTitle').textContent    = 'Crear cuenta';
  document.getElementById('authSubtitle').textContent = 'Completa los datos para registrarte.';
}
function showLoginForm() {
  loginForm.classList.remove('hidden'); registerForm.classList.add('hidden');
  loginError.textContent = registerError.textContent = '';
  document.getElementById('authTitle').textContent    = 'Iniciar sesión';
  document.getElementById('authSubtitle').textContent = 'Ingresa con tu usuario.';
}

// ─── Admin: Stats ─────────────────────────────────────────────────────────────
function renderAdminStats() {
  document.getElementById('statTotal').textContent      = products.length;
  document.getElementById('statAvailable').textContent  = products.filter(p => p.status === 'Disponible').length;
  document.getElementById('statOut').textContent        = products.filter(p => p.status === 'Agotado').length;
  document.getElementById('statCategories').textContent = new Set(products.map(p => p.category)).size;
}

// ─── Admin: Inventory ─────────────────────────────────────────────────────────
function renderAdminInventory() {
  const filtered = getFilteredProducts(adminSearchInput.value.trim());
  inventoryTableBody.innerHTML = '';
  if (filtered.length === 0) {
    inventoryTableBody.innerHTML = '<tr><td colspan="5" class="empty-row">No hay productos para mostrar.</td></tr>';
  } else {
    filtered.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${product.name}</strong></td>
        <td><span class="category-tag">${product.category}</span></td>
        <td>${product.amount}</td>
        <td>${statusBadgeHtml(product.status === 'Disponible' ? 'Aprobado' : product.status === 'Agotado' ? 'Rechazado' : 'Pendiente').replace(product.status === 'Disponible' ? 'Aprobado' : product.status === 'Agotado' ? 'Rechazado' : 'Pendiente', product.status)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary" data-action="edit"   data-id="${product.id}">Editar</button>
            <button class="btn btn-danger"    data-action="delete" data-id="${product.id}">Eliminar</button>
          </div>
        </td>`;
      row.querySelector('[data-action="edit"]').addEventListener('click',   () => openModal(true, product.id));
      row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteProduct(product.id));
      inventoryTableBody.appendChild(row);
    });
  }
  inventorySummary.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;
}

// ─── Admin: Rentals panel ─────────────────────────────────────────────────────
function renderAdminRentals() {
  const filtered = activeRentalFilter === 'Todos'
    ? rentalRequests
    : rentalRequests.filter(r => r.status === activeRentalFilter);

  // Stats
  document.getElementById('statTotalRequests').textContent    = rentalRequests.length;
  document.getElementById('statPendingRequests').textContent  = rentalRequests.filter(r => r.status === 'Pendiente').length;
  document.getElementById('statApprovedRequests').textContent = rentalRequests.filter(r => r.status === 'Aprobado').length;
  document.getElementById('statReturnedRequests').textContent = rentalRequests.filter(r => r.status === 'Devuelto').length;

  requestTableBody.innerHTML = '';
  if (filtered.length === 0) {
    requestTableBody.innerHTML = '<tr><td colspan="7" class="empty-row">No hay solicitudes en esta categoría.</td></tr>';
  } else {
    [...filtered].reverse().forEach(req => {
      const row = document.createElement('tr');
      const pendingTime = req.status === 'Pendiente' ? `<span class="time-pending">${timeSince(req.createdAt)}</span>` : timeSince(req.createdAt);
      const fechas = req.dateStart
        ? `<span style="font-size:0.78rem;">${formatDate(req.dateStart)}<br>→ ${formatDate(req.dateEnd)}</span>`
        : '<span style="color:var(--text-muted);font-size:0.78rem;">—</span>';

      let actions = '<span class="status-label">—</span>';
      if (req.status === 'Pendiente') {
        actions = `<button class="btn btn-primary btn-sm" data-action="review" data-id="${req.id}">Revisar</button>`;
      } else if (req.status === 'Aprobado') {
        actions = `<button class="btn btn-secondary btn-sm" data-action="return" data-id="${req.id}">Marcar devuelto</button>`;
      }

      row.innerHTML = `
        <td><strong>${req.productName}</strong></td>
        <td>${req.displayName}</td>
        <td>${req.amount}</td>
        <td>${fechas}</td>
        <td>${pendingTime}</td>
        <td>${statusBadgeHtml(req.status)}</td>
        <td>
          <div class="table-actions">
            ${actions}
            ${req.adminComment ? `<span class="comment-icon" title="${req.adminComment}">💬</span>` : ''}
          </div>
        </td>`;

      row.querySelector('[data-action="review"]')?.addEventListener('click', () => openReviewModal(req.id));
      row.querySelector('[data-action="return"]')?.addEventListener('click', () => markReturned(req.id));
      requestTableBody.appendChild(row);
    });
  }

  const pending = getPendingRequests().length;
  requestSummary.textContent = `${filtered.length} solicitud${filtered.length !== 1 ? 'es' : ''}`;
  adminNotification.classList.toggle('hidden', pending === 0);
  notificationText.textContent = pending > 0
    ? `⚠ Hay ${pending} solicitud${pending !== 1 ? 'es' : ''} pendiente${pending !== 1 ? 's' : ''} sin revisar.`
    : '';
}

// ─── Admin: Review modal ──────────────────────────────────────────────────────
function openReviewModal(requestId) {
  reviewingRequestId = requestId;
  const req = rentalRequests.find(r => r.id === requestId);
  if (!req) return;
  const product = products.find(p => p.id === req.productId);
  reviewModalInfo.innerHTML = `
    <strong>${req.productName}</strong> — ${req.amount} unidad${req.amount !== 1 ? 'es' : ''}<br>
    Usuario: <strong>${req.displayName}</strong><br>
    Fechas: ${formatDate(req.dateStart)} → ${formatDate(req.dateEnd)}<br>
    Stock disponible: <strong>${product ? product.amount : '—'}</strong>
  `;
  reviewComment.value = '';
  reviewModal.classList.remove('hidden');
}

function closeReviewModal() { reviewModal.classList.add('hidden'); reviewingRequestId = null; }

function approveRentalRequest(requestId) {
  const req = rentalRequests.find(r => r.id === requestId);
  if (!req) return;
  const product = products.find(p => p.id === req.productId);
  if (!product || product.amount < req.amount) {
    showToast('Stock insuficiente para aprobar esta solicitud.', 'error');
    closeReviewModal();
    renderAdminRentals();
    return;
  }
  product.amount -= req.amount;
  if (product.amount <= 0) { product.amount = 0; product.status = 'Agotado'; }
  req.status = 'Aprobado';
  req.adminComment = reviewComment.value.trim();
  req.resolvedAt = new Date().toISOString();
  saveProductsToStorage(); saveRequestsToStorage();
  showToast(`Solicitud aprobada: ${product.name}`, 'success');
  closeReviewModal();
  renderAdminInventory(); renderAdminRentals(); renderAdminStats();
  updateBellNotifications();
}

function rejectRentalRequest(requestId) {
  const req = rentalRequests.find(r => r.id === requestId);
  if (!req) return;
  req.status = 'Rechazado';
  req.adminComment = reviewComment.value.trim();
  req.resolvedAt = new Date().toISOString();
  saveRequestsToStorage();
  showToast('Solicitud rechazada.', 'error');
  closeReviewModal();
  renderAdminRentals();
  updateBellNotifications();
}

function markReturned(requestId) {
  const req = rentalRequests.find(r => r.id === requestId);
  if (!req) return;
  if (!confirm(`¿Confirmar devolución de "${req.productName}" (${req.amount} unid.)?`)) return;
  const product = products.find(p => p.id === req.productId);
  if (product) {
    product.amount += req.amount;
    if (product.status === 'Agotado' && product.amount > 0) product.status = 'Disponible';
    saveProductsToStorage();
  }
  req.status = 'Devuelto';
  req.returnedAt = new Date().toISOString();
  saveRequestsToStorage();
  showToast(`Devolución registrada: ${req.productName}`, 'success');
  renderAdminRentals(); renderAdminInventory(); renderAdminStats();
  updateBellNotifications();
}

// ─── Admin: Users ─────────────────────────────────────────────────────────────
function renderUsersPanel() {
  const query    = usersSearchInput.value.trim();
  const filtered = getFilteredUsers(query);
  const all      = Object.values(authUsers);
  const tbody    = document.getElementById('usersTableBody');
  document.getElementById('statTotalUsers').textContent    = all.length;
  document.getElementById('statAdminUsers').textContent    = all.filter(u => u.role === 'ADMIN').length;
  document.getElementById('statStandardUsers').textContent = all.filter(u => u.role === 'USUARIO').length;
  document.getElementById('usersSummary').textContent      = `${filtered.length} usuario${filtered.length !== 1 ? 's' : ''}`;
  tbody.innerHTML = '';
  if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No se encontraron usuarios.</td></tr>'; return; }
  filtered.forEach(u => {
    const isSelf = u.username === currentUsername;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${u.username}</td>
      <td>${u.displayName}</td>
      <td>${u.email}</td>
      <td><span class="role-badge ${u.role === 'ADMIN' ? '' : 'role-badge-user'}">${u.role}</span></td>
      <td>
        <div class="table-actions">
          ${!isSelf
            ? `<button class="btn btn-danger btn-sm" data-delete-user="${u.username}">Eliminar</button>`
            : '<span class="status-label">Tú</span>'}
        </div>
      </td>`;
    row.querySelector('[data-delete-user]')?.addEventListener('click', () => deleteUser(u.username));
    tbody.appendChild(row);
  });
}

function deleteUser(username) {
  const user = authUsers[username];
  if (!user) return;
  if (!confirm(`¿Eliminar al usuario "${user.displayName}"? Esta acción no se puede deshacer.`)) return;
  delete authUsers[username];
  saveUsersToStorage();
  showToast(`Usuario "${user.displayName}" eliminado.`);
  renderUsersPanel();
}

// ─── User: Product list ───────────────────────────────────────────────────────
function renderUserList() {
  const filtered = getFilteredProducts(userSearchInput.value.trim());
  userList.innerHTML = '';
  if (filtered.length === 0) { userEmpty.classList.remove('hidden'); return; }
  userEmpty.classList.add('hidden');
  filtered.forEach((product, i) => {
    const isAvailable       = product.status === 'Disponible' && product.amount > 0;
    const hasPending        = currentUsername && getProductPendingRequest(product.id);
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div>
        <span class="product-badge">${product.category}</span>
        <h3>${product.name}</h3>
      </div>
      <div class="product-meta">
        <span>Cantidad <strong>${product.amount}</strong></span>
        <span>Estado <strong>${product.status}</strong></span>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary" data-rent-id="${product.id}" ${!isAvailable || hasPending ? 'disabled' : ''}>
          ${hasPending ? '⏳ Solicitud enviada' : isAvailable ? 'Solicitar alquiler' : 'No disponible'}
        </button>
      </div>`;
    userList.appendChild(card);
  });
  renderUserHistory();
}

// ─── User: History ────────────────────────────────────────────────────────────
function renderUserHistory() {
  if (!currentUsername) return;
  const myRequests = rentalRequests.filter(r => r.username === currentUsername);
  userHistorySummary.textContent = `${myRequests.length} alquiler${myRequests.length !== 1 ? 'es' : ''}`;
  userHistoryTableBody.innerHTML = myRequests.length === 0
    ? '<tr><td colspan="5" class="empty-row">Aún no tienes alquileres registrados.</td></tr>'
    : [...myRequests].reverse().map(r => `
        <tr>
          <td><strong>${r.productName}</strong></td>
          <td>${r.amount}</td>
          <td style="font-size:0.8rem;">${formatDate(r.dateStart)}<br>→ ${formatDate(r.dateEnd)}</td>
          <td>${statusBadgeHtml(r.status)}</td>
          <td style="font-size:0.82rem;color:var(--text-muted);">${r.adminComment || '—'}</td>
        </tr>`).join('');
}

function toggleUserHistory() {
  const isOpen = userHistorySection.classList.contains('panel-open');
  if (isOpen) {
    userHistorySection.classList.remove('panel-open');
    toggleUserHistoryBtn.textContent = 'Mi historial';
  } else {
    renderUserHistory();
    userHistorySection.classList.add('panel-open');
    toggleUserHistoryBtn.textContent = 'Ocultar historial';
    userHistorySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ─── Rent modal ───────────────────────────────────────────────────────────────
function openRentModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.status !== 'Disponible' || product.amount === 0) {
    showToast('Este producto no está disponible.', 'error'); return;
  }
  if (!currentUsername) { showToast('Debes iniciar sesión.', 'error'); return; }
  if (getProductPendingRequest(productId)) { showToast('Ya tienes una solicitud pendiente para este producto.', 'error'); return; }
  rentingProductId = productId;
  rentModalProductInfo.textContent = product.name;
  rentModalStock.textContent = `Stock disponible: ${product.amount} unidades`;
  rentAmount.max   = product.amount;
  rentAmount.value = 1;
  rentDateStart.min = todayStr();
  rentDateStart.value = todayStr();
  rentDateEnd.min   = todayStr();
  rentDateEnd.value = '';
  rentError.textContent = '';
  rentModal.classList.remove('hidden');
}

function closeRentModal() { rentModal.classList.add('hidden'); rentingProductId = null; }

function submitRentRequest(e) {
  e.preventDefault();
  const product = products.find(p => p.id === rentingProductId);
  if (!product) return;
  const amount = Number(rentAmount.value);
  const dateStart = rentDateStart.value;
  const dateEnd   = rentDateEnd.value;
  rentError.textContent = '';
  if (!amount || amount < 1)              { rentError.textContent = 'Ingresa una cantidad válida.'; return; }
  if (amount > product.amount)            { rentError.textContent = `Solo hay ${product.amount} unidades disponibles.`; return; }
  if (!dateStart)                         { rentError.textContent = 'Selecciona la fecha de inicio.'; return; }
  if (!dateEnd)                           { rentError.textContent = 'Selecciona la fecha de devolución.'; return; }
  if (new Date(dateEnd) <= new Date(dateStart)) { rentError.textContent = 'La devolución debe ser después del inicio.'; return; }
  const nextId = rentalRequests.length ? Math.max(...rentalRequests.map(r => r.id)) + 1 : 1;
  rentalRequests.push({
    id: nextId, productId: product.id, productName: product.name,
    username: currentUsername, displayName: currentUser,
    amount, dateStart, dateEnd,
    status: 'Pendiente', createdAt: new Date().toISOString(),
    adminComment: ''
  });
  saveRequestsToStorage();
  closeRentModal();
  requestConfirmMessage.textContent = `Tu solicitud de ${amount} unidad${amount !== 1 ? 'es' : ''} de "${product.name}" fue enviada. El administrador la revisará pronto.`;
  requestConfirmModal.classList.remove('hidden');
  renderUserList();
}

// ─── Product modal ────────────────────────────────────────────────────────────
function openModal(edit = false, productId = null) {
  isEditing = edit; currentProductId = productId;
  productForm.reset(); productError.textContent = '';
  if (edit) {
    modalTitle.textContent = 'Editar producto';
    const p = products.find(p => p.id === productId);
    if (!p) return;
    productNameInput.value       = p.name;
    productCategorySelect.value  = p.category;
    productAmountInput.value     = p.amount;
    productStatusSelect.value    = p.status;
  } else {
    modalTitle.textContent   = 'Agregar producto';
    productAmountInput.value = 1;
  }
  productModal.classList.remove('hidden');
}

function closeModal() { productModal.classList.add('hidden'); isEditing = false; currentProductId = null; }

function deleteProduct(productId) {
  const p = products.find(p => p.id === productId);
  if (!p) return;
  if (!confirm(`¿Eliminar "${p.name}" del inventario?`)) return;
  products.splice(products.findIndex(p => p.id === productId), 1);
  saveProductsToStorage();
  renderAdminInventory(); renderAdminStats();
  showToast('Producto eliminado.');
}

function saveProduct(event) {
  event.preventDefault();
  const name     = productNameInput.value.trim();
  const category = productCategorySelect.value;
  const amount   = Number(productAmountInput.value);
  const status   = productStatusSelect.value;
  if (!name || !category || !status || Number.isNaN(amount) || amount < 0) {
    productError.textContent = 'Completa todos los campos correctamente.'; return;
  }
  productError.textContent = '';
  if (isEditing && currentProductId !== null) {
    const p = products.find(p => p.id === currentProductId);
    if (p) { Object.assign(p, { name, category, amount, status }); saveProductsToStorage(); showToast('Producto actualizado.', 'success'); }
  } else {
    const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: nextId, name, category, amount, status });
    saveProductsToStorage();
    showToast('Producto agregado.', 'success');
  }
  closeModal();
  renderAdminInventory(); renderAdminStats();
}

// ─── Export CSV ───────────────────────────────────────────────────────────────
function exportCsv() {
  const headers = ['ID','Producto','Usuario','Cantidad','Fecha inicio','Fecha devolución','Estado','Comentario admin','Creado'];
  const rows = rentalRequests.map(r => [
    r.id, r.productName, r.displayName, r.amount,
    r.dateStart || '', r.dateEnd || '',
    r.status, r.adminComment || '', formatDate(r.createdAt)
  ]);
  const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `sportstock_alquileres_${todayStr()}.csv`;
  a.click(); URL.revokeObjectURL(url);
  showToast('CSV exportado correctamente.', 'success');
}

// ─── Event listeners ──────────────────────────────────────────────────────────
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  loginUser(document.getElementById('username').value.trim(), document.getElementById('password').value.trim());
});
registerForm.addEventListener('submit', registerUser);
toggleToRegister.addEventListener('click', showRegisterForm);
toggleToLogin.addEventListener('click', showLoginForm);

openAddBtn.addEventListener('click', () => openModal(false));
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);
productModal.addEventListener('click', e => { if (e.target === productModal) closeModal(); });
productForm.addEventListener('submit', saveProduct);

adminSearchInput.addEventListener('input', renderAdminInventory);
userSearchInput.addEventListener('input', renderUserList);
usersSearchInput.addEventListener('input', renderUsersPanel);

// Rent modal
rentForm.addEventListener('submit', submitRentRequest);
closeRentModalBtn.addEventListener('click', closeRentModal);
cancelRentModalBtn.addEventListener('click', closeRentModal);
rentModal.addEventListener('click', e => { if (e.target === rentModal) closeRentModal(); });
rentDateStart.addEventListener('change', () => { rentDateEnd.min = rentDateStart.value; });

// Delegación: botones de alquiler en cards
userList.addEventListener('click', e => {
  const btn = e.target.closest('[data-rent-id]');
  if (!btn || btn.disabled) return;
  openRentModal(Number(btn.dataset.rentId));
});

// Confirm modal
requestConfirmModal.addEventListener('click', e => { if (e.target === requestConfirmModal) requestConfirmModal.classList.add('hidden'); });
closeRequestConfirmBtn.addEventListener('click', () => requestConfirmModal.classList.add('hidden'));
closeRequestConfirmActionBtn.addEventListener('click', () => requestConfirmModal.classList.add('hidden'));

// Review modal
approveReviewBtn.addEventListener('click', () => approveRentalRequest(reviewingRequestId));
rejectReviewBtn.addEventListener('click',  () => rejectRentalRequest(reviewingRequestId));
closeReviewModalBtn.addEventListener('click',  closeReviewModal);
closeReviewModalBtn2.addEventListener('click', closeReviewModal);
reviewModal.addEventListener('click', e => { if (e.target === reviewModal) closeReviewModal(); });

// Rental filter tabs
rentalFilterTabs.addEventListener('click', e => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  activeRentalFilter = tab.dataset.filter;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t === tab));
  renderAdminRentals();
});

// Sidebar
sidebarLinks.forEach(link => {
  if (link.dataset.panel) link.addEventListener('click', () => setActivePanel(link.dataset.panel));
});

logoutBtn.addEventListener('click', logout);
sidebarLogoutBtn.addEventListener('click', logout);
exportCsvBtn.addEventListener('click', exportCsv);
toggleUserHistoryBtn.addEventListener('click', toggleUserHistory);

// ─── Bell notification ────────────────────────────────────────────────────────
const bellWrapper  = document.getElementById('bellWrapper');
const bellBtn      = document.getElementById('bellBtn');
const bellCount    = document.getElementById('bellCount');
const bellDropdown = document.getElementById('bellDropdown');
const bellList     = document.getElementById('bellList');
const bellViewAll  = document.getElementById('bellViewAll');
const sidebarBadge = document.getElementById('sidebarBadge');

function updateBellNotifications() {
  const pending = getPendingRequests();
  const count   = pending.length;

  // Badge sidebar
  sidebarBadge.textContent = count;
  sidebarBadge.classList.toggle('hidden', count === 0);

  // Campanita topbar
  bellCount.textContent = count;
  bellCount.classList.toggle('hidden', count === 0);
  bellBtn.classList.toggle('bell-has-notifications', count > 0);

  // Lista del dropdown
  bellList.innerHTML = count === 0
    ? '<li class="empty-bell">Sin solicitudes pendientes</li>'
    : pending.slice(0, 5).map(r => `
        <li>
          <strong>${r.productName}</strong> — ${r.amount} unid.
          <span>${r.displayName} · ${timeSince(r.createdAt)}</span>
        </li>`).join('') + (pending.length > 5 ? `<li style="text-align:center;color:var(--text-muted);font-size:0.82rem;">+${pending.length - 5} más...</li>` : '');
}

bellBtn.addEventListener('click', e => {
  e.stopPropagation();
  bellDropdown.classList.toggle('hidden');
});

bellViewAll.addEventListener('click', () => {
  bellDropdown.classList.add('hidden');
  setActivePanel('adminRentals');
});

document.addEventListener('click', e => {
  if (!bellWrapper.contains(e.target)) bellDropdown.classList.add('hidden');
});

// ─── Init ─────────────────────────────────────────────────────────────────────
if (loadSessionFromStorage()) { switchScreen(currentRole); } else { resetView(); }