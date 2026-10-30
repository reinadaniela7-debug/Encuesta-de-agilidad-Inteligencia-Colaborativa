/**
 * Recibe las postulaciones del formulario y las guarda como filas
 * en la hoja "Postulaciones" de esta Google Sheet.
 * Instrucciones de instalación: ver LEEME.md
 */
const HOJA = 'Postulaciones';
const COLUMNAS = [
  ['fecha', 'Fecha'],
  ['nombre', 'Proyecto'],
  ['problema', 'Problema que resuelve'],
  ['postulante', 'Postulado por'],
  ['sponsor', 'Sponsor'],
  ['localidad', 'Localidad'],
  ['areas', 'Áreas involucradas'],
  ['numAreas', 'N.º de áreas'],
  ['inversion', 'Inversión adicional'],
  ['duracion', 'Duración estimada'],
  ['claridad', 'Falta de claridad (1-5)'],
  ['alineacion', 'Falta de alineación (1-5)'],
  ['zona', 'Zona de Stacey'],
  ['multiarea', 'Multiárea'],
  ['recursos', 'Recursos acotados'],
  ['dias100', '100 días'],
  ['complejo', 'Zona compleja'],
  ['criterios', 'Criterios que cumple (de 4)'],
  ['respuestasClaridad', 'Respuestas claridad'],
  ['respuestasAlineacion', 'Respuestas alineación']
];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
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
