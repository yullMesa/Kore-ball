const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Obtenemos los valores de los inputs comunes
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Verificamos si estamos en la pestaña de Sign up o Login
    const isSignup = document.getElementById('signup-tab').classList.contains('active');
    
    if (isSignup) {
        // --- PETICIÓN DE REGISTRO (SIGN UP) ---
        const username = document.getElementById('username').value;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                document.getElementById('login-tab').click(); // Cambiar a login
            } else {
                alert("Error: " + (data.detail || "No se pudo registrar"));
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor.");
        }

    } else {
        // --- PETICIÓN DE INICIO DE SESIÓN (LOGIN) ---
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. Guardamos obligatoriamente en el almacenamiento local primero
                localStorage.setItem('kore_username', data.username);
                localStorage.setItem('kore_email', data.email);

                // 2. Pequeña validación opcional para asegurarnos de que se escribió
                console.log("Usuario guardado:", localStorage.getItem('kore_username'));

                alert(`¡Bienvenido de nuevo, ${data.username}!`);
                
                // 3. Ahora sí redirigimos
                window.location.href = '/frontend/dashboard.html';          
            } else {
                alert("Error: " + (data.detail || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor.");
        }
    }
});