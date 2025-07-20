const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,  // more secure, recommended
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8080');
    win.webContents.openDevTools();  // open devtools in dev mode
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'spa', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

