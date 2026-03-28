const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let serverProcess = null;
const PORT = 9005;

function startNextServer() {
  // In production (packaged), we need to start the Next.js server
  if (app.isPackaged) {
    const nextBin = path.join(process.resourcesPath, 'app', 'node_modules', 'next', 'dist', 'bin', 'next');
    const appPath = path.join(process.resourcesPath, 'app');
    
    serverProcess = spawn('node', [nextBin, 'start', '-p', PORT.toString()], {
      cwd: appPath,
      env: { ...process.env, NODE_ENV: 'production' }
    });

    serverProcess.stdout.on('data', (data) => console.log(`Server: ${data}`));
    serverProcess.stderr.on('data', (data) => console.error(`Server Error: ${data}`));
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#ffffff',
    title: 'DNTRNG™ - Intelligence Simplified (Initializing...)',
    show: false // Hide until ready
  });

  const url = `http://localhost:${PORT}`;

  // Protocol: Connection Retry Logic
  const checkServer = () => {
    http.get(url, (res) => {
      win.loadURL(url);
      win.show();
      win.setTitle('DNTRNG™ - Intelligence Simplified');
    }).on('error', () => {
      console.log('Waiting for registry node...');
      setTimeout(checkServer, 1000);
    });
  };

  if (app.isPackaged) {
    checkServer();
  } else {
    win.loadURL(url);
    win.show();
  }
  
  const template = [
    {
      label: 'Node',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' },
        { role: 'toggleDevTools' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  if (app.isPackaged) {
    startNextServer();
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
