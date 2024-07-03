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
      const login = document.getElementById('login').value;
      const password = document.getElementById('password').value;
      window.electronAPI.submitLogin(login, password);
    });

    window.electronAPI.onLoginResponse((event, response) => {
      alert(response.message);
    });
