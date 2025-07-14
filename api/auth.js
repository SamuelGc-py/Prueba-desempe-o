// api/auth.js

import { createUser, getUserByUsername } from './api.js'; // Asegúrate que esta ruta sea correcta dentro de la carpeta 'api'

const LOCAL_STORAGE_KEY = 'currentUser';

/**
 * Obtiene el usuario autenticado desde Local Storage.
 * @returns {object|null} El objeto de usuario autenticado o null si no hay ninguno.
 */
export function getAuthenticatedUser() {
    try {
        const user = localStorage.getItem(LOCAL_STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Error al parsear el usuario de Local Storage:", e);
        return null;
    }
}

/**
 * Almacena la información del usuario autenticado en Local Storage.
 * @param {object} user - El objeto de usuario a almacenar.
 */
export function setAuthenticatedUser(user) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
}

/**
 * Elimina la información del usuario autenticado de Local Storage.
 */
export function clearAuthenticatedUser() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
}

/**
  Intenta registrar un nuevo usuario.
@param {string} username - Nombre de usuario para el registro.
@param {string} password - Contraseña para el registro.
@param {string} role - Rol del usuario ('admin' o 'visitor').
@returns {Promise<object>} El usuario creado exitosamente.
@throws {Error} Si faltan campos, el usuario ya existe o hay un error al crear.
 */
export async function registerUser(username, password, role) {
    // 1. Validación de campos vacíos
    if (!username || !password || !role) {
        throw new Error('Por favor, completa todos los campos requeridos (Usuario, Contraseña, Rol).');
    }

    // 2. Verificar si el usuario ya existe
    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            throw new Error('Este nombre de usuario ya está en uso. Por favor, elige otro.');
        }
    } catch (error) {
        // Si hay un error de red o de la API al verificar el usuario, relanzar
        if (error.message.includes('Error HTTP')) { // Ejemplo para errores de red/servidor
            throw new Error(`Error al verificar usuario existente: ${error.message}`);
        } else {
             // Si el error ya es del tipo "usuario existe", simplemente lo relanzamos
            throw error;
        }
    }


    // 3. Crear el nuevo usuario
    const newUser = {
        id: crypto.randomUUID(), // Genera un ID único para el usuario (para json-server)
        username,
        password, // IMPORTANTE: En una aplicación real, NUNCA almacenes contraseñas sin hashear.
        role
    };

    try {
        const createdUser = await createUser(newUser);
        return createdUser;
    } catch (error) {
        // Capturar errores de la función `createUser` (p.ej., problemas de conexión con json-server)
        throw new Error(`Error al crear el usuario: ${error.message}`);
    }
}

/**
 * Intenta iniciar sesión con las credenciales proporcionadas.
 * @param {string} username - Nombre de usuario para el inicio de sesión.
 * @param {string} password - Contraseña para el inicio de sesión.
 * @returns {Promise<object>} El usuario autenticado (sin la contraseña).
 * @throws {Error} Si faltan campos o las credenciales son inválidas.
 */
export async function loginUser(username, password) {
    // 1. Validación de campos vacíos
    if (!username || !password) {
        throw new Error('Por favor, ingresa tu nombre de usuario y contraseña.');
    }

    // 2. Buscar al usuario por nombre de usuario
    let user;
    try {
        user = await getUserByUsername(username);
    } catch (error) {
        // Si hay un error de red o de la API al buscar el usuario
        throw new Error(`Error al intentar conectar con el servidor: ${error.message}`);
    }

    // 3. Verificar credenciales
    // En una aplicación real, aquí compararías la contraseña hasheada
    if (!user || user.password !== password) {
        throw new Error('Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.');
    }

    // 4. Almacenar información de la sesión y retornar usuario
    const sessionUser = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    setAuthenticatedUser(sessionUser);
    return sessionUser;
}

/**
 * Cierra la sesión del usuario actual.
 */
export function logoutUser() {
    clearAuthenticatedUser();
}