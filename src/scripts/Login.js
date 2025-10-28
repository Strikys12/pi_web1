// 🛑 CORRECCIÓN CLAVE: Usamos la URL completa del backend de Spring Boot (Puerto 8000).
// ESTO ES NECESARIO si el Frontend (5501) y el Backend (8000) corren en puertos diferentes.
const IP_DEL_SERVIDOR = 'http://localhost:8000';

// 🛑 RUTAS CORREGIDAS: Ahora son solo la parte del path que se añade a la IP.
const URL_API_ESTUDIANTE = '/api/loginEstudiantes/login';
const URL_API_ADMIN = '/api/loginAdministrativo/login';

// ----------------------------------------------------
// Elementos del DOM
// ----------------------------------------------------
const form = document.querySelector('#form');
const btnEstudiante = document.querySelector('#btn-estudiante');
const btnAdmin = document.querySelector('#btn-admin');
const btnCrearCuenta = document.querySelector('#btnCrearCuenta');
const mensajeError = document.createElement('div'); // Nuevo elemento para mostrar mensajes
mensajeError.style.color = 'red';
mensajeError.style.marginTop = '10px';
form.parentNode.insertBefore(mensajeError, form.nextSibling); // Lo insertamos después del formulario


// ----------------------------------------------------
// Estado Global
// ----------------------------------------------------
let tipoUsuario = 'estudiante';
let currentApiPath = URL_API_ESTUDIANTE; // Cambiamos el nombre de la variable para ser más claros

/**
 * Muestra un mensaje de error en la interfaz.
 * @param {string} msg - El mensaje de error.
 */
function mostrarMensaje(msg, tipo = 'error') {
    mensajeError.textContent = msg;
    mensajeError.style.color = tipo === 'exito' ? 'green' : 'red';
}

/**
 * Cambia la apariencia de los botones, establece la URL de la API
 * y maneja la visibilidad del botón 'Crear Cuenta'.
 * @param {string} modo - 'estudiante' o 'admin'
 */
function cambiarModo(modo) {
    // Si el modo no ha cambiado, salimos
    if (modo === tipoUsuario) return;

    tipoUsuario = modo;
    mostrarMensaje(''); // Limpiamos mensajes

    if (modo === 'estudiante') {
        btnEstudiante.classList.add('activo');
        btnAdmin.classList.remove('activo');
        currentApiPath = URL_API_ESTUDIANTE;
        btnCrearCuenta.style.display = 'block';
        console.log("Modo: Estudiante. API:", IP_DEL_SERVIDOR + currentApiPath);

    } else if (modo === 'admin') {
        btnAdmin.classList.add('activo');
        btnEstudiante.classList.remove('activo');
        currentApiPath = URL_API_ADMIN;
        btnCrearCuenta.style.display = 'none'; // Los administradores no se registran aquí
        console.log("Modo: Administrativo. API:", IP_DEL_SERVIDOR + currentApiPath);
    }
}

// ----------------------------------------------------
// 1. Manejo de la Interacción de Botones
// ----------------------------------------------------

btnEstudiante.addEventListener('click', () => cambiarModo('estudiante'));
btnAdmin.addEventListener('click', () => cambiarModo('admin'));

// ----------------------------------------------------
// 2. Manejo de la Redirección a Crear Cuenta
// ----------------------------------------------------

btnCrearCuenta.addEventListener('click', () => {
    // Redirige al formulario de registro de aspirantes
    window.location.href = '/public/Board/formulariocuenta.html';
});


// ----------------------------------------------------
// 3. Manejo del Envío del Formulario (Login)
// ----------------------------------------------------

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mostrarMensaje('Iniciando sesión...', 'info'); // Indicador de carga

    const formData = new FormData(e.currentTarget);
    const datos = Object.fromEntries(formData.entries());

    // 🛑 USO DE LA URL COMPLETA
    const fullUrl = IP_DEL_SERVIDOR + currentApiPath;

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })

        if (!response.ok) {
            // Manejamos códigos de error como 401 Unauthorized y 403 Forbidden
            let errorText = `Error ${response.status}: `;

            try {
                // Si el error es JSON, lo usamos (ej: Credenciales inválidas)
                const errorBody = await response.json();
                errorText = errorBody.message || response.statusText;
            } catch (e) {
                // Si no es JSON (como un 403 o 404 simple), usamos el statusText
                errorText = response.statusText;
            }

            // Mensaje específico para credenciales
            if (response.status === 401) {
                errorText = "Credenciales inválidas. Verifica tu email y contraseña.";
            } else if (response.status === 403) {
                // Spring Security bloqueando.
                errorText = "Acceso denegado. Spring Security está bloqueando la solicitud (Error 403).";
            }

            throw new Error(errorText);
        }

        // El servidor respondió 200 OK o 201 Created
        const data = await response.json();

        console.log('Login Exitoso:', data);
        mostrarMensaje(`Bienvenido, ${datos.email}!`, 'exito');

        // 🚀 LOGIN EXITOSO: Redirigir según el tipo de usuario
        const destino = tipoUsuario === 'estudiante' ?
            // Estudiante a la preselección
            '/public/Board/preseleccion.html' :
            // Admin al dashboard
            '/public/Board/Personal Administrativo.html';

        // Usamos setTimeout para que el usuario vea el mensaje de éxito antes de redirigir
        setTimeout(() => {
            window.location.href = destino;
        }, 1000); // 1 segundo de espera

    } catch (error) {
        console.error('Error de Login:', error.message);
        mostrarMensaje(`Error al iniciar sesión: ${error.message}`);
    }
});

// Inicializar el modo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cambiarModo('estudiante');
});