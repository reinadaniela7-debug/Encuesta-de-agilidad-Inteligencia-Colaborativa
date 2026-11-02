/**
 * Recibe las postulaciones del formulario y las guarda como filas
 * en la hoja "Sugerencias" de esta Google Sheet (la crea sola la primera vez).
 * Instrucciones de instalación: ver LEEME.md
 */
const HOJA = 'Sugerencias';
const COLUMNAS = [
  ['fecha', 'Fecha'],
  ['postulante', 'Postulado por'],
  ['interaccion', 'Interacción a mejorar'],
  ['areas', 'Áreas involucradas'],
  ['numAreas', 'N.º de áreas'],
  ['impacto', 'Por qué es de alto impacto']
];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.accion === 'resultados') return resultados(d.clave);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const hoja = obtenerHoja();
      hoja.appendRow(COLUMNAS.map(([clave]) => limpiar(d[clave])));
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, motivo: 'formato' });
  }
}

/**
 * Entrega las postulaciones a la página de resultados, solo con la clave.
 * La clave NO va en este código (el repositorio es público): se guarda en
 * Configuración del proyecto › Propiedades de la secuencia de comandos,
 * con el nombre CLAVE_RESULTADOS.
 */
function resultados(clave) {
  const cache = CacheService.getScriptCache();
  const intentos = Number(cache.get('intentos') || 0);
  if (intentos >= 10) return json({ ok: false, motivo: 'bloqueado' });
  const real = PropertiesService.getScriptProperties().getProperty('CLAVE_RESULTADOS');
  if (!real) return json({ ok: false, motivo: 'sin_clave' });
  if (String(clave || '') !== real) {
    cache.put('intentos', String(intentos + 1), 600);
    return json({ ok: false, motivo: 'clave' });
  }
  const hoja = obtenerHoja();
  const valores = hoja.getDataRange().getValues();
  const titulos = valores.shift() || [];
  // Se busca cada columna por su título, por si alguien borró o movió columnas.
  const porTitulo = {};
  COLUMNAS.forEach(([campo, titulo]) => { porTitulo[titulo] = campo; });
  const filas = valores
    .filter(f => f.some(v => v !== ''))
    .map(f => {
      const o = {};
      titulos.forEach((t, i) => { const k = porTitulo[t]; if (k) o[k] = f[i] instanceof Date ? f[i].toISOString() : f[i]; });
      return o;
    });
  return json({ ok: true, filas: filas, hora: new Date().toISOString() });
}

// Menú en la hoja: Postulaciones › Configurar clave de resultados
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Postulaciones')
    .addItem('Configurar clave de resultados', 'configurarClave')
    .addToUi();
}

function configurarClave() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('Clave de resultados', 'Escribe la clave para ver la página de resultados:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const clave = r.getResponseText().trim();
  if (!clave) { ui.alert('La clave no puede estar vacía.'); return; }
  PropertiesService.getScriptProperties().setProperty('CLAVE_RESULTADOS', clave);
  ui.alert('Listo. La clave quedó guardada.');
}

function doGet() {
  return json({ ok: true, mensaje: 'El formulario de postulación está conectado.' });
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(COLUMNAS.map(([, titulo]) => titulo));
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
  }
  return hoja;
}

// Evita que un texto que empiece con = + - @ se interprete como fórmula.
function limpiar(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'number') return v;
  const s = String(v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
