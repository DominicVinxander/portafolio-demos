/* ============================================================
   FARMAVIDA — Demo de sistema para droguería (datos ficticios)
   Simula el comportamiento del sistema completo con datos de
   ejemplo guardados en memoria (no hay backend real ni pagos
   reales — es una demo de presentación para un cliente).
   ============================================================ */

/* ---------------- DATOS BASE ---------------- */

const ROLE_LABELS = { cliente: 'Cliente', empleado: 'Empleado de Tienda', jefezona: 'Jefe de Zona', jefegeneral: 'Jefe General' };

const PRODUCTOS = [
  { id: 1, nombre: "Paracetamol 500mg x20", cat: "Analgésicos", icon: "💊", precio: 8.50, antes: 10.00 },
  { id: 2, nombre: "Ibuprofeno 400mg x20", cat: "Antiinflamatorios", icon: "💊", precio: 12.00, antes: null },
  { id: 3, nombre: "Amoxicilina 500mg x12", cat: "Antibióticos", icon: "💊", precio: 18.50, antes: null },
  { id: 4, nombre: "Loratadina 10mg x10", cat: "Antialérgicos", icon: "💊", precio: 9.00, antes: 11.00 },
  { id: 5, nombre: "Omeprazol 20mg x14", cat: "Digestivos", icon: "💊", precio: 15.00, antes: null },
  { id: 6, nombre: "Alcohol en gel 250ml", cat: "Cuidado personal", icon: "🧴", precio: 6.50, antes: null },
  { id: 7, nombre: "Mascarillas KN95 (x10)", cat: "Bioseguridad", icon: "😷", precio: 25.00, antes: 32.00 },
  { id: 8, nombre: "Vitamina C 1g x30", cat: "Suplementos", icon: "🍊", precio: 22.00, antes: null },
  { id: 9, nombre: "Suero oral x1L", cat: "Hidratación", icon: "💧", precio: 5.00, antes: null },
  { id: 10, nombre: "Termómetro digital", cat: "Equipos", icon: "🌡️", precio: 28.00, antes: null },
  { id: 11, nombre: "Guantes de látex (x50)", cat: "Bioseguridad", icon: "🧤", precio: 19.90, antes: null },
  { id: 12, nombre: "Jarabe para la tos 120ml", cat: "Respiratorio", icon: "🍯", precio: 14.50, antes: 17.00 },
];

// Pedidos de ejemplo ya existentes en Tienda Huancayo (sin comprobante real, son datos precargados)
const PEDIDOS_TIENDA_BASE = [
  { id: "P-1042", cliente: "Rosa Injante", monto: 42.50, metodo: "Yape", estado: "pendiente", voucher: null, fecha: "27/07/2026 10:14" },
  { id: "P-1041", cliente: "Carlos Meza", monto: 18.50, metodo: "Transferencia", estado: "confirmado", voucher: null, fecha: "26/07/2026 17:02" },
  { id: "P-1040", cliente: "Ana Suárez", monto: 63.00, metodo: "Plin", estado: "confirmado", voucher: null, fecha: "26/07/2026 09:41" },
  { id: "P-1039", cliente: "José Aliaga", monto: 25.00, metodo: "QR", estado: "pendiente", voucher: null, fecha: "25/07/2026 15:30" },
];
let pedidosDinamicos = []; // pedidos generados en vivo desde el checkout del cliente

// Tiendas de Zona Centro, con detalle de empleados (para reportes cruzados)
const TIENDAS_ZONA_CENTRO = [
  { nombre: "Tienda Huancayo", empleados: [
    { nombre: "Carlos Ramírez", ventas: 2840, pedidos: 36 },
    { nombre: "María Quispe", ventas: 2410, pedidos: 31 },
    { nombre: "Luis Fernández", ventas: 1980, pedidos: 27 },
    { nombre: "Diana Torres", ventas: 1190, pedidos: 18 },
  ]},
  { nombre: "Tienda Concepción", empleados: [
    { nombre: "Jorge Salcedo", ventas: 2210, pedidos: 29 },
    { nombre: "Rosa Palomino", ventas: 1770, pedidos: 24 },
  ]},
  { nombre: "Tienda Jauja", empleados: [
    { nombre: "Elena Rojas", ventas: 2580, pedidos: 33 },
    { nombre: "Miguel Ángel Castro", ventas: 2070, pedidos: 26 },
  ]},
  { nombre: "Tienda Tarma", empleados: [
    { nombre: "Patricia Núñez", ventas: 1830, pedidos: 22 },
    { nombre: "Segundo Yupanqui", ventas: 1290, pedidos: 17 },
  ]},
];

