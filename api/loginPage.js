// api/loginPage.js

// Importa la función loginUser desde tu archivo auth.js
import { loginUser } from './auth.js'; // La ruta es relativa a api/
// Si usas initRouter para actualizar la navegación después del login, impórtalo
// import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const user = await loginUser(username, password);
                loginMessage.textContent = `¡Inicio de sesión exitoso! Bienvenido de nuevo, ${user.username}. Redirigiendo...`;
                loginMessage.style.color = 'green';
                loginForm.reset();
                // Opcional: Si tu router actualiza la UI de navegación (ej. mostrar Dashboard)
                // initRouter();
                // Redirige al dashboard
                setTimeout(() => {
                    window.location.href = './dashboard.html'; // Ruta relativa desde pages/
                }, 1500); // 1.5 segundos
            } catch (error) {
                loginMessage.textContent = `${error.message}`;
                loginMessage.style.color = 'red';
                console.error('Error de inicio de sesión:', error);
            }
        });
    }
});