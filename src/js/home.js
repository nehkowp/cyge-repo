
const programs = ["mysql", "python", "code", "npm", "node"];
const programNames = ["MySQL", "Python", "VSCode", "NPM", "Node"];

function isProgramInstalled(program) {
	return new Promise((resolve, _) => {
    window.electronAPI.childProcessExec(`${program} --version`, (err, stdout, stderr) => {
      resolve({installed: err == null, version: stdout.match(/\d+\.\d+\.\d+/g)});
    });
  });
}

window.electronAPI.onUserProfile((event, user) => {
  const profileDiv = document.getElementById('user-info-box');
  profileDiv.innerHTML = `
    <p><strong>Nom:</strong> ${user.nom}</p>
    <p><strong>Prénom:</strong> ${user.prenom}</p>
    <p><strong>Mot de passe:</strong> •••••••••••</p>
    <p><strong>Langage Préféré:</strong> ${user.lang}</p>
  `;
  document.title = `Accueil | ${user.prenom}`;
  const overlayPanel = document.querySelector('.overlay-panel.overlay-right h1');
  overlayPanel.textContent = `Bienvenue ${user.prenom} !`;
});

document.addEventListener("DOMContentLoaded", async () => {


  const showVersionButton = document.getElementById('showVersion');
  const showUserButton = document.getElementById('showUser');
  const logOutButton = document.getElementById('logOut');
  const container = document.getElementById('container');
  

  logOutButton.addEventListener('click', () => {
    window.electronAPI.sendLogout('log-out');
  });


  showVersionButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
  });
  
  showUserButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
  });
  
  const programContainer = document.getElementsByClassName("program-version-box")[0];

  for (let i = 0; i < programs.length; i++) {
    const results = await isProgramInstalled(programs[i]);

    let node = document.createElement("p");
    node.innerHTML = `<strong>${programNames[i]}:</strong> ${results.installed ? results.version : "Pas installé"}`;

    programContainer.append(node);
  }

}, false);
