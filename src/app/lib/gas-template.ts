
export const GAS_CODE = `
/**
 * QUESTFLOW BACKEND v3.0 - SHEET AUTH MODE
 * 
 * 1. Create a Google Sheet.
 * 2. Tab "Questions": test_id, id, question_text, question_type, options, correct_answer, order_group, image_url, metadata, required
 * 3. Tab "Users": email, role
 * 4. Tab "Responses": Timestamp, Test ID, Score, Total, Duration (ms), Raw Responses
 * 5. Deploy as Web App (Access: Anyone).
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const action = e.parameter.action;

  // Handle Role Checking & Login
  if (action === 'getRole' || action === 'login') {
    const email = e.parameter.email;
    if (!email) return createResponse({ error: 'Email is required' }, 400);

    const usersSheet = ss.getSheetByName('Users');
    if (!usersSheet) {
      return createResponse({ role: 'user' }); // Default to user if no sheet exists
    }
    
    const data = usersSheet.getDataRange().getValues();
    data.shift(); // Remove headers
    
    const userRow = data.find(row => String(row[0]).toLowerCase() === email.toLowerCase());
    
    if (userRow) {
      return createResponse({ 
        email: userRow[0], 
        role: userRow[1] || 'user'
      });
    } else {
      return createResponse({ error: 'User not found' }, 404);
    }
  }

  // Handle Question Fetching
  const testId = e.parameter.id;
  const sheet = ss.getSheetByName('Questions');
  
  if (!sheet) {
    return createResponse({ error: 'Questions sheet not found' }, 404);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const questions = data
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    })
    .filter(q => {
      if (!testId) return true;
      return String(q.test_id) === String(testId);
    });
  
  return createResponse(questions);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let responsesSheet = ss.getSheetByName('Responses');
    
    if (!responsesSheet) {
      responsesSheet = ss.insertSheet('Responses');
      responsesSheet.appendRow(['Timestamp', 'Test ID', 'Score', 'Total', 'Duration (ms)', 'Raw Responses']);
    }
    
    const payload = JSON.parse(e.postData.contents);
    const { testId, score, total, duration, responses } = payload;
    
    responsesSheet.appendRow([
      new Date(),
      testId || 'N/A',
      score || 0,
      total || 0,
      duration || 0,
      JSON.stringify(responses)
    ]);
    
    return createResponse({ status: 'success', message: 'Response recorded' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() }, 500);
  }
}

function createResponse(data, code = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
