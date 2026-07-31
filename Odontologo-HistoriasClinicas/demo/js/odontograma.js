// ===================== Odontograma =====================
// Odontograma interactivo con numeración FDI (la que se usa en Perú).
// El doctor hace clic en una pieza, elige una condición y agrega una nota;
// queda guardado por paciente en localStorage (solo para esta demo).

const ODONTO_STORAGE_KEY = "consultorioBertilDemoOdontograma";
let odontoSelectedTooth = null;

const FDI_UPPER = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28];
const FDI_LOWER = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38];

const ODONTO_CONDITIONS = {
  caries:      { label: "Caries",       color: "#d9694c" },
  obturacion:  { label: "Obturación",   color: "#3a7ca8" },
  endodoncia:  { label: "Endodoncia",   color: "#8b5fbf" },
  extraccion:  { label: "Extracción",   color: "#8b8b86" },
  implante:    { label: "Implante",     color: "#16324f" },
  preventivo:  { label: "Preventivo",   color: "#4a9b6b" },
};

function odontoLoadOverrides(){
  try{
    const raw = localStorage.getItem(ODONTO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}

function odontoGetData(patient){
  const overrides = odontoLoadOverrides();
  const patientOverrides = overrides[patient.id] || {};
  return Object.assign({}, patient.odontograma || {}, patientOverrides);
}

function odontoSaveTooth(patientId, tooth, condicion, nota){
  const overrides = odontoLoadOverrides();
  if(!overrides[patientId]) overrides[patientId] = {};
  if(!condicion){
    delete overrides[patientId][tooth];
  } else {
    overrides[patientId][tooth] = { condicion, nota: nota || "" };
  }
  localStorage.setItem(ODONTO_STORAGE_KEY, JSON.stringify(overrides));
}

function toothSizing(n){
  const last = n % 10;
  if(last <= 2) return { w: 17, h: 23 };
  if(last === 3) return { w: 18, h: 25 };
  if(last <= 5) return { w: 20, h: 26 };
  return { w: 24, h: 28 };
}

function toothGroup(n, data, cx, cy, labelAbove){
  const info = data[n];
  const cond = info && info.condicion ? ODONTO_CONDITIONS[info.condicion] : null;
  const fill = cond ? cond.color : "#fbfaf5";
  const stroke = cond ? cond.color : "#cdc6b8";
  const { w, h } = toothSizing(n);
  const selected = odontoSelectedTooth === n;
  const label = labelAbove
    ? `<text x="${cx}" y="${cy - h/2 - 7}" class="tooth-num">${n}</text>`
    : `<text x="${cx}" y="${cy + h/2 + 16}" class="tooth-num">${n}</text>`;
  const noteDot = info && info.nota ? `<circle cx="${cx + w/2 - 2}" cy="${cy - h/2 + 2}" r="2.6" class="tooth-note-dot"/>` : "";
  const xMark = info && info.condicion === "extraccion"
    ? `<path d="M${cx-w/2+3},${cy-h/2+3} L${cx+w/2-3},${cy+h/2-3} M${cx+w/2-3},${cy-h/2+3} L${cx-w/2+3},${cy+h/2-3}" class="tooth-x"/>`
    : "";
  return `
    <g class="tooth-g ${selected ? 'is-selected' : ''}" data-tooth="${n}">
      ${label}
      <g transform="translate(${cx - w/2},${cy - h/2})">
        <use href="#tooth-shape" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}"/>
      </g>
      ${xMark}
      ${noteDot}
    </g>
  `;
}

function odontogramSVG(patient, data){
  const spacing = 33;
  const marginX = 26;
  const upperY = 46;
  const lowerY = 150;
  const width = marginX * 2 + spacing * 15 + 10;

  const upperTeeth = FDI_UPPER.map((n, i) => toothGroup(n, data, marginX + i*spacing, upperY, true)).join("");
  const lowerTeeth = FDI_LOWER.map((n, i) => toothGroup(n, data, marginX + i*spacing, lowerY, false)).join("");
  const midX = marginX + 7.5*spacing;

  return `
    <svg viewBox="0 0 ${width} 190" class="odonto-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="tooth-shape" viewBox="0 0 24 32">
          <rect x="2" y="2" width="20" height="14" rx="6"/>
          <path d="M7,15 L10,15 L9,29 C9,30.3 7.7,30.3 7.5,29 Z"/>
          <path d="M14,15 L17,15 L16.5,29 C16.3,30.3 15,30.3 15,29 Z"/>
        </symbol>
      </defs>
      <text x="${width/2}" y="14" class="arch-label">SUPERIOR</text>
      <line x1="${midX}" y1="24" x2="${midX}" y2="90" class="quad-divider"/>
      ${upperTeeth}
      <line x1="${midX}" y1="112" x2="${midX}" y2="178" class="quad-divider"/>
      ${lowerTeeth}
      <text x="${width/2}" y="188" class="arch-label">INFERIOR</text>
      <text x="${marginX}" y="102" class="quad-label">DERECHA</text>
      <text x="${width - marginX}" y="102" class="quad-label" text-anchor="end">IZQUIERDA</text>
    </svg>
  `;
}

function odontoLegendHTML(){
  return `
    <div class="odonto-legend">
      ${Object.entries(ODONTO_CONDITIONS).map(([key, c]) => `
        <span class="odonto-legend-item"><i style="background:${c.color}"></i>${c.label}</span>
      `).join("")}
    </div>
  `;
}

function odontoEditorHTML(patient, data){
  if(!odontoSelectedTooth){
    return `<div class="odonto-editor-empty">Haz clic en una pieza del odontograma para registrar un diagnóstico o nota.</div>`;
  }
  const n = odontoSelectedTooth;
  const info = data[n] || {};
  const options = Object.entries(ODONTO_CONDITIONS).map(([key, c]) =>
    `<option value="${key}" ${info.condicion === key ? "selected" : ""}>${c.label}</option>`
  ).join("");

  return `
    <div class="odonto-editor">
      <p class="odonto-editor-title">Pieza ${n}</p>
      <div class="form-grid-2">
        <div class="form-field">
          <label class="field-label">Condición</label>
          <select class="field-input" id="odonto-condicion">
            <option value="">Sin hallazgo</option>
            ${options}
          </select>
        </div>
        <div class="form-field">
          <label class="field-label">Nota de referencia</label>
          <input class="field-input" id="odonto-nota" type="text" placeholder="Ej. Caries M-O" value="${info.nota ? info.nota.replace(/"/g,'&quot;') : ''}">
        </div>
      </div>
      <div class="odonto-editor-actions">
        <button class="btn-cancel" id="odonto-cancel" type="button">Cancelar</button>
        <button class="btn-sm" id="odonto-guardar" type="button">Guardar pieza ${n}</button>
      </div>
    </div>
  `;
}

function odontoNotesListHTML(data){
  const entries = Object.entries(data).sort((a,b) => Number(a[0]) - Number(b[0]));
  if(!entries.length){
    return `<div class="empty-state">Sin diagnósticos registrados todavía.</div>`;
  }
  return `
    <div class="odonto-notes-list">
      ${entries.map(([n, info]) => {
        const cond = ODONTO_CONDITIONS[info.condicion];
        return `
          <div class="odonto-note-row" data-edit-tooth="${n}">
            <span class="odonto-note-dot" style="background:${cond ? cond.color : '#ccc'}"></span>
            <span class="odonto-note-tooth">${n}</span>
            <span class="odonto-note-cond">${cond ? cond.label : ""}</span>
            <span class="odonto-note-txt">${info.nota || ""}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function odontogramaPanelHTML(patient){
  const data = odontoGetData(patient);
  return `
    <div class="panel" id="odontograma-panel">
      <div class="panel-head">
        <h3>Odontograma</h3>
        <span class="tag muted">${Object.keys(data).length} piezas con hallazgos</span>
      </div>
      <div class="odonto-body">
        ${odontoLegendHTML()}
        <div class="odonto-chart-wrap">${odontogramSVG(patient, data)}</div>
        <div id="odonto-editor-slot">${odontoEditorHTML(patient, data)}</div>
        <p class="form-section-title" style="margin-top:20px;">Diagnóstico y notas</p>
        <div id="odonto-notes-slot">${odontoNotesListHTML(data)}</div>
      </div>
    </div>
  `;
}

function bindOdontogramaEvents(patient){
  const svg = document.querySelector("#odontograma-panel .odonto-svg");
  if(!svg) return;

  function refresh(){
    const data = odontoGetData(patient);
    document.querySelector(".odonto-chart-wrap").innerHTML = odontogramSVG(patient, data);
    document.getElementById("odonto-editor-slot").innerHTML = odontoEditorHTML(patient, data);
    document.getElementById("odonto-notes-slot").innerHTML = odontoNotesListHTML(data);
    document.querySelector("#odontograma-panel .panel-head .tag").textContent = `${Object.keys(data).length} piezas con hallazgos`;
    bindOdontogramaEvents(patient);
  }

  document.querySelectorAll("#odontograma-panel .tooth-g").forEach(g => {
    g.addEventListener("click", () => {
      odontoSelectedTooth = Number(g.dataset.tooth);
      refresh();
      const editor = document.getElementById("odonto-editor-slot");
      if(editor) editor.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  document.querySelectorAll("#odontograma-panel .odonto-note-row").forEach(row => {
    row.addEventListener("click", () => {
      odontoSelectedTooth = Number(row.dataset.editTooth);
      refresh();
    });
  });

  const guardarBtn = document.getElementById("odonto-guardar");
  if(guardarBtn){
    guardarBtn.addEventListener("click", () => {
      const condicion = document.getElementById("odonto-condicion").value;
      const nota = document.getElementById("odonto-nota").value.trim();
      odontoSaveTooth(patient.id, odontoSelectedTooth, condicion, nota);
      odontoSelectedTooth = null;
      refresh();
    });
  }
  const cancelBtn = document.getElementById("odonto-cancel");
  if(cancelBtn){
    cancelBtn.addEventListener("click", () => {
      odontoSelectedTooth = null;
      refresh();
    });
  }
}
