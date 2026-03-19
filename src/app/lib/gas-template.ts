export const GAS_CODE = `
/**
 * QUESTFLOW BACKEND
 * Deploy this as a Web App with "Anyone" access.
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Questions');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const questions = data.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(questions))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let responsesSheet = ss.getSheetByName('Responses');
  
  if (!responsesSheet) {
    responsesSheet = ss.insertSheet('Responses');
    responsesSheet.appendRow(['Timestamp', 'QuizData']);
  }
  
  const payload = JSON.parse(e.postData.contents);
  responsesSheet.appendRow([new Date(), JSON.stringify(payload)]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;