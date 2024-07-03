const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  win.loadFile('index.html');
}

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

// Gestion de la soumission du formulaire de connexion
ipcMain.on('submit-login', (event, { login, password }) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'your_database'
  });

  connection.connect();

  connection.query(
    'SELECT * FROM users WHERE login = ? AND password = ?',
    [login, password],
    (err, results) => {
      if (err) {
        console.error(err);
        event.reply('login-response', { success: false, message: 'Database error' });
      } else if (results.length > 0) {
        event.reply('login-response', { success: true, message: 'Login successful' });
      } else {
        event.reply('login-response', { success: false, message: 'Invalid login or password' });
      }

      connection.end();
    }
  );
});
