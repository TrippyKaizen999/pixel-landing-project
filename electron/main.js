"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
        },
        titleBarStyle: "default",
        icon: path.join(__dirname, "../public/icon.png"),
        show: false,
        backgroundColor: "#1a1a1a",
        darkTheme: true,
    });
    // Show window when ready to prevent visual flash
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    // Load the app
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
        mainWindow.loadURL("http://localhost:8080");
        // Open DevTools in development
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, "../dist/spa/index.html"));
    }
    // Set up menu
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "Upload Clip",
                    accelerator: "CmdOrCtrl+U",
                    click: () => {
                        mainWindow.webContents.send("navigate-to", "/upload");
                    },
                },
                { type: "separator" },
                {
                    role: "quit",
                },
            ],
        },
        {
            label: "View",
            submenu: [
                { role: "reload" },
                { role: "forceReload" },
                { role: "toggleDevTools" },
                { type: "separator" },
                { role: "resetZoom" },
                { role: "zoomIn" },
                { role: "zoomOut" },
                { type: "separator" },
                { role: "togglefullscreen" },
            ],
        },
        {
            label: "Window",
            submenu: [{ role: "minimize" }, { role: "close" }],
        },
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
