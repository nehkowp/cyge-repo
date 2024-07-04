const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// Partie Connexion qui envoie un mot de passe non hashé et un login pour se connecter avec submitSignIn
const loginForm = document.getElementById('signInForm');
    loginForm.addEventListener('submit', async () => {
      event.preventDefault();
      const login = document.getElementById('login_si').value;
      const password = document.getElementById('password_si').value;

      window.electronAPI.submitSignIn(login, password);
    });

    //Renvoie sur l'accueil sinon message d'erreur
    window.electronAPI.onLoginResponse((event, response) => {
      if (!response.success) {
        alert(response.message);
      }else{
        let win = window.getFocusedWindow();
        win.loadURL(`file://${__dirname}/src/screens/home.html`);
      }
    });

//Partie Création de compte , qui hash le mot de passe et envoie les données sur la BDD puis envoie sur l'accueil
const signUpForm = document.getElementById('signUpForm');
    signUpForm.addEventListener('submit', async () => {
      event.preventDefault();
      const nom = document.getElementById('nom').value;
      const prenom = document.getElementById('prenom').value;
      const login = document.getElementById('login_su').value;
      const password = document.getElementById('password_su').value;
      const hashedPassword = await window.electronAPI.hashPassword(password);
      const lang = document.getElementById('lang').value;
      window.electronAPI.submitSignUp(nom, prenom, login, hashedPassword, lang);
      
      let win = window.getFocusedWindow();
      win.loadURL(`file://${__dirname}/src/screens/home.html`);

    });

    window.electronAPI.onSignUpResponse((event, response) => {
      if (!response.success) {
        alert(response.message);
      }
    });
    