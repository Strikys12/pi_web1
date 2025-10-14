const URL_API_ESTUDIANTE = 'http://127.0.0.1:8000/api/loginEstudiantes';
const URL_API_ADMIN = 'http://127.0.0.1:8000/api/loginAdministrativo/login'

// ----------------------------------------------------
// Elementos del DOM
// ----------------------------------------------------
const form = document.querySelector('#form');
const btnEstudiante = document.querySelector('#btn-estudiante');
const btnAdmin = document.querySelector('#btn-admin');
const btnCrearCuenta = document.querySelector('#btnCrearCuenta');

// ----------------------------------------------------
// Estado Global
// ----------------------------------------------------
let tipoUsuario = 'estudiante'; 
let currentApiUrl = URL_API_ESTUDIANTE;

/**
 * Cambia la apariencia de los botones, establece la URL de la API
 * y maneja la visibilidad del botón 'Crear Cuenta'.
 * @param {string} modo - 'estudiante' o 'admin'
 */
function cambiarModo(modo) {
    tipoUsuario = modo;

    if (modo === 'estudiante') {
        btnEstudiante.classList.add('activo');
        btnAdmin.classList.remove('activo');
        currentApiUrl = URL_API_ESTUDIANTE;
        btnCrearCuenta.style.display = 'block'; 
        console.log("Modo: Estudiante. API:", currentApiUrl);

    } else if (modo === 'admin') {
        btnAdmin.classList.add('activo');
        btnEstudiante.classList.remove('activo');
        currentApiUrl = URL_API_ADMIN;
        btnCrearCuenta.style.display = 'none'; // Los administradores no se registran aquí
        console.log("Modo: Administrativo. API:", currentApiUrl);
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

    const formData = new FormData(e.currentTarget);
    const datos = Object.fromEntries(formData.entries());

    try {
        // Ejecuta el fetch usando la URL de la API actualmente seleccionada
        const response = await fetch(currentApiUrl, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })

        if (!response.ok) {
            // Si el servidor devuelve 4xx o 5xx, intentamos leer el mensaje de error
            const errorBody = await response.text();
            
            // Lanza el error capturado (incluyendo 401 Unauthorized)
            throw new Error(`Fallo de Autenticación: Credenciales inválidas o ${errorBody}`);
        }
        
        const data = await response.json();

        console.log('Login Exitoso:', data);
        
        // 🚀 LOGIN EXITOSO: Redirigir según el tipo de usuario
        const destino = tipoUsuario === 'estudiante' ? '/public/Board/preseleccion.html' : '/public/Board/Personal Administrativo.html';
        alert(`Bienvenido, ${datos.email}! Redirigiendo a su portal.`);
        window.location.href = destino; 
        
    } catch (error) {
        console.error('Error de Login:', error.message);
        // Muestra el mensaje de error detallado al usuario
        alert(`Error al iniciar sesión: ${error.message}`);
    }
});

// Inicializar el modo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cambiarModo('estudiante');
});
