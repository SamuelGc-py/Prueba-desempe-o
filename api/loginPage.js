import { loginUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    if (!loginForm || !loginMessage) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        try {
            const user = await loginUser(username, password);
            loginMessage.textContent = `✅ ¡Bienvenido, ${user.username}! Redirigiendo...`;
            loginMessage.style.color = 'green';

            setTimeout(() => {
                window.location.href = './index.html';
            }, 3000);
        } catch (error) {
            loginMessage.textContent = `❌ ${error.message}`;
            loginMessage.style.color = 'red';

            // Aumentar el tiempo de espera a 10000 milisegundos (10 segundos)
            setTimeout(() => {
                loginMessage.textContent = '';
            }, 10000);
        }
    });
});
