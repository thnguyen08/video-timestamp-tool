const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Video Timestamp Overlay',
    backgroundColor: '#0f172a',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);

  // Khi xuất video, luôn hiện hộp thoại "Lưu file" để người dùng chọn nơi lưu
  win.webContents.session.on('will-download', (event, item) => {
    const defaultPath = path.join(app.getPath('downloads'), item.getFilename());
    const chosenPath = dialog.showSaveDialogSync(win, {
      title: 'Lưu video',
      defaultPath,
      filters: [{ name: 'Video MP4', extensions: ['mp4'] }],
    });
    if (chosenPath) {
      item.setSavePath(chosenPath);
    } else {
      item.cancel();
    }
  });

  win.loadFile('index.html');
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
