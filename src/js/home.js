
const programs = ["mysql", "python", "code", "npm", "node"];

function isProgramInstalled(program) {
	return new Promise((resolve, _) => {
    let process = exec(`${program} --version`);
    process.on('error', () => resolve(false));
    process.on('close', () => resolve(true));
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


    const signUpButton = document.getElementById('showUser');
    const signInButton = document.getElementById('showVersion');
    const container = document.getElementById('container');
    
    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });
    
    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
    

  // for (const program of programs) {
  //   console.log(`Checking ${program}`);
  //   console.log(`${program} installed: ${await isProgramInstalled(program)}`);
  // }

}, false);
