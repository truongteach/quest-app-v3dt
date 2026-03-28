const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#ffffff',
    title: 'DNTRNG™ - Intelligence Simplified'
  });

  // Load the local Next.js server
  // Note: Ensure the port matches your package.json dev script
  win.loadURL('http://localhost:9002');
  
  // Optional: Hide menu bar for a cleaner 'app' look
  // win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});