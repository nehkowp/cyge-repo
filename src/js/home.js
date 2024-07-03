
const programs = ["mysql", "python", "code", "npm", "node"];

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
    <p><strong>Login:</strong> ${user.login}</p>
    <p><strong>Lang:</strong> ${user.lang}</p>
  `;
  document.title = `Accueil | ${user.prenom}`;
  const overlayPanel = document.querySelector('.overlay-panel.overlay-right h1');
  overlayPanel.textContent = `Bienvenue ${user.prenom} !`;
});

document.addEventListener("DOMContentLoaded", async () => {


  const signUpButton = document.getElementById('showVersion');
  const signInButton = document.getElementById('showUser');
  const container = document.getElementById('container');
  
  signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
  });
  
  signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
  });
  
  const programContainer = document.getElementsByClassName("program-version-box")[0];

  for (const program of programs) {

    const results = await isProgramInstalled(program);

    let node = document.createElement("p");
    node.innerHTML = `<strong>${program}:</strong> ${results.installed ? results.version : "Pas installé"}`;

    programContainer.append(node);
  }

}, false);
