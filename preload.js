const { contextBridge, ipcRenderer } = require('electron');
const child_process = require('child_process');

contextBridge.exposeInMainWorld('electronAPI', {
  submitSignIn: (login, password) => ipcRenderer.send('submit-login', { login, password }),
  onLoginResponse: (callback) => ipcRenderer.on('login-response', callback),
  submitSignUp: (nom, prenom, login, password, lang) => ipcRenderer.send('submit-signup', { nom, prenom, login, password, lang }),
  onSignUpResponse: (callback) => ipcRenderer.on('signup-response', callback),
  onUserProfile: (callback) => ipcRenderer.on('user-profile', callback),
  sendLogout: (channel, data) => ipcRenderer.send(channel, data),
  receiveLogout: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  childProcessExec: child_process.exec,
});

