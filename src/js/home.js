
const programs = ["mysql", "python", "code", "npm", "node"];
const programNames = ["MySQL", "Python", "VSCode", "NPM", "Node"];

function isProgramInstalled(program) {
	return new Promise((resolve, _) => {
    window.electronAPI.childProcessExec(`${program} --version`, (err, stdout, stderr) => {
      resolve({installed: err == null, version: stdout.match(/\d+\.\d+\.\d+/g)});
    });
  });
}

function updateUser(user) {
  const profileDiv = document.getElementById('user-info-box');
  profileDiv.innerHTML = `
    <div class="info" data-group="nom">
      <p><strong>Nom:</strong> ${user.nom}</p>
      <input type="text" value="${user.nom}" hidden>
      <img class="icon" data-group="nom" src="../assets/pencil-solid.svg"/>
    </div> 
    <div class="info" data-group="prenom">
      <p><strong>Prénom:</strong> ${user.prenom}</p>
      <input type="text" value="${user.prenom}" hidden>
      <img class="icon" data-group="prenom" src="../assets/pencil-solid.svg"/>
    </div>
    <div class="info" data-group="login">
      <p><strong>Identifiant:</strong> ${user.login}</p>
      <input type="text" value="${user.login}" hidden>
      <img class="icon" data-group="login" src="../assets/pencil-solid.svg"/>
    </div> 
    <div class="info" data-group="password">
      <p><strong>Mot de passe:</strong> •••••••••••</p>
      <input type="text" hidden>
      <img class="icon" data-group="password" src="../assets/pencil-solid.svg"/>
    </div>
    <div class="info" data-group="lang">
      <p><strong>Langage Préféré:</strong> ${user.lang}</p>
      <input type="text" value="${user.lang}" hidden>
      <img class="icon" data-group="lang" src="../assets/pencil-solid.svg"/>
    </div>
  `;
  document.title = `Accueil | ${user.login}`;
  const overlayPanel = document.querySelector('.overlay-panel.overlay-right h1');
  overlayPanel.textContent = `Bienvenue ${user.login} !`;
  console.log(user);
  
  document.querySelectorAll(".info img[data-group]").forEach(button => {
    button.addEventListener("click", async () => {
      const group = button.getAttribute("data-group");
      const groupText = document.querySelector(`div.info[data-group="${group}"] p`);
      const groupInput = document.querySelector(`div.info[data-group="${group}"] input`);
      groupText.toggleAttribute("hidden");
      groupInput.toggleAttribute("hidden");
      switch (button.getAttribute("src")) {
        case "../assets/pencil-solid.svg":
            button.setAttribute("src", "../assets/check-solid.svg");
            break;
        case "../assets/check-solid.svg":
            button.setAttribute("src", "../assets/pencil-solid.svg");
            const data = group === "password" ? await window.electronAPI.hashPassword(groupInput.value) : groupInput.value;
            window.electronAPI.submitEdit(group, data, user.id);
            window.electronAPI.onEditResponse((event, response) => {
              if (!response.success) {
                alert(response.message);
              }else if (group !== "password") {
                user[group] = data;
                updateUser(user);
              }
            });
            break;
      }
    })
  });
}

window.electronAPI.onUserProfile((event, user) => updateUser(user));

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
