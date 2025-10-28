const btnLogout = document.getElementById("logout"); 

// La función que se ejecuta al hacer clic
function handleLogoutClick(event) {
    // Evita el comportamiento predeterminado del enlace (ej: si es un <a> con href="#")
    event.preventDefault(); 

    // Opcional: Aquí iría la lógica para cerrar realmente la sesión
    // (ej: limpiar un token o session storage si no se usa Firebase).
    console.log("Sesión cerrada lógicamente. Redirigiendo...");

    // 3. Redirigir al usuario a la página de login.
    // Usamos la ruta que has especificado:
    window.location.href = '/public/Login.html'; 
}


// 4. Agregar el escuchador de eventos al elemento.
if (btnLogout) {
    // 🛑 CORRECCIÓN: Usar la variable correcta (btnLogout)
    // y la función correcta (handleLogoutClick)
    btnLogout.addEventListener('click', handleLogoutClick);
} else {
    // 🛑 CORRECCIÓN: Usar la variable correcta (btnLogout) o loguear el ID
    console.error("El elemento con ID 'logout' no fue encontrado en el DOM. Cerrar sesión no funcionará.");
}






const form = document.querySelector('#form');
// ✅ RUTA CORREGIDA: Usando la ruta relativa. 
// Es la mejor práctica para asegurar que el fetch funcione correctamente en producción.
const URL_API = 'http://localhost:8000/api/request'; 

// ----------------------------------------------------
// Elementos para Mensajes de Feedback
// ----------------------------------------------------
// Asumimos que el div con id="feedback-message" existe en el HTML
const feedbackContainer = document.querySelector('#feedback-message');

/**
 * Muestra un mensaje de feedback (éxito, error, advertencia) en la interfaz.
 * Utiliza clases de Bootstrap (alert) para un estilo consistente.
 * @param {string} msg - El mensaje a mostrar.
 * @param {('success'|'error'|'warning')} type - El tipo de mensaje.
 */
function mostrarFeedback(msg, type) {
    // Si el contenedor no existe (o ya fue limpiado), detenemos la función
    if (!feedbackContainer) return;

    feedbackContainer.innerHTML = `<p class="m-0">${msg}</p>`;
    feedbackContainer.style.display = 'block';

    // Usando clases de Bootstrap para el estilo
    feedbackContainer.className = 'col-12 text-center my-3 alert'; 

    if (type === 'success') {
        feedbackContainer.classList.add('alert-success');
    } else if (type === 'error') {
        feedbackContainer.classList.add('alert-danger');
    } else if (type === 'warning') {
        feedbackContainer.classList.add('alert-warning');
    }
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        feedbackContainer.style.display = 'none';
    }, 5000);
}


/**
 * Valida que todos los campos del formulario estén llenos.
 * @param {Object} datos - Objeto con los datos del formulario.
 * @returns {boolean} True si todos los campos están completos, False si falta alguno.
 */
function validarFormulario(datos) {
    // Itera sobre todos los valores del objeto de datos
    for (const key in datos) {
        // Ignoramos la validación del campo 'archivo' ya que no es obligatorio
        if (key === 'archivo') continue;

        // Convierte el valor a String() antes de usar .trim()
        const valorCampo = String(datos[key]);

        // Verifica si el valor está vacío o solo contiene espacios
        if (valorCampo.trim() === "") {
            mostrarFeedback('Error: Debe llenar todos los campos obligatorios para enviar la solicitud.', 'warning');
            return false;
        }
    }
    return true;
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Recolección y saneamiento de datos
    const formData = new FormData(e.currentTarget);
    let datos = Object.fromEntries(formData.entries()); 

    // Eliminar el campo de archivo antes de serializar a JSON (el Fix del 400 Bad Request)
    delete datos.archivo;

    // 2. Ejecutar la validación
    if (!validarFormulario(datos)) {
        return; // Detiene el envío
    }

    mostrarFeedback('Enviando solicitud...', 'warning'); // Indicador de carga
    
    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos), 
        })

        // 3. Manejo de respuesta del servidor (HTTP status codes)
        if (!response.ok) {
            
            let errorBody;
            try {
                // Intenta leer el JSON si está disponible
                errorBody = await response.json();
            } catch (e) {
                // Si falla la lectura, solo usa el texto del estado
                errorBody = { message: response.statusText || 'Error de servidor sin respuesta JSON' };
            }
            
            let errorMessage = `Error en la solicitud: ${response.status} ${response.statusText}`;

            // Mensaje especial para el error de solicitud duplicada (409)
            if (response.status === 409) {
                errorMessage = "Al parecer ya realizaste una solicitud, por favor revisa tu correo para validar tu estado de admisión. En caso de que no lo encuentres, puedes comunicarte con la línea de atención al cliente.";
            } else if (errorBody.message) {
                errorMessage = errorBody.message;
            } else {
                errorMessage = `Ocurrió un error inesperado. Código: ${response.status}`;
            }

            throw new Error(errorMessage);
        }
        
        // 4. Manejo de respuesta exitosa (200, 201, etc.)
        
        // 👇 FIX DE ROBUSTEZ: Intenta parsear el JSON, si falla, asumimos éxito.
        try {
            const data = await response.json();
            console.log('Datos de respuesta del servidor:', data);
        } catch (e) {
            console.log('Respuesta exitosa, pero el servidor no devolvió JSON o devolvió un cuerpo vacío.',     e);
        }

        mostrarFeedback(`✅ Solicitud registrada con éxito! Estaremos en contacto contigo!`, 'success');
        form.reset(); // Limpia el formulario
        
    } catch (error) {
        console.error('Error al enviar el formulario:', error.message);
        mostrarFeedback(error.message, 'error');
    }
});
