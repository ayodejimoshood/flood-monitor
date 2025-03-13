const { app, BrowserWindow, Menu, Tray, nativeImage, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

let mainWindow;
let tray = null;

// Platform-specific window settings
const getWindowOptions = () => {
  const baseOptions = {
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icons', 'icon.png')
  };

  if (isMac) {
    return {
      ...baseOptions,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 20, y: 20 },
      vibrancy: 'under-window',
      visualEffectState: 'active'
    };
  }

  if (isWindows) {
    return {
      ...baseOptions,
      frame: false,
      transparent: false,
      backgroundColor: '#ffffff'
    };
  }

  // Linux default
  return baseOptions;
};

function createWindow() {
  mainWindow = new BrowserWindow(getWindowOptions());

  const startUrl = isDev
    ? `http://localhost:${port}`
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools if in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create platform-specific menus
  createMenu();
  
  // Create tray icon
  createTray();
}

function createMenu() {
  // Base menu template
  const baseTemplate = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About UK Flood Monitor',
          click: async () => {
            await shell.openExternal('https://github.com/ayodejimoshood/flood-monitor');
          }
        }
      ]
    }
  ];

  // Mac-specific menu customizations
  if (isMac) {
    const macTemplate = [
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      ...baseTemplate.slice(1) // Skip the File menu for Mac
    ];
    
    const menu = Menu.buildFromTemplate(macTemplate);
    Menu.setApplicationMenu(menu);
  } else {
    // Windows/Linux menu
    const menu = Menu.buildFromTemplate(baseTemplate);
    Menu.setApplicationMenu(menu);
  }
}

function createTray() {
  // Skip tray creation in development mode
  if (isDev) return;
  
  // Create tray icon
  const iconPath = path.join(__dirname, 'icons', 'tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Open UK Flood Monitor', 
      click: () => {
        if (mainWindow === null) {
          createWindow();
        } else {
          mainWindow.show();
        }
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => { 
        app.quit(); 
      } 
    }
  ]);
  
  tray.setToolTip('UK Flood Monitor');
  tray.setContextMenu(contextMenu);
  
  // Platform-specific tray behavior
  if (isMac) {
    tray.on('click', () => {
      if (mainWindow === null) {
        createWindow();
      } else {
        mainWindow.show();
      }
    });
  } else if (isWindows) {
    tray.on('click', () => {
      if (mainWindow === null) {
        createWindow();
      } else if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    });
  }
}

// Handle IPC events for window controls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (isWindows && require('electron-squirrel-startup')) {
  app.quit();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// For Windows custom frame
if (isWindows) {
  app.on('browser-window-created', (_, window) => {
    window.on('ready-to-show', () => {
      // Custom title bar handling can be added here
    });
  });
} 