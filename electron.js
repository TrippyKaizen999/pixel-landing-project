const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  // Load frontend served from backend (Vite build)
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) serverProcess.kill();
  });
}

app.whenReady().then(() => {
  // Start the backend (dist/server/node-build.mjs)
  const serverPath = path.join(__dirname, 'dist', 'server', 'node-build.mjs');
  serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit',
    shell: true,
  });

  // Give backend time to start before launching window
  setTimeout(() => {
    createWindow();
  }, 1500); // adjust if needed
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
