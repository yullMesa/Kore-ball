// Simplemente importas el archivo para que cargue su lógica
import './auth.js';

// Aquí sigue el resto de la lógica de kore.js (como las animaciones de las banderas o el canvas)
console.log("Kóre inicializado correctamente 🚀");

// 1. Lógica para cambiar entre Login y Sign up
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const extraFields = document.getElementById('extra-fields');
const submitBtnText = document.getElementById('submit-btn-text');

loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    extraFields.style.display = 'none'; // Oculta campo de usuario en login
    submitBtnText.textContent = "Entrar al Partido";
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    extraFields.style.display = 'block'; // Muestra campo de usuario en registro
    submitBtnText.textContent = "Registrarse y Jugar";
});

// 2. Lógica opcional: Rotar banderas cada 4 segundos para darle vida
const flags = ['co', 'br', 'ar', 'es', 'fr', 'de', 'jp', 'gb'];
const leftFlagImg = document.getElementById('left-flag');
const rightFlagImg = document.getElementById('right-flag');

function getRandomFlag() {
    const index = Math.floor(Math.random() * flags.length);
    return flags[index];
}

setInterval(() => {
    const randomLeft = getRandomFlag();
    const randomRight = getRandomFlag();
    leftFlagImg.src = `https://flagcdn.com/w160/${randomLeft}.png`;
    rightFlagImg.src = `https://flagcdn.com/w160/${randomRight}.png`;
}, 4000);