const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  submitSignIn: (login, password) => ipcRenderer.send('submit-login', { login, password }),
  onLoginResponse: (callback) => ipcRenderer.on('login-response', callback),
  submitSignUp: (nom, prenom, login, password, lang) => ipcRenderer.send('submit-signup', { nom, prenom, login, password, lang }),
  onSignUpResponse: (callback) => ipcRenderer.on('signup-response', callback)
});
