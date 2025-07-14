// Este archivo manejará la lógica de registro de usuarios.

// Importa funciones de autenticación si las tienes en './auth.js'.
// Por ejemplo, una función para registrar un nuevo usuario.
// import { registerUser } from './auth.js'; // Descomenta y ajusta si tienes esta función

document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos referencias a los elementos del DOM
    const registerForm = document.getElementById('register-form');
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
    const registerMessage = document.getElementById('register-message');

    // Verificamos que el formulario de registro exista antes de añadir el event listener
    if (registerForm) {
        // Añadimos un 'listener' para el evento 'submit' del formulario
        registerForm.addEventListener('submit', async (event) => {
            // *** ESTA LÍNEA ES CRÍTICA: Evita que la página se recargue ***
            event.preventDefault();

            // Limpiamos el mensaje anterior y lo ocultamos
            registerMessage.textContent = '';
            registerMessage.style.display = 'none'; // Aseguramos que no sea visible al inicio

            // 1. Obtenemos los valores de los campos
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // 2. Realizamos una validación básica
            if (!username || !password) {
                registerMessage.textContent = 'Por favor, introduce un nombre de usuario y una contraseña.';
                registerMessage.style.color = 'orange';
                registerMessage.style.display = 'block'; // Hacemos visible el mensaje de advertencia
                return; // Detenemos la ejecución
            }

            if (password.length < 6) { // Ejemplo de validación de contraseña
                registerMessage.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                registerMessage.style.color = 'orange';
                registerMessage.style.display = 'block';
                return;
            }

            console.log('Intentando registrar usuario:', { username, password: '***' }); // No mostrar la contraseña real en consola

            try {
                // 3. Aquí es donde normalmente llamarías a tu función de registro de usuario.
                // Si estás usando Firebase Auth, sería algo como:
                // await registerUser(username, password);
                // O si tienes una API backend:
                /*
                const response = await fetch('/api/register', { // Ajusta la URL de tu API de registro
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error desconocido al registrar usuario.');
                }

                const result = await response.json();
                console.log('Registro exitoso:', result);
                */

                // SIMULACIÓN DE REGISTRO (si no tienes un backend aún):
                // Simula un retraso para que parezca que está procesando
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Simula un registro exitoso
                console.log('Usuario registrado simuladamente:', username);

                // 4. Si el registro es exitoso, mostramos el mensaje y redirigimos
                registerMessage.textContent = '¡Registro exitoso! Redirigiendo a la página de inicio de sesión...';
                registerMessage.style.color = 'green';
                registerMessage.style.display = 'block';

                // Opcional: Limpiar el formulario
                registerForm.reset();

                // Redirigir al usuario a la página de inicio de sesión después de un breve retraso
                setTimeout(() => {
                    window.location.href = './login.html'; // Asegúrate de que esta ruta sea correcta
                }, 2000); // Redirige después de 2 segundos

            } catch (error) {
                // 5. Si hay un error durante el registro
                console.error('Error durante el registro:', error);
                registerMessage.textContent = `Error al registrar: ${error.message || 'Por favor, inténtalo de nuevo.'}`;
                registerMessage.style.color = 'red';
                registerMessage.style.display = 'block'; // Hacemos visible el mensaje de error
            }
        });
    } else {
        console.error('ERROR: El formulario con ID "register-form" no fue encontrado en el DOM.');
    }
});