// Ventas por zona a nivel nacional (para vista Jefe General)
const ZONAS_NACIONAL = [
  { nombre: "Zona Centro", ventas: 20170, tiendas: 4, empleados: 16, pedidos: 210 },
  { nombre: "Zona Lima Metropolitana", ventas: 48200, tiendas: 8, empleados: 22, pedidos: 340 },
  { nombre: "Zona Norte", ventas: 26300, tiendas: 5, empleados: 12, pedidos: 180 },
  { nombre: "Zona Sur", ventas: 22100, tiendas: 4, empleados: 12, pedidos: 150 },
  { nombre: "Zona Oriente", ventas: 14800, tiendas: 3, empleados: 8, pedidos: 95 },
  { nombre: "Zona Costa Norte", ventas: 19500, tiendas: 4, empleados: 10, pedidos: 130 },
  { nombre: "Zona Costa Sur", ventas: 17200, tiendas: 3, empleados: 9, pedidos: 115 },
  { nombre: "Zona Selva", ventas: 11900, tiendas: 3, empleados: 7, pedidos: 90 },
  { nombre: "Zona Sierra Sur", ventas: 15600, tiendas: 3, empleados: 8, pedidos: 100 },
  { nombre: "Zona Sierra Norte", ventas: 13400, tiendas: 3, empleados: 8, pedidos: 100 },
];

// Ranking de empleados destacados a nivel nacional (para vista Jefe General)
const EMPLEADOS_DESTACADOS_NACIONAL = [
  { nombre: "Verónica Huamán", zona: "Zona Lima Metropolitana", tienda: "Tienda SJL", ventas: 6420 },
  { nombre: "Diana Ttito", zona: "Zona Sur", tienda: "Tienda Arequipa", ventas: 5680 },
  { nombre: "Fernando Quiroz", zona: "Zona Norte", tienda: "Tienda Trujillo", ventas: 5230 },
  { nombre: "Milagros Effio", zona: "Zona Norte", tienda: "Tienda Chiclayo", ventas: 4870 },
  { nombre: "Susana Palacios", zona: "Zona Sierra Sur", tienda: "Tienda Puno", ventas: 3410 },
  { nombre: "Renzo Bardales", zona: "Zona Selva", tienda: "Tienda Iquitos", ventas: 3120 },
  { nombre: "Carlos Ramírez", zona: "Zona Centro", tienda: "Tienda Huancayo", ventas: 2840 },
  { nombre: "Elena Rojas", zona: "Zona Centro", tienda: "Tienda Jauja", ventas: 2580 },
  { nombre: "Jorge Salcedo", zona: "Zona Centro", tienda: "Tienda Concepción", ventas: 2210 },
  { nombre: "Patricia Núñez", zona: "Zona Centro", tienda: "Tienda Tarma", ventas: 1830 },
];

// Usuarios del sistema (login + gestión de usuarios). Las contraseñas son solo para la demo.
const USUARIOS = [
  { id: 1, nombre: "Julio Cárdenas Ríos", correo: "julio.cardenas@farmavida.pe", rol: "jefegeneral", zona: "Nacional", tienda: "—", usuario: "jefe.general", clave: "demo123" },
  { id: 2, nombre: "María Fernanda Solís", correo: "maria.solis@farmavida.pe", rol: "jefezona", zona: "Zona Centro", tienda: "—", usuario: "jefe.centro", clave: "demo123" },
  { id: 3, nombre: "Carlos Ramírez", correo: "carlos.ramirez@farmavida.pe", rol: "empleado", zona: "Zona Centro", tienda: "Tienda Huancayo", usuario: "empleado.huancayo", clave: "demo123" },
  { id: 4, nombre: "Rosa Injante", correo: "rosa.injante@gmail.com", rol: "cliente", zona: "—", tienda: "—", usuario: "cliente.demo", clave: "demo123" },
  { id: 5, nombre: "Jorge Salcedo", correo: "jorge.salcedo@farmavida.pe", rol: "empleado", zona: "Zona Centro", tienda: "Tienda Concepción", usuario: "jorge.salcedo", clave: "demo123" },
  { id: 6, nombre: "Patricia Núñez", correo: "patricia.nunez@farmavida.pe", rol: "empleado", zona: "Zona Centro", tienda: "Tienda Tarma", usuario: "patricia.nunez", clave: "demo123" },
  { id: 7, nombre: "Ángel Ferreyra", correo: "angel.ferreyra@farmavida.pe", rol: "jefezona", zona: "Zona Lima Metropolitana", tienda: "—", usuario: "angel.ferreyra", clave: "demo123" },
];
let nextUserId = USUARIOS.length + 1;
let usuariosNuevosCreados = 0;
const LIMITE_USUARIOS_DEMO = 2;

