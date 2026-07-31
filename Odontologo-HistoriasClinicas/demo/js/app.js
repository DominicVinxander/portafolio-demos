// ===================== Helpers =====================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
function fmtDate(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return `${d} ${MESES[m-1]} ${y}`;
}
function timeAgo(iso){
  const today = new Date("2026-07-31");
  const d = new Date(iso);
  const days = Math.round((today - d) / 86400000);
  if(days <= 0) return "hoy";
  if(days === 1) return "ayer";
  if(days < 7) return `hace ${days} días`;
  if(days < 30) return `hace ${Math.floor(days/7)} sem`;
  return `hace ${Math.floor(days/30)} mes${Math.floor(days/30) > 1 ? "es" : ""}`;
}

const ICON = {
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 20c0-3.4 2.6-5.8 5.5-5.8s5.5 2.4 5.5 5.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="17.3" cy="8.5" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M15.5 14.5c2.5.3 4.2 2.2 4.2 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  calendar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15.5" rx="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 3.5v5.5c0 5-3 9-7 11-4-2-7-6-7-11V5.5L12 2z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
  alert: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M10.5 3.5L2 19h20L13.5 3.5a1.7 1.7 0 00-3 0z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9.5v5M12 17.5h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 3h3l1.5 5-2.2 1.6a12 12 0 006 6l1.6-2.2 5 1.5v3a2 2 0 01-2.2 2A17 17 0 014 5.2 2 2 0 016 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  id: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.2" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M13 10h6M13 14h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  pin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5A7 7 0 105 9.5C5 14.6 12 22 12 22z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.2" stroke="currentColor" stroke-width="1.6"/></svg>`,
  cake: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 21v-7a2 2 0 012-2h12a2 2 0 012 2v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 21h16M8 12V8M12 12V8M16 12V8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 3s-1.5 1.4-1.5 2.5S11 7 12 7s1.5-.6 1.5-1.5S12 3 12 3z" stroke="currentColor" stroke-width="1.6"/></svg>`,
  image: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2.4" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.8" stroke="currentColor" stroke-width="1.6"/><path d="M4 17l5-5 3.5 3.5L17 11l3 3" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  chev: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cloud: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 18a4.5 4.5 0 01-.5-9 5.5 5.5 0 0110.7-1.7A4 4 0 0117 18H7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  lock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.5V7.5a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  back: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

let currentView = "dashboard";
let currentPatientId = null;

// ===================== Persistencia local (solo demo) =====================
// Los pacientes registrados desde nuevo-paciente.html se guardan en localStorage
// para que aparezcan aquí "como si" ya existiera una base de datos. Esto es solo
// para la demo — el sistema real usará Supabase, no el navegador.
const STORAGE_KEY = "consultorioBertilDemoPacientes";

function loadCustomPatients(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
(function mergeCustomPatients(){
  const custom = loadCustomPatients();
  [...custom].reverse().forEach(p => PATIENTS.unshift(p));
})();

// ===================== Login =====================
$("#login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = $("#login-btn");
  btn.classList.add("loading");
  btn.disabled = true;
  setTimeout(() => {
    $("#view-login").classList.add("hidden");
    $("#view-app").classList.remove("hidden");
    renderView("dashboard");
  }, 900);
});

$("#logout-btn").addEventListener("click", () => {
  $("#view-app").classList.add("hidden");
  $("#view-login").classList.remove("hidden");
  $("#login-btn").classList.remove("loading");
  $("#login-btn").disabled = false;
});

// ===================== Nav =====================
$$(".nav-item[data-view]").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderView(btn.dataset.view);
  });
});
$('.nav-item[data-action="new-patient"]').addEventListener("click", () => {
  window.location.href = "nuevo-paciente.html";
});

$("#global-search").addEventListener("input", (e) => {
  if(currentView !== "patients"){
    $$(".nav-item").forEach(b => b.classList.remove("active"));
    $('.nav-item[data-view="patients"]').classList.add("active");
    renderView("patients");
  }
  filterPatients(e.target.value);
});

// ===================== View router =====================
let pendingHighlightId = null;

function renderView(view){
  currentView = view;
  const root = $("#content-root");
  if(view === "dashboard") root.innerHTML = dashboardHTML();
  else if(view === "patients"){
    root.innerHTML = patientsHTML(pendingHighlightId);
    if(pendingHighlightId){
      const row = root.querySelector(`[data-open-patient="${pendingHighlightId}"]`);
      if(row){
        row.classList.add("row-highlight");
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      pendingHighlightId = null;
    }
  }
  else if(view === "patient-detail"){
    root.innerHTML = patientDetailHTML(currentPatientId);
    const p = PATIENTS.find(x => x.id === currentPatientId);
    if(p) bindOdontogramaEvents(p);
  }
  else if(view === "settings") root.innerHTML = settingsHTML();
  bindDynamicEvents();
}

function bindDynamicEvents(){
  $$("[data-open-patient]").forEach(row => {
    row.addEventListener("click", () => {
      currentPatientId = row.dataset.openPatient;
      if(typeof odontoSelectedTooth !== "undefined") odontoSelectedTooth = null;
      renderView("patient-detail");
    });
  });
  const back = $("#back-to-patients");
  if(back) back.addEventListener("click", () => renderView("patients"));

  const searchInput = $("#patients-search");
  if(searchInput) searchInput.addEventListener("input", (e) => filterPatients(e.target.value));
}

function filterPatients(q){
  q = q.trim().toLowerCase();
  $$("#patients-tbody tr").forEach(tr => {
    const match = tr.dataset.search.includes(q);
    tr.style.display = match ? "" : "none";
  });
}

// ===================== Dashboard =====================
function dashboardHTML(){
  const total = PATIENTS.length;
  const esteMes = PATIENTS.filter(p => p.ultimaVisita.startsWith("2026-07")).length;
  const nuevos = PATIENTS.filter(p => p.tag === "Nueva paciente").length;
  const seguimiento = PATIENTS.filter(p => p.tag === "Requiere seguimiento").length;

  const recientes = [...PATIENTS].sort((a,b) => b.ultimaVisita.localeCompare(a.ultimaVisita)).slice(0,6);

  return `
    <div class="page-head">
      <div>
        <h1>Buen día, Dr. Bertil</h1>
        <p>Resumen de tu consultorio · viernes 31 de julio, 2026</p>
      </div>
      <button class="btn-sm" onclick="window.location.href='nuevo-paciente.html'">+ Nuevo paciente</button>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon teal">${ICON.users}</div>
        <div class="kpi-value">${total}</div>
        <div class="kpi-label">Pacientes registrados</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon navy">${ICON.calendar}</div>
        <div class="kpi-value">${esteMes}</div>
        <div class="kpi-label">Consultas este mes</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon coral">${ICON.alert}</div>
        <div class="kpi-value">${seguimiento}</div>
        <div class="kpi-label">Requieren seguimiento</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon teal">${ICON.shield}</div>
        <div class="kpi-value">Hoy</div>
        <div class="kpi-label">Último respaldo automático</div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="panel">
        <div class="panel-head">
          <h3>Actividad reciente</h3>
          <span class="tag muted">Últimas visitas</span>
        </div>
        <div class="panel-body">
          ${recientes.map(p => `
            <div class="activity-row">
              <span class="activity-dot"></span>
              <span class="activity-text"><b>${p.nombre}</b> — ${p.consultas[0].tipo}</span>
              <span class="activity-time">${timeAgo(p.ultimaVisita)}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h3>Pendientes</h3></div>
        <div class="panel-body">
          <div class="alert-row">
            <div class="alert-icon">${ICON.alert}</div>
            <div>
              <p class="alert-title">Carlos Paredes — control periodontal</p>
              <p class="alert-sub">Seguimiento pendiente de fase 2</p>
            </div>
          </div>
          <div class="alert-row">
            <div class="alert-icon">${ICON.calendar}</div>
            <div>
              <p class="alert-title">Lucía Salazar — ajuste de ortodoncia</p>
              <p class="alert-sub">Próximo control en 4 semanas</p>
            </div>
          </div>
          <div class="alert-row">
            <div class="alert-icon">${ICON.cloud}</div>
            <div>
              <p class="alert-title">Respaldo de base de datos</p>
              <p class="alert-sub">Ejecutado hoy a las 3:00 a.m.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===================== Patients list =====================
function patientsHTML(highlightId){
  const highlighted = highlightId ? PATIENTS.find(p => p.id === highlightId) : null;
  const banner = highlighted ? `
    <div class="success-banner">
      <div class="success-banner-icon">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <p class="success-banner-title">${highlighted.nombre} fue registrado correctamente</p>
        <p class="success-banner-sub">Ya aparece en la lista, con la nota de su primera consulta.</p>
      </div>
    </div>
  ` : "";

  const rows = PATIENTS.map(p => `
    <tr data-open-patient="${p.id}" data-search="${p.nombre.toLowerCase()} ${p.dni.toLowerCase()}">
      <td>
        <div class="patient-cell">
          <div class="avatar-sm">${p.iniciales}</div>
          <div>
            <div class="patient-name">${p.nombre}</div>
            <div class="patient-sub">DNI ${p.dni}</div>
          </div>
        </div>
      </td>
      <td>${p.edad} años</td>
      <td>${fmtDate(p.ultimaVisita)}</td>
      <td><span class="tag ${p.tag === 'Requiere seguimiento' ? 'warn' : (p.tag === 'Estable' ? 'muted' : '')}">${p.tag}</span></td>
      <td class="chev">${ICON.chev}</td>
    </tr>
  `).join("");

  return `
    ${banner}
    <div class="page-head">
      <div>
        <h1>Pacientes</h1>
        <p>${PATIENTS.length} pacientes registrados en el consultorio</p>
      </div>
      <button class="btn-sm" onclick="window.location.href='nuevo-paciente.html'">+ Nuevo paciente</button>
    </div>
    <div class="panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Paciente</th><th>Edad</th><th>Última visita</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody id="patients-tbody">${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// ===================== Patient detail =====================
function patientDetailHTML(id){
  const p = PATIENTS.find(x => x.id === id);
  if(!p) return `<p>Paciente no encontrado.</p>`;

  const timeline = p.consultas.map(c => `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-body">
        <div class="tl-top">
          <span class="tl-type">${c.tipo}</span>
          <span class="tl-date">${fmtDate(c.fecha)}</span>
        </div>
        <p class="tl-note">${c.nota}</p>
      </div>
    </div>
  `).join("");

  const gallery = p.archivos.length ? p.archivos.map(a => `
    <div class="xray-tile">
      ${ICON.image}
      <div class="xray-caption">
        <p>${a.tipo}</p>
        <span>${a.pieza} · ${fmtDate(a.fecha)}</span>
      </div>
    </div>
  `).join("") : `<div class="empty-state">Este paciente aún no tiene fotos ni radiografías cargadas.</div>`;

  return `
    <button class="back-link" id="back-to-patients">${ICON.back} Volver a pacientes</button>

    <div class="detail-grid">
      <div class="panel profile-card">
        <div class="profile-avatar">${p.iniciales}</div>
        <p class="profile-name">${p.nombre}</p>
        <p class="profile-meta">${p.edad} años · Última visita ${fmtDate(p.ultimaVisita)}</p>

        <div class="profile-fields">
          <div class="pf-row">${ICON.id}<div><p class="pf-label">DNI</p><p class="pf-value">${p.dni}</p></div></div>
          <div class="pf-row">${ICON.phone}<div><p class="pf-label">Teléfono</p><p class="pf-value">${p.telefono}</p></div></div>
          <div class="pf-row">${ICON.cake}<div><p class="pf-label">Nacimiento</p><p class="pf-value">${p.nacimiento}</p></div></div>
          <div class="pf-row">${ICON.pin}<div><p class="pf-label">Dirección</p><p class="pf-value">${p.direccion}</p></div></div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:20px;">
        ${odontogramaPanelHTML(p)}

        <div class="panel">
          <div class="panel-head"><h3>Historial de tratamientos</h3><span class="tag muted">${p.consultas.length} consultas</span></div>
          <div class="timeline">${timeline}</div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>Fotos y radiografías</h3><span class="tag muted">${p.archivos.length} archivos</span></div>
          <div class="gallery">${gallery}</div>
        </div>
      </div>
    </div>
  `;
}

// ===================== Settings =====================
function settingsHTML(){
  return `
    <div class="page-head">
      <div>
        <h1>Configuración</h1>
        <p>Seguridad y datos de la cuenta del consultorio</p>
      </div>
    </div>
    <div class="settings-grid">
      <div class="panel settings-card">
        <div class="settings-row"><div class="settings-icon">${ICON.lock}</div><h4 style="margin:0">Acceso</h4></div>
        <p style="margin-top:10px">Solo tu cuenta (bertil@consultorio.pe) puede iniciar sesión. El sistema no permite registro público de nuevas cuentas.</p>
      </div>
      <div class="panel settings-card">
        <div class="settings-row"><div class="settings-icon">${ICON.cloud}</div><h4 style="margin:0">Respaldos</h4></div>
        <p style="margin-top:10px">La base de datos se respalda automáticamente todos los días a las 3:00 a.m. Último respaldo: hoy.</p>
      </div>
      <div class="panel settings-card">
        <div class="settings-row"><div class="settings-icon">${ICON.shield}</div><h4 style="margin:0">Protección de datos</h4></div>
        <p style="margin-top:10px">Datos de pacientes tratados conforme a la Ley N.° 29733 — Ley de Protección de Datos Personales del Perú. Ningún archivo es público.</p>
      </div>
      <div class="panel settings-card">
        <div class="settings-row"><div class="settings-icon">${ICON.image}</div><h4 style="margin:0">Almacenamiento</h4></div>
        <p style="margin-top:10px">Fotos y radiografías se guardan en almacenamiento privado, accesibles solo mediante enlaces temporales.</p>
      </div>
    </div>
  `;
}

// ===================== Init =====================
// Si venimos de nuevo-paciente.html con ?nuevo=<id>, saltamos el login y
// aterrizamos directo en la lista de pacientes con el registro resaltado.
(function init(){
  const params = new URLSearchParams(window.location.search);
  const nuevoId = params.get("nuevo");
  if(nuevoId && PATIENTS.some(p => p.id === nuevoId)){
    $("#view-login").classList.add("hidden");
    $("#view-app").classList.remove("hidden");
    $$(".nav-item").forEach(b => b.classList.remove("active"));
    $('.nav-item[data-view="patients"]').classList.add("active");
    pendingHighlightId = nuevoId;
    renderView("patients");
    history.replaceState(null, "", window.location.pathname);
  }
})();
