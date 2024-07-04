const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const bcrypt = require('bcrypt');
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
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    nom MEDIUMTEXT NOT NULL,
    prenom MEDIUMTEXT NOT NULL,
    login MEDIUMTEXT NOT NULL,
    password MEDIUMTEXT NOT NULL,
    lang MEDIUMTEXT NOT NULL,
    PRIMARY KEY (id)
  )`);

  return connection;
}


function main() {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });
  win.maximize();
  
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
      'SELECT * FROM users WHERE login = ?',
      [login],
      async (err, results) => {
        if (err) {
          console.error(err);
          event.reply('login-response', { success: false, message: 'Impossible de se connecter' });
          connection.end();
        } else if (results.length > 0) {
          const user = results[0];
          console.log(password, user.password);
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            event.reply('login-response', { success: true, message: 'connexion réussie', user });
  
            // Chargez la page de profil utilisateur avec les informations de l'utilisateur
            win.loadURL(`file://${__dirname}/src/screens/home.html`);
  
            // Écoutez lorsque la page est prête pour envoyer les informations de l'utilisateur
            win.webContents.once('did-finish-load', () => {
              win.webContents.send('user-profile', user);
            });
          } else {
            event.reply('login-response', { success: false, message: 'Identifiant ou mot de passe incorrect' });
          }
        } else {
          event.reply('login-response', { success: false, message: 'Identifiant ou mot de passe incorrect' });
        }
  
        connection.end();
      }
    );
  });
  
  
  ipcMain.on('submit-signup', (event, { nom, prenom, login, password, lang }) => {
    const connection = setupDb();
    
    connection.query(
      'INSERT INTO users (id, nom, prenom, login, password, lang) VALUES (NULL, ?, ?, ?, ?, ?)',
      [nom, prenom, login, password, lang],
      (err, results) => {
        if (err) {
          console.error(err);
          event.reply('signup-response', { success: false, message: "Impossible de créer l'utilisateur" });
        } else{
          const user = {nom, prenom, login, password, lang};
          console.log(user);
          event.reply('signup-response', { success: true, message: 'Connexion réussie', user });
  
          // Chargez la page de profil utilisateur avec les informations de l'utilisateur
          win.loadURL(`file://${__dirname}/src/screens/home.html`);
  
          // Écoutez lorsque la page est prête pour envoyer les informations de l'utilisateur
          win.webContents.once('did-finish-load', () => {
            win.webContents.send('user-profile', user);
          });
        }
        connection.end();
      }
    );
  });


  ipcMain.on('log-out', (event) => {
    let win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.loadURL(`file://${__dirname}/index.html`);
    }
  });

  ipcMain.handle('hash-password', async (event, password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  });

  ipcMain.on('submit-edit', async (event, { group, data, userid }) => {
    const connection = setupDb();
    let update = {};
    update[group] = data;
    console.log(userid, group, data, update);
    connection.query(
      'UPDATE users SET ? WHERE id = ?',
      [update, userid],
      async (err, results) => {
        console.log("updated");
        if (err) {
          event.reply('edit-response', { success: false, message: "Impossible de modifier l'utilisateur" });
        } else {
          event.reply('edit-response', { success: true, message: "Modification effectuée avec succès" });
        }
      }
    );
  });

}

app.whenReady().then(main);
