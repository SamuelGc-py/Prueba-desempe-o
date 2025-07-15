import { registerUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        try {
            const user = await registerUser(username, password, 'visitor');
            registerMessage.textContent = `Usuario creado: ${user.username}`;
            registerMessage.style.color = 'green';
            registerForm.reset();
        } catch (error) {
            registerMessage.textContent = error.message;
            registerMessage.style.color = 'red';
        }
    });
});