/* ---------------- ESTADO GLOBAL ---------------- */
let currentUser = null;
let carrito = [];
let metodoSeleccionado = null;
let voucherDataURL = null;
let ventasNacionalAcumulado = ZONAS_NACIONAL.reduce((s, z) => s + z.ventas, 0);
const charts = {};
const ACTIVIDAD = [];
let sortState = { key: null, dir: 'desc' };

/* ---------------- HELPERS ---------------- */
const fmt = n => 'S/ ' + Number(n).toFixed(2);
function toast(msg) {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

document.addEventListener('DOMContentLoaded', function () {

  /* ================= LOGIN ================= */
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  document.querySelectorAll('#login-demo-list li').forEach(li => {
    li.addEventListener('click', () => {
      document.getElementById('login-usuario').value = li.dataset.usuario;
      document.getElementById('login-clave').value = li.dataset.clave;
    });
  });

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('login-usuario').value.trim().toLowerCase();
    const p = document.getElementById('login-clave').value;
    const found = USUARIOS.find(x => x.usuario.toLowerCase() === u && x.clave === p);
    if (!found) {
      loginError.classList.add('show');
      return;
    }
    loginError.classList.remove('show');
    currentUser = found;
    document.getElementById('login-wrap').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('user-name-badge').textContent = `${found.nombre} · ${ROLE_LABELS[found.rol]}`;
    setupTabsForRole(found.rol);
    activarVista(found.rol);
    if (document.getElementById('cliente-greet')) {
      document.getElementById('cliente-greet').textContent = `Hola, ${found.nombre.split(' ')[0]} 👋 — Precios y ofertas vigentes en tu tienda más cercana.`;
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => location.reload());

  function setupTabsForRole(rol) {
    document.querySelectorAll('.role-tab').forEach(t => {
      if (t.dataset.role === 'usuarios') {
        t.style.display = (rol === 'jefegeneral') ? 'inline-flex' : 'none';
      }
      t.classList.remove('active');
    });
  }

  function activarVista(role) {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.toggle('active', t.dataset.role === role));
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    const vista = document.getElementById('vista-' + role);
    if (vista) vista.classList.add('active');
    // Los gráficos Chart.js se crean mientras el panel está oculto (display:none),
    // por lo que quedan con tamaño 0. Al mostrar la vista, forzamos un resize
    // para que se dibujen correctamente.
    requestAnimationFrame(() => {
      Object.values(charts).forEach(c => { if (c && typeof c.resize === 'function') c.resize(); });
    });
  }

  /* ---------- Cambio de rol (tabs) — navegación libre para la presentación ---------- */
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => activarVista(tab.dataset.role));
  });

  /* ================= CLIENTE: CATÁLOGO ================= */
  const grid = document.getElementById('product-grid');
  if (grid) {
    PRODUCTOS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        ${p.antes ? '<span class="offer-tag">OFERTA</span>' : ''}
        <div class="product-icon">${p.icon}</div>
        <span class="cat">${p.cat}</span>
        <h3>${p.nombre}</h3>
        <div class="price-row">
          <span class="price-now">${fmt(p.precio)}</span>
          ${p.antes ? `<span class="price-before">${fmt(p.antes)}</span>` : ''}
        </div>
        <button class="add-btn" data-id="${p.id}">+ Agregar al carrito</button>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const producto = PRODUCTOS.find(p => p.id == btn.dataset.id);
        carrito.push(producto);
        renderCarrito();
        btn.textContent = '✓ Agregado';
        btn.classList.add('added');
        setTimeout(() => { btn.textContent = '+ Agregar al carrito'; btn.classList.remove('added'); }, 900);
      });
    });
  }

  function renderCarrito() {
    const lista = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!lista) return;
    if (carrito.length === 0) {
      lista.innerHTML = '<li class="cart-empty">Tu carrito está vacío</li>';
      checkoutBtn.disabled = true;
    } else {
      lista.innerHTML = carrito.map(p => `<li><span>${p.nombre}</span><span>${fmt(p.precio)}</span></li>`).join('');
      checkoutBtn.disabled = false;
    }
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    totalEl.textContent = fmt(total);
  }
  renderCarrito();

  /* ================= MODAL CHECKOUT (pago con voucher) ================= */
  const modal = document.getElementById('checkout-modal');
  const openBtn = document.getElementById('checkout-btn');
  const closeBtn = document.getElementById('close-modal');
  const uploadTriggerBtn = document.getElementById('upload-trigger-btn');
  const voucherInput = document.getElementById('voucher-input');
  const voucherPreview = document.getElementById('voucher-preview');
  const confirmPayBtn = document.getElementById('confirm-pay-btn');

  function resetCheckoutModal() {
    document.getElementById('modal-step-metodo').style.display = 'block';
    document.getElementById('modal-step-ok').style.display = 'none';
    document.querySelectorAll('.pay-method').forEach(x => x.classList.remove('selected'));
    document.getElementById('pay-details').style.display = 'none';
    uploadTriggerBtn.style.display = 'none';
    voucherPreview.style.display = 'none';
    confirmPayBtn.style.display = 'none';
    confirmPayBtn.disabled = true;
    metodoSeleccionado = null;
    voucherDataURL = null;
    voucherInput.value = '';
  }

  if (openBtn) openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    resetCheckoutModal();
  });
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  const detalles = {
    Yape: `<b>Paga con Yape</b>Escanea el QR o yapea al <b>987 654 321</b> (FARMAVIDA Huancayo) por el monto exacto.<div class="qr-box"></div>`,
    Plin: `<b>Paga con Plin</b>Envía el pago al <b>987 654 321</b> (FARMAVIDA Huancayo) por el monto exacto.<div class="qr-box"></div>`,
    QR: `<b>Paga con QR</b>Escanea este código QR desde la app de tu banco.<div class="qr-box"></div>`,
    Transferencia: `<b>Transferencia bancaria</b>Cuenta BCP: 191-2345678-0-12<br>CCI: 00219100234567801-2<br>Titular: FARMAVIDA DROGUERÍA NACIONAL S.A.C.`
  };

  document.querySelectorAll('.pay-method').forEach(m => {
    m.addEventListener('click', () => {
      document.querySelectorAll('.pay-method').forEach(x => x.classList.remove('selected'));
      m.classList.add('selected');
      metodoSeleccionado = m.dataset.metodo;
      document.getElementById('pay-detail-content').innerHTML = detalles[metodoSeleccionado];
      document.getElementById('pay-details').style.display = 'block';
      uploadTriggerBtn.style.display = 'block';
      confirmPayBtn.style.display = 'block';
      confirmPayBtn.disabled = !voucherDataURL;
    });
  });

  uploadTriggerBtn.addEventListener('click', () => voucherInput.click());
  voucherInput.addEventListener('change', () => {
    const file = voucherInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      voucherDataURL = reader.result;
      document.getElementById('voucher-preview-img').src = voucherDataURL;
      document.getElementById('voucher-filename').textContent = file.name;
      voucherPreview.style.display = 'flex';
      confirmPayBtn.disabled = !metodoSeleccionado;
    };
    reader.readAsDataURL(file);
  });

  confirmPayBtn.addEventListener('click', () => {
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    const pedido = {
      id: 'P-' + (1043 + pedidosDinamicos.length),
      cliente: (currentUser && currentUser.rol === 'cliente') ? currentUser.nombre : 'Cliente Demo',
      monto: total,
      metodo: metodoSeleccionado,
      estado: 'pendiente',
      voucher: voucherDataURL,
      fecha: new Date().toLocaleString('es-PE')
    };
    pedidosDinamicos.unshift(pedido);
    renderTablaPedidos();

    document.getElementById('modal-step-metodo').style.display = 'none';
    document.getElementById('modal-step-ok').style.display = 'block';
    carrito = [];
    renderCarrito();
  });

  /* ================= EMPLEADO: PEDIDOS + VALIDACIÓN + BOLETA ================= */
  function todosLosPedidos() {
    return [...pedidosDinamicos, ...PEDIDOS_TIENDA_BASE];
  }

  function renderTablaPedidos() {
    const tabla = document.getElementById('tabla-pedidos');
    if (!tabla) return;
    const pedidos = todosLosPedidos();
    tabla.innerHTML = pedidos.map(p => `
      <tr data-id="${p.id}">
        <td>${p.id}</td>
        <td>${p.cliente}</td>
        <td>${fmt(p.monto)}</td>
        <td>${p.metodo}</td>
        <td>${p.voucher ? `<button class="ver-comprobante-btn" data-id="${p.id}">Ver</button>` : '—'}</td>
        <td><span class="status-pill status-${p.estado}">${p.estado === 'pendiente' ? 'Pendiente' : 'Confirmado'}</span></td>
        <td>
          ${p.estado === 'pendiente' ? `<button class="confirm-pago-btn" data-id="${p.id}">Validar pago</button>` : `<button class="descargar-boleta-btn" data-id="${p.id}">⬇ Boleta</button>`}
        </td>
      </tr>
    `).join('');

    const pendientesCount = pedidos.filter(p => p.estado === 'pendiente').length;
    const statPendientes = document.getElementById('stat-pendientes-emp');
    if (statPendientes) statPendientes.querySelector('b').textContent = pendientesCount;

    tabla.querySelectorAll('.ver-comprobante-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pedido = pedidos.find(p => p.id === btn.dataset.id);
        document.getElementById('voucher-img').src = pedido.voucher;
        document.getElementById('voucher-modal-sub').textContent = `Pedido ${pedido.id} · ${pedido.cliente} · ${fmt(pedido.monto)} · ${pedido.metodo}`;
        document.getElementById('voucher-modal').classList.add('active');
      });
    });

    tabla.querySelectorAll('.confirm-pago-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pedido = pedidosDinamicos.find(p => p.id === btn.dataset.id) || PEDIDOS_TIENDA_BASE.find(p => p.id === btn.dataset.id);
        pedido.estado = 'confirmado';
        toast(`Pago de ${pedido.id} validado. Boleta lista para descargar.`);
        renderTablaPedidos();
      });
    });

    tabla.querySelectorAll('.descargar-boleta-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pedido = pedidos.find(p => p.id === btn.dataset.id);
        generarBoletaPDF(pedido);
      });
    });
  }
  renderTablaPedidos();

  document.getElementById('close-voucher-modal').addEventListener('click', () => {
    document.getElementById('voucher-modal').classList.remove('active');
  });
  document.getElementById('voucher-modal').addEventListener('click', (e) => {
    if (e.target.id === 'voucher-modal') document.getElementById('voucher-modal').classList.remove('active');
  });

  function generarBoletaPDF(pedido) {
    if (!window.jspdf) { toast('No se pudo generar el PDF (librería no disponible).'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a5' });
    doc.setFont(undefined, 'bold'); doc.setFontSize(16); doc.setTextColor(15, 118, 110);
    doc.text('FARMAVIDA', 15, 18);
    doc.setFont(undefined, 'normal'); doc.setFontSize(9); doc.setTextColor(60);
    doc.text('Droguería Nacional · RUC 20600000001 (demo)', 15, 24);
    doc.text('Tienda Huancayo — Zona Centro', 15, 29);
    doc.setDrawColor(210); doc.line(15, 33, 133, 33);
    doc.setFont(undefined, 'bold'); doc.setFontSize(11); doc.setTextColor(20);
    doc.text('BOLETA DE VENTA ELECTRÓNICA (DEMO)', 15, 41);
    doc.setFont(undefined, 'normal'); doc.setFontSize(9);
    doc.text(`N° de boleta: B001-${String(pedido.id).replace('P-', '')}`, 15, 48);
    doc.text(`Fecha de emisión: ${pedido.fecha || new Date().toLocaleString('es-PE')}`, 15, 53);
    doc.text(`Cliente: ${pedido.cliente}`, 15, 58);
    doc.text(`Método de pago: ${pedido.metodo}`, 15, 63);
    doc.line(15, 67, 133, 67);
    doc.setFont(undefined, 'bold'); doc.setFontSize(12);
    doc.text('Total pagado', 15, 75);
    doc.text(fmt(pedido.monto), 100, 75);
    doc.setFont(undefined, 'normal'); doc.setFontSize(9); doc.setTextColor(15, 118, 110);
    doc.text('✓ Pago validado por la tienda', 15, 83);
    doc.setTextColor(120); doc.setFontSize(7);
    doc.text('Documento generado automáticamente por el sistema FARMAVIDA. Documento de demostración, sin valor tributario real.', 15, 98, { maxWidth: 105 });
    doc.save(`boleta-farmavida-${pedido.id}.pdf`);
  }

  /* ---------- Vista Empleado: agregar producto (demo) ---------- */
  const addProductForm = document.getElementById('add-product-form');
  const addProductCat = document.getElementById('add-product-cat');
  const addProductCatOtra = document.getElementById('add-product-cat-otra');
  if (addProductCat) addProductCat.addEventListener('change', () => {
    const esOtra = addProductCat.value === '__otra';
    addProductCatOtra.style.display = esOtra ? 'block' : 'none';
    addProductCatOtra.classList.toggle('full-width', esOtra);
    addProductCatOtra.required = esOtra;
  });
  if (addProductForm) addProductForm.addEventListener('submit', e => {
    e.preventDefault();
    const catElegida = addProductCat.value === '__otra' ? addProductCatOtra.value.trim() : addProductCat.value;
    addProductForm.reset();
    addProductCatOtra.style.display = 'none';
    addProductCatOtra.classList.remove('full-width');
    toast(`Producto agregado a "${catElegida || 'Sin categoría'}" (demo).`);
  });

  /* ---------- Vista Empleado: tabla de productos con edición de precio ---------- */
  const tablaProductos = document.getElementById('tabla-productos-emp');
  if (tablaProductos) {
    tablaProductos.innerHTML = PRODUCTOS.map(p => `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.cat}</td>
        <td><input class="mini-input" type="number" step="0.10" value="${p.precio.toFixed(2)}"></td>
        <td><button class="save-row">Guardar</button></td>
      </tr>
    `).join('');
    tablaProductos.querySelectorAll('.save-row').forEach(btn => {
      btn.addEventListener('click', () => toast('Precio actualizado (demo).'));
    });
  }

  /* ================= JEFE DE ZONA ================= */
  const chartTeal = '#0d9488', chartCoral = '#f97362', chartAzul = '#1e3a5f';

  function renderJefeZona() {
    const filtro = document.getElementById('filtro-tienda-zona')?.value || 'todas';
    const tiendas = filtro === 'todas' ? TIENDAS_ZONA_CENTRO : TIENDAS_ZONA_CENTRO.filter(t => t.nombre === filtro);

    const ventasZona = tiendas.reduce((s, t) => s + t.empleados.reduce((s2, e) => s2 + e.ventas, 0), 0);
    const empleadosZona = tiendas.reduce((s, t) => s + t.empleados.length, 0);
    document.getElementById('stat-ventas-zona').textContent = fmt(ventasZona);
    document.getElementById('stat-tiendas-zona').textContent = tiendas.length;
    document.getElementById('stat-empleados-zona').textContent = empleadosZona;

    // Empleados combinados de las tiendas filtradas (se calcula antes de los gráficos
    // para que la tabla de abajo siempre se pueda pintar aunque Chart.js falle).
    const empleadosCombinados = tiendas.flatMap(t => t.empleados.map(e => ({ ...e, tienda: t.nombre })))
      .sort((a, b) => b.ventas - a.ventas);

    // Chart: ventas por tienda (protegido: si Chart.js no está disponible, no debe
    // romper el resto de la página — solo se pierde el gráfico, no toda la vista).
    try {
      const ctxZona = document.getElementById('chart-tiendas-zona');
      if (ctxZona && typeof Chart !== 'undefined') {
        if (charts.tiendasZona) charts.tiendasZona.destroy();
        charts.tiendasZona = new Chart(ctxZona, {
          type: 'bar',
          data: {
            labels: tiendas.map(t => t.nombre),
            datasets: [{ label: 'Ventas (S/)', data: tiendas.map(t => t.empleados.reduce((s, e) => s + e.ventas, 0)), backgroundColor: chartTeal, borderRadius: 8 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
      }
    } catch (err) { console.error('Error al dibujar "Ventas por tienda":', err); }

    try {
      const ctxEmpleados = document.getElementById('chart-empleados');
      if (ctxEmpleados && typeof Chart !== 'undefined') {
        if (charts.empleadosZona) charts.empleadosZona.destroy();
        charts.empleadosZona = new Chart(ctxEmpleados, {
          type: 'doughnut',
          data: {
            labels: empleadosCombinados.map(e => e.nombre),
            datasets: [{ data: empleadosCombinados.map(e => e.ventas), backgroundColor: [chartTeal, chartCoral, chartAzul, '#94a3b8', '#c4b5fd', '#fbbf24'] }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }
        });
      }
    } catch (err) { console.error('Error al dibujar "Ventas por empleado":', err); }

    const tablaReporte = document.getElementById('tabla-reporte-empleados-zona');
    if (tablaReporte) {
      tablaReporte.innerHTML = empleadosCombinados.map(e => `
        <tr>
          <td>${e.nombre}</td>
          <td>${e.tienda}</td>
          <td>${fmt(e.ventas)}</td>
          <td>${e.pedidos}</td>
          <td>${fmt(e.ventas / e.pedidos)}</td>
        </tr>
      `).join('');
    }
  }

  const filtroTiendaZona = document.getElementById('filtro-tienda-zona');
  if (filtroTiendaZona) filtroTiendaZona.addEventListener('change', renderJefeZona);

  function aplicarFactorSimulado(scope) {
    const factor = 0.85 + Math.random() * 0.30;
    if (scope === 'zona') {
      TIENDAS_ZONA_CENTRO.forEach(t => t.empleados.forEach(e => {
        e.ventas = Math.round(e.ventas * factor);
        e.pedidos = Math.max(1, Math.round(e.pedidos * factor));
      }));
    } else {
      ZONAS_NACIONAL.forEach(z => { z.ventas = Math.round(z.ventas * factor); z.pedidos = Math.max(1, Math.round(z.pedidos * factor)); });
      EMPLEADOS_DESTACADOS_NACIONAL.forEach(e => { e.ventas = Math.round(e.ventas * factor); });
    }
  }

  ['fecha-desde-zona', 'fecha-hasta-zona'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => {
      aplicarFactorSimulado('zona');
      renderJefeZona();
      toast('Datos recalculados para el rango seleccionado (simulado).');
    });
  });

  renderJefeZona();

  /* ================= JEFE GENERAL ================= */
  function renderStatsGenerales() {
    document.getElementById('stat-ventas-nacional').textContent = fmt(ventasNacionalAcumulado);
  }

  function renderChartsGenerales() {
    try {
      const ctxNacional = document.getElementById('chart-zonas-nacional');
      if (ctxNacional && typeof Chart !== 'undefined') {
        if (charts.zonasNacional) charts.zonasNacional.destroy();
        charts.zonasNacional = new Chart(ctxNacional, {
          type: 'bar',
          data: {
            labels: ZONAS_NACIONAL.map(z => z.nombre),
            datasets: [{ label: 'Ventas (S/)', data: ZONAS_NACIONAL.map(z => z.ventas), backgroundColor: chartAzul, borderRadius: 8 }]
          },
          options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
        });
      }
    } catch (err) { console.error('Error al dibujar "Ventas por zona":', err); }

    try {
      const ctxTendencia = document.getElementById('chart-tendencia');
      if (ctxTendencia && typeof Chart !== 'undefined') {
        if (!charts.tendencia) {
          charts.tendencia = new Chart(ctxTendencia, {
            type: 'line',
            data: {
              labels: ['01 Jul', '05 Jul', '10 Jul', '15 Jul', '20 Jul', '25 Jul', '27 Jul', 'Ahora'],
              datasets: [{ label: 'Ventas nacionales (S/)', data: [18200, 21400, 19800, 24300, 22900, 26100, 23700, ventasNacionalAcumulado], borderColor: chartTeal, backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.35 }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
          });
        } else {
          charts.tendencia.data.datasets[0].data[charts.tendencia.data.datasets[0].data.length - 1] = ventasNacionalAcumulado;
          charts.tendencia.update();
        }
      }
    } catch (err) { console.error('Error al dibujar "Tendencia de ventas":', err); }
  }

  function renderTablaZonasGeneral() {
    const tbody = document.getElementById('tabla-zonas-general');
    if (!tbody) return;
    tbody.innerHTML = ZONAS_NACIONAL.map(z => `
      <tr>
        <td>${z.nombre}</td>
        <td>${fmt(z.ventas)}</td>
        <td>${z.tiendas}</td>
        <td>${z.empleados}</td>
        <td>${z.pedidos}</td>
        <td>${fmt(z.ventas / z.pedidos)}</td>
      </tr>
    `).join('');
  }

  function renderTablaEmpleadosGeneral() {
    const tbody = document.getElementById('tabla-empleados-general');
    if (!tbody) return;
    const ranked = [...EMPLEADOS_DESTACADOS_NACIONAL].sort((a, b) => b.ventas - a.ventas);
    const medallas = ['🥇', '🥈', '🥉'];
    tbody.innerHTML = ranked.map((e, i) => `
      <tr>
        <td class="rank-badge">${medallas[i] || (i + 1)}</td>
        <td>${e.nombre}</td>
        <td>${e.zona} · ${e.tienda}</td>
        <td>${fmt(e.ventas)}</td>
      </tr>
    `).join('');
  }

  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      sortState.dir = (sortState.key === key && sortState.dir === 'desc') ? 'asc' : 'desc';
      sortState.key = key;
      ZONAS_NACIONAL.sort((a, b) => {
        if (typeof a[key] === 'string') return sortState.dir === 'desc' ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key]);
        return sortState.dir === 'desc' ? b[key] - a[key] : a[key] - b[key];
      });
      renderTablaZonasGeneral();
    });
  });

  const filtroZonaGeneral = document.getElementById('filtro-zona-general');
  if (filtroZonaGeneral) filtroZonaGeneral.addEventListener('change', () => {
    toast(`Mostrando reporte filtrado: ${filtroZonaGeneral.value}`);
  });

  ['fecha-desde-general', 'fecha-hasta-general'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => {
      aplicarFactorSimulado('nacional');
      ventasNacionalAcumulado = ZONAS_NACIONAL.reduce((s, z) => s + z.ventas, 0);
      renderStatsGenerales(); renderChartsGenerales(); renderTablaZonasGeneral(); renderTablaEmpleadosGeneral();
      toast('Datos recalculados para el rango seleccionado (simulado).');
    });
  });

  const descargarReporteBtn = document.getElementById('descargar-reporte-btn');
  if (descargarReporteBtn) descargarReporteBtn.addEventListener('click', () => {
    let csv = 'Zona,Ventas (S/),Tiendas,Empleados,Pedidos,Ticket promedio\n';
    ZONAS_NACIONAL.forEach(z => {
      csv += `${z.nombre},${z.ventas.toFixed(2)},${z.tiendas},${z.empleados},${z.pedidos},${(z.ventas / z.pedidos).toFixed(2)}\n`;
    });
    // BOM al inicio para que Excel reconozca UTF-8 y muestre bien las tildes.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'reporte-ventas-farmavida.csv'; a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 300);
    toast('Reporte descargado.');
  });

  /* ---------- Actividad en tiempo real (simulada) ---------- */
  const zonasParaActividad = ZONAS_NACIONAL.map(z => z.nombre.replace('Zona ', ''));
  const metodosPago = ['Yape', 'Plin', 'QR', 'Transferencia'];
  function agregarActividad(texto) {
    ACTIVIDAD.unshift(texto);
    if (ACTIVIDAD.length > 6) ACTIVIDAD.pop();
    const feed = document.getElementById('actividad-feed');
    if (feed) feed.innerHTML = ACTIVIDAD.map(t => `<li>${t}</li>`).join('');
  }

  renderStatsGenerales();
  renderChartsGenerales();
  renderTablaZonasGeneral();
  renderTablaEmpleadosGeneral();
  agregarActividad('🟢 Sistema conectado — mostrando datos consolidados de las 10 zonas.');

  setInterval(() => {
    const incremento = Math.round(Math.random() * 180 + 40);
    ventasNacionalAcumulado += incremento;
    const zonaRandom = ZONAS_NACIONAL[Math.floor(Math.random() * ZONAS_NACIONAL.length)];
    zonaRandom.ventas += incremento;
    zonaRandom.pedidos += 1;
    renderStatsGenerales();
    renderChartsGenerales();
    renderTablaZonasGeneral();
    const metodo = metodosPago[Math.floor(Math.random() * metodosPago.length)];
    agregarActividad(`🟢 Nueva venta — ${zonaRandom.nombre} — ${fmt(incremento)} — ${metodo} — hace instantes`);
  }, 6000);

  /* ================= GESTIÓN DE USUARIOS ================= */
  function renderTablaUsuarios() {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) return;
    tbody.innerHTML = USUARIOS.map(u => `
      <tr>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td><span class="role-badge role-badge-${u.rol}">${ROLE_LABELS[u.rol]}</span></td>
        <td>${u.zona}</td>
        <td>${u.tienda}</td>
        <td>${u.usuario}</td>
      </tr>
    `).join('');
  }
  renderTablaUsuarios();

  function actualizarLimiteLabel() {
    const label = document.getElementById('limite-usuarios-label');
    if (!label) return;
    const restantes = LIMITE_USUARIOS_DEMO - usuariosNuevosCreados;
    label.textContent = restantes > 0 ? `(${restantes} disponible${restantes === 1 ? '' : 's'} en esta demo)` : '(límite de la demo alcanzado)';
  }
  actualizarLimiteLabel();

  const userForm = document.getElementById('user-form');
  const userFormMsg = document.getElementById('user-form-msg');
  if (userForm) userForm.addEventListener('submit', e => {
    e.preventDefault();
    if (usuariosNuevosCreados >= LIMITE_USUARIOS_DEMO) {
      userFormMsg.textContent = 'Límite de usuarios nuevos alcanzado en esta demo (2). En el sistema real no hay límite: se pueden registrar los ~100 empleados y jefes de zona necesarios.';
      userFormMsg.className = 'user-form-msg error';
      return;
    }
    const nombre = document.getElementById('uf-nombre').value.trim();
    const correo = document.getElementById('uf-correo').value.trim();
    const rol = document.getElementById('uf-rol').value;
    const zona = document.getElementById('uf-zona').value.trim() || '—';
    const tienda = document.getElementById('uf-tienda').value.trim() || '—';
    const usuario = document.getElementById('uf-usuario').value.trim();

    const nuevo = { id: nextUserId++, nombre, correo, rol, zona, tienda, usuario, clave: 'demo123' };
    USUARIOS.push(nuevo);
    usuariosNuevosCreados++;
    renderTablaUsuarios();
    actualizarLimiteLabel();
    userForm.reset();
    userFormMsg.textContent = `Usuario "${nombre}" creado con rol ${ROLE_LABELS[rol]}. (En producción recibiría una contraseña temporal por correo.)`;
    userFormMsg.className = 'user-form-msg ok';
    toast('Usuario creado correctamente.');
  });

});
