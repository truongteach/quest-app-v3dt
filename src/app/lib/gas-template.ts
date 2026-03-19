
export const GAS_CODE = `
/**
 * QUESTFLOW BACKEND v8.0 - MULTI-SHEET ARCHITECTURE
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Create these core tabs: "Tests", "Users", "Responses".
 * 3. Create a NEW tab for EACH test you want to run (e.g., "demo-1").
 * 
 * 4. Deploy as Web App (Execute as: Me, Access: Anyone).
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action;

  // --- ACTION: login ---
  if (action === 'login') {
    const email = e.parameter.email;
    const password = e.parameter.password;
    if (!email) return createResponse({ error: 'Email required' }, 400);

    const usersSheet = ss.getSheetByName('Users');
    if (!usersSheet) return createResponse({ error: 'Users tab not found' }, 404);
    
    const data = usersSheet.getDataRange().getValues();
    const headers = data.shift();
    const emailIdx = headers.indexOf('email');
    const roleIdx = headers.indexOf('role');
    const nameIdx = headers.indexOf('name');
    const passIdx = headers.indexOf('password');
    const idIdx = headers.indexOf('id');
    
    const userRow = data.find(row => String(row[emailIdx]).toLowerCase() === email.toLowerCase());
    
    if (userRow) {
      if (passIdx !== -1 && String(userRow[passIdx]) !== String(password)) {
        return createResponse({ error: 'Invalid password' }, 401);
      }
      return createResponse({ 
        id: idIdx !== -1 ? userRow[idIdx] : null,
        email: userRow[emailIdx], 
        role: userRow[roleIdx] || 'user',
        name: nameIdx !== -1 ? userRow[nameIdx] : email.split('@')[0]
      });
    }
    return createResponse({ error: 'User not found' }, 403);
  }

  // --- ACTION: getTests ---
  if (action === 'getTests') {
    const sheet = ss.getSheetByName('Tests');
    if (!sheet) return createResponse({ error: 'Tests tab not found' }, 404);
    
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const tests = data.map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    return createResponse(tests);
  }

  // --- DEFAULT ACTION: Get Questions for a specific Sheet (Test ID) ---
  const testId = e.parameter.id;
  if (!testId) return createResponse({ error: 'No test ID provided' }, 400);

  const sheet = ss.getSheetByName(testId);
  if (!sheet) return createResponse({ error: 'Question sheet "' + testId + '" not found' }, 404);

  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const questions = data.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  
  return createResponse(questions);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let responsesSheet = ss.getSheetByName('Responses');
    if (!responsesSheet) {
      responsesSheet = ss.insertSheet('Responses');
      responsesSheet.appendRow(['Timestamp', 'Test ID', 'Score', 'Total', 'Duration (ms)', 'Raw Responses']);
    }
    const payload = JSON.parse(e.postData.contents);
    responsesSheet.appendRow([
      new Date(),
      payload.testId || 'N/A',
      payload.score || 0,
      payload.total || 0,
      payload.duration || 0,
      JSON.stringify(payload.responses)
    ]);
    return createResponse({ status: 'success' });
  } catch (err) {
    return createResponse({ error: err.toString() }, 500);
  }
}

function createResponse(data, code = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
