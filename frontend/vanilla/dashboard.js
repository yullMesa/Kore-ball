// 1. Cargar el nombre del usuario desde localStorage usando la clave correcta
const userDisplay = document.getElementById('user-display');
const username = localStorage.getItem('kore_username'); // <-- Debe ser idéntico

if (!username) {
    // Si no hay usuario logueado, redirige al login
    window.location.href = 'index.html';
} else {
    // Si sí existe, lo muestra en pantalla
    userDisplay.textContent = `👤 ${username}`;
}

// 2. Lógica para Cerrar Sesión
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear(); 
        window.location.href = 'index.html'; 
    });
}

// 3. Botón para entrar a la cancha
const enterGameBtn = document.getElementById('enter-game-btn');
if (enterGameBtn) {
    enterGameBtn.addEventListener('click', () => {
        alert("¡Próximamente inicializaremos el motor de física y el HTML Canvas aquí!");
    });
}