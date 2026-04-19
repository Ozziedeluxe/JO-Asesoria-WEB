/**
 * JO Asesores — Trabaja con nosotros
 * Google Apps Script Web App
 *
 * DEPLOYMENT:
 * 1. Ir a script.google.com → Nuevo proyecto
 * 2. Pegar este código completo
 * 3. Clic en "Implementar" → "Nueva implementación"
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta de Google)
 *    - Quién tiene acceso: Cualquier usuario (Anyone)
 * 4. Copiar la URL generada y pegarla en index.html (variable APPS_SCRIPT_URL)
 */

// ─── CONFIGURACIÓN ───────────────────────────────────────────────
const SHEET_NAME   = 'Postulaciones';
const FOLDER_NAME  = 'JO Asesores — CVs';
const SPREADSHEET_NAME = 'JO Asesores — Trabaja con nosotros';

// ─── PUNTO DE ENTRADA POST ───────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const folder = getOrCreateFolder();

    // Guardar CV si viene en base64
    let cvLink = '—';
    if (data.cvBase64 && data.cvName) {
      cvLink = saveCVToDrive(folder, data.cvBase64, data.cvName);
    }

    // Escribir fila en el sheet
    sheet.appendRow([
      new Date(),                        // Fecha
      data.nombre     || '',             // Nombre
      data.email      || '',             // Email
      data.telefono   || '',             // WhatsApp
      data.especialidad || '',           // Especialidad
      cvLink,                            // Link al CV en Drive
      data.cvName     || 'Sin adjunto',  // Nombre del archivo
    ]);

    return buildResponse({ ok: true, message: 'Postulación registrada correctamente.' });

  } catch (err) {
    return buildResponse({ ok: false, error: err.message }, 500);
  }
}

// ─── GET: health check ───────────────────────────────────────────
function doGet() {
  return buildResponse({ ok: true, message: 'JO Asesores Jobs API activa.' });
}

// ─── HELPERS ─────────────────────────────────────────────────────

function getOrCreateSheet() {
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  let ss;

  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    const sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);

    // Cabeceras
    const headers = ['Fecha', 'Nombre', 'Email', 'WhatsApp', 'Especialidad', 'Link CV (Drive)', 'Archivo CV'];
    sheet.appendRow(headers);

    // Formato cabeceras
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#C8960C');
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);  // Fecha
    sheet.setColumnWidth(2, 200);  // Nombre
    sheet.setColumnWidth(3, 220);  // Email
    sheet.setColumnWidth(4, 140);  // WhatsApp
    sheet.setColumnWidth(5, 180);  // Especialidad
    sheet.setColumnWidth(6, 300);  // Link CV
    sheet.setColumnWidth(7, 200);  // Nombre archivo

    return sheet;
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

function saveCVToDrive(folder, base64Data, fileName) {
  // Eliminar el prefijo data:...;base64, si existe
  const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
  const decoded = Utilities.base64Decode(cleanBase64);
  const blob = Utilities.newBlob(decoded, detectMimeType(fileName), fileName);

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function detectMimeType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const mimes = {
    pdf:  'application/pdf',
    doc:  'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    png:  'image/png',
  };
  return mimes[ext] || 'application/octet-stream';
}

function buildResponse(data, statusCode) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
