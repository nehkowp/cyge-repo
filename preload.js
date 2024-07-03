const { contextBridge, ipcRenderer } = require('electron');
const {exec} = require('child_process');

contextBridge.exposeInMainWorld('electronAPI', {
  submitSignIn: (login, password) => ipcRenderer.send('submit-login', { login, password }),
  onLoginResponse: (callback) => ipcRenderer.on('login-response', callback),
  submitSignUp: (nom, prenom, login, password, lang) => ipcRenderer.send('submit-signup', { nom, prenom, login, password, lang }),
  onSignUpResponse: (callback) => ipcRenderer.on('signup-response', callback),
  // spawnProcess: (cmd, arg) => child_process.spawn(cmd, arg, {encoding: 'utf8'}),
});
