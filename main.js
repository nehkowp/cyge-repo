const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();


function setupDb() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  connection.connect();

  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  connection.query(`use ${process.env.DB_NAME}`);
  
  connection.query(`CREATE TABLE IF NOT EXISTS users (
    nom MEDIUMTEXT,
    prenom MEDIUMTEXT,
    login MEDIUMTEXT,
    password MEDIUMTEXT,
    lang MEDIUMTEXT
  )`);

  return connection;
}


function main() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });
  
  win.loadFile('index.html');

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
    const connection = setupDb();
  
    connection.query(
      'SELECT * FROM users WHERE login = ? AND password = ?',
      [login, password],
      (err, results) => {
        if (err) {
          console.error(err);
          event.reply('login-response', { success: false, message: 'Database error' });
        } else if (results.length > 0) {
          const user = results[0];
          event.reply('login-response', { success: true, message: 'Login successful', user });
  
          // Chargez la page de profil utilisateur avec les informations de l'utilisateur
          win.loadURL(`file://${__dirname}/src/screens/home.html`);
  
          // Écoutez lorsque la page est prête pour envoyer les informations de l'utilisateur
          win.webContents.once('did-finish-load', () => {
            win.webContents.send('user-profile', user);
          });
        } else {
          event.reply('login-response', { success: false, message: 'Invalid login or password' });
        }
  
        connection.end();
      }
    );
  });
  
  
  ipcMain.on('submit-signup', (event, { nom, prenom, login, password, lang }) => {
    const connection = setupDb();
    
    connection.query(
      'INSERT INTO users (nom, prenom, login, password, lang) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, login, password, lang],
      (err, results) => {
        if (err) {
          console.error(err);
          event.reply('signup-response', { success: false, message: 'Database error' });
        } else if (results.length > 0) {
          const user = results[0];
          event.reply('signup-response', { success: true, message: 'Login successful', user });
  
          // Chargez la page de profil utilisateur avec les informations de l'utilisateur
          win.loadURL(`file://${__dirname}/src/screens/home.html`);
  
          // Écoutez lorsque la page est prête pour envoyer les informations de l'utilisateur
          win.webContents.once('did-finish-load', () => {
            win.webContents.send('user-profile', user);
          });
        } else {
          event.reply('signup-response',{ success: false, message: 'Invalid session' });
        }
        connection.end();
        win.loadURL(`file://${__dirname}/src/screens/home.html`);
      }
    );
  });
}

app.whenReady().then(main);
