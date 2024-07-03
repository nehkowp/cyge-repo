const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

const loginForm = document.getElementById('signInForm');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const login = document.getElementById('login_si').value;
      const password = document.getElementById('password_si').value;
      window.electronAPI.submitSignIn(login, password);
      
      let win = window.getFocusedWindow();
      win.loadURL(`file://${__dirname}/src/screens/home.html`);

    });

    window.electronAPI.onLoginResponse((event, response) => {
      alert(response.message);
    });

    const signUpForm = document.getElementById('signUpForm');
    signUpForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nom = document.getElementById('nom').value;
      const prenom = document.getElementById('prenom').value;
      const login = document.getElementById('login_su').value;
      const password = document.getElementById('password_su').value;
      const lang = document.getElementById('lang').value;
      window.electronAPI.submitSignUp(nom, prenom, login, password, lang);
      
      let win = window.getFocusedWindow();
      win.loadURL(`file://${__dirname}/src/screens/home.html`);

    });

    window.electronAPI.onSignUpResponse((event, response) => {
      alert(response.message);
    });
    