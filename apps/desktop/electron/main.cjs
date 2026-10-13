const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'Hoàng Bảo Cosmetics - Retail & Warehouse Desktop',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Xử lý IPC: In hóa đơn nhiệt
ipcMain.handle('print-receipt', async (event, htmlContent) => {
  if (!mainWindow) return { success: false, message: 'Window not found' };

  const printWin = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true }
  });

  await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

  return new Promise((resolve) => {
    printWin.webContents.print({ silent: false, printBackground: true }, (success, failureReason) => {
      printWin.close();
      resolve({ success, message: failureReason || 'OK' });
    });
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
