// api/api.js

const API_BASE_URL = 'http://localhost:3000'; // Asegúrate de que coincida con el puerto de tu json-server

/**
 
@param {string} endpoint 
 @param {string} method 
 @param {object} [data=null] 
 @returns {Promise<object>} 
 @throws {Error} 
 */
async function apiRequest(endpoint, method, data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            let errorData;
            try {
                // Intenta parsear el error del JSON si el servidor lo envía
                errorData = await response.json();
            } catch (e) {
                // Si no es JSON o hay error al parsear, usa un mensaje genérico
                errorData = { message: 'Error desconocido del servidor.' };
            }
            // Lanza un error con el mensaje del servidor o un mensaje HTTP genérico
            throw new Error(errorData.message || `Error HTTP: ${response.status} ${response.statusText}`);
        }

        // json-server para DELETE/PATCH/PUT a veces no devuelve JSON, solo un 200/204.
        // Verificamos si la respuesta es parseable como JSON para evitar errores.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return {}; // Retorna un objeto vacío si no hay JSON para parsear
        }
    } catch (error) {
        console.error(`Error en la solicitud ${method} a ${endpoint}:`, error);
        // Re-lanza el error para que sea manejado por la función que llama (auth.js o directamente la página)
        throw error;
    }
}

// --- Funciones específicas para Users ---
export const getUsers = () => apiRequest('/users', 'GET');
export const createUser = (user) => apiRequest('/users', 'POST', user);
export const getUserByUsername = async (username) => {
    // json-server devuelve un array para consultas GET con parámetros
    // Si no encuentra nada, el array estará vacío
    const users = await apiRequest(`/users?username=${username}`, 'GET');
    return users[0]; // Retorna el primer usuario encontrado o undefined
};

// --- Funciones específicas para Events ---
export const getEvents = () => apiRequest('/events', 'GET');
export const getEventById = (id) => apiRequest(`/events/${id}`, 'GET');
export const createEvent = (event) => apiRequest('/events', 'POST', event);
export const updateEvent = (id, event) => apiRequest(`/events/${id}`, 'PUT', event);
export const deleteEvent = (id) => apiRequest(`/events/${id}`, 'DELETE');

// --- Funciones específicas para Event Registrations ---
export const getEventRegistrations = () => apiRequest('/eventRegistrations', 'GET');
export const getRegistrationsByUserId = (userId) => apiRequest(`/eventRegistrations?userId=${userId}`, 'GET');
export const getRegistrationsByEventId = (eventId) => apiRequest