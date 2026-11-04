const SPREADSHEET_ID = '1sNPsVV8Tx6lE7S830mYm9yrfCTpO5B4GGHFGJjmiLy4';
const SHEET_NAME = 'BD Preventas';

// Conserva aquí los correos autorizados que ya tenías.
const USUARIOS_AUTORIZADOS = [
  'cmendez@ayvi.com.mx',
  'acruz@ayvi.com.mx',
  'acorrientes@ayvi.com.mx',
  'fecarrillo@ayvi.com.mx',
  'jmunoz@ayvi.com.mx',
  'jfernandez@ayvi.com.mx',
  'josanchez@ayvi.com.mx',
  'lprior@ayvi.com.mx',
  'legarcia@ayvi.com.mx',
  'lmontemayor@ayvi.com.mx',
  'mgarcia@ayvi.com.mx',
  'oaguirre@ayvi.com.mx',
  'orhernandez@ayvi.com.mx',
  'rberrones@ayvi.com.mx',
  'jcibrian@ayvi.com.mx'
];

/**
 * Esta función permite abrir el dashboard en el navegador.
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Dashboard Preventas');
}

/**
 * Consulta los datos de Google Sheets y los entrega al HTML.
 */
function getDashboardData() {
  const correo = (
    Session.getActiveUser().getEmail() || ''
  ).trim().toLowerCase();

  if (
    !correo ||
    !USUARIOS_AUTORIZADOS.some(
      email => email.trim().toLowerCase() === correo
    )
  ) {
    throw new Error(
      'Tu cuenta no está autorizada o Google no pudo identificar tu correo.'
    );
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(
      'No se encontró la pestaña "' + SHEET_NAME + '".'
    );
  }

  const ultimaFila = sheet.getLastRow();
  const ultimaColumna = sheet.getLastColumn();

  if (ultimaFila < 2 || ultimaColumna < 1) {
    return {
      columns: [],
      rows: []
    };
  }

  const values = sheet
    .getRange(1, 1, ultimaFila, ultimaColumna)
    .getDisplayValues();

  // Los encabezados están en la fila 2.
  const columns = values[1].map(
    encabezado => String(encabezado).trim()
  );

  // Los registros comienzan en la fila 3.
  const rows = values
    .slice(2)
    .filter(fila => fila.some(celda => String(celda).trim() !== ''))
    .map(fila => {
      const registro = {};

      columns.forEach((columna, indice) => {
        if (columna !== '') {
          registro[columna] = fila[indice] ?? '';
        }
      });

      return registro;
    });

  return {
    columns: columns,
    rows: rows
  };
}
