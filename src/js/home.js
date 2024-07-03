
const programs = ["mysql", "python", "code", "npm", "node"];

function isProgramInstalled(program) {
	return new Promise((resolve, _) => {
    let process = exec(`${program} --version`);
    process.on('error', () => resolve(false));
    process.on('close', () => resolve(true));
  });
}

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
    

  for (const program of programs) {
    console.log(`Checking ${program}`);
    console.log(`${program} installed: ${await isProgramInstalled(program)}`);
  }

}, false);
