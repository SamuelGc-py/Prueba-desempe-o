const LOCAL_STORAGE_KEY = 'currentUser';
const BASE_URL = 'http://localhost:3000';

/* === Funciones auxiliares === */

export async function getUserByUsername(username) {
    const res = await fetch(`${BASE_URL}/users?username=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error('Error al buscar usuario');
    const users = await res.json();
    return users[0] || null;
}

export async function createUser(userData) {
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Error al crear usuario');
    return await res.json();
}

/* === Manejo de sesión === */

export function setAuthenticatedUser(user) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
}

export function getAuthenticatedUser() {
    const user = localStorage.getItem(LOCAL_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
}

export function clearAuthenticatedUser() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
}

/* === Registro de usuario === */
export async function registerUser(username, password, role = 'visitor') {
    if (!username || !password || !role) {
        throw new Error('Completa todos los campos.');
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        throw new Error('El nombre de usuario ya existe.');
    }

    const newUser = {
        id: crypto.randomUUID(),
        username,
        password,
        role
    };

    return await createUser(newUser);
}

/* === Login con actualización de lastLogin === */
export async function loginUser(username, password) {
    if (!username || !password) {
        throw new Error('Por favor, ingresa tu nombre de usuario y contraseña.');
    }

    let user = await getUserByUsername(username);
    if (!user || user.password !== password) {
        throw new Error('Usuario o contraseña incorrectos.');
    }

    const lastLogin = new Date().toISOString();

    try {
        const res = await fetch(`${BASE_URL}/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lastLogin })
        });

        if (!res.ok) throw new Error('No se pudo actualizar el último acceso.');
        user.lastLogin = lastLogin;
    } catch (error) {
        console.error('Error al actualizar lastLogin:', error.message);
    }

    const sessionUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin
    };

    setAuthenticatedUser(sessionUser);
    return sessionUser;
}

export function logoutUser() {
    clearAuthenticatedUser();
}
