const $ = (sel) => document.querySelector(sel);
const STORAGE_KEY = "consultorioBertilDemoPacientes";

$("#back-link").addEventListener("click", () => { window.location.href = "index.html"; });

function getInitials(name){
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return "?";
  if(parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const nombreInput = $("#f-nombre");
const previewAvatar = $("#preview-avatar");
const previewName = $("#preview-name");
const previewSub = $("#preview-sub");

nombreInput.addEventListener("input", () => {
  const val = nombreInput.value.trim();
  if(val){
    previewAvatar.textContent = getInitials(val);
    previewAvatar.classList.add("filled");
    previewName.textContent = val;
    previewSub.textContent = "Nuevo paciente";
  } else {
    previewAvatar.textContent = "?";
    previewAvatar.classList.remove("filled");
    previewName.textContent = "Nombre del paciente";
    previewSub.textContent = "Se completa mientras escribes";
  }
});

// Fecha de consulta por defecto: hoy
$("#f-fecha-consulta").value = "2026-07-31";

$("#cancel-btn").addEventListener("click", () => {
  if(confirm("¿Descartar los datos ingresados?")) window.location.href = "index.html";
});

function calcAge(dobStr){
  const today = new Date("2026-07-31");
  const dob = new Date(dobStr);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 0 ? age : "-";
}

function formatDOB(dobStr){
  if(!dobStr) return "No especificada";
  const [y,m,d] = dobStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatDNI(tipo, numero){
  const digits = (numero || "").replace(/\D/g,"");
  if(tipo === "DNI" && digits.length === 8){
    return `${digits.slice(0,2)} ${digits.slice(2,5)} ${digits.slice(5)}`;
  }
  return numero || "No especificado";
}

function savePatient(patient){
  let list = [];
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    list = raw ? JSON.parse(raw) : [];
  }catch(e){ list = []; }
  list.push(patient);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

$("#patient-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = $("#submit-btn");
  btn.classList.add("loading");
  btn.disabled = true;

  setTimeout(() => {
    const nombre = nombreInput.value.trim();
    const nacimiento = $("#f-nacimiento").value;
    const docTipo = $("#f-doc-tipo").value;
    const docNum = $("#f-doc-num").value.trim();
    const telefono = $("#f-telefono").value.trim();
    const apoderado = $("#f-apoderado").value.trim();
    const direccion = $("#f-direccion").value.trim();
    const fechaConsulta = $("#f-fecha-consulta").value || "2026-07-31";
    const tipoConsulta = $("#f-tipo-consulta").value;
    const motivo = $("#f-motivo").value.trim();

    const id = "p-" + Date.now();
    const patient = {
      id,
      nombre,
      iniciales: getInitials(nombre),
      edad: calcAge(nacimiento),
      dni: formatDNI(docTipo, docNum),
      telefono: telefono + (apoderado ? ` · Apoderado: ${apoderado}` : ""),
      nacimiento: formatDOB(nacimiento),
      direccion: direccion || "No especificada",
      ultimaVisita: fechaConsulta,
      tag: "Nueva paciente",
      consultas: [
        { fecha: fechaConsulta, tipo: tipoConsulta, nota: motivo || "Primera consulta registrada, sin notas adicionales." }
      ],
      archivos: [],
    };

    savePatient(patient);
    window.location.href = `index.html?nuevo=${id}`;
  }, 900);
});
