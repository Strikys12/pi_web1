const form = document.querySelector('#form');

// 🛑 CLAVE CORREGIDA: Usando la URL absoluta de Spring Boot (localhost:8000)
// Esto asegura que el navegador envíe la petición POST directamente al backend,
// evitando problemas de enrutamiento o proxy si no se está usando uno.
const URL_API = 'http://localhost:8000/api/registroAspirantes'; 

// ----------------------------------------------------
// Elementos para Mensajes de Feedback (Reemplazo de alert())
// ----------------------------------------------------
const feedbackContainer = document.createElement('div');
feedbackContainer.id = 'feedback-message';
feedbackContainer.style.padding = '12px';
feedbackContainer.style.borderRadius = '8px';
feedbackContainer.style.marginTop = '20px';
feedbackContainer.style.textAlign = 'center';
feedbackContainer.style.fontWeight = '700';
feedbackContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
feedbackContainer.style.display = 'none'; // Oculto por defecto
// Insertar el contenedor justo después del formulario
form.parentNode.insertBefore(feedbackContainer, form.nextSibling);

/**
 * Muestra un mensaje de feedback (éxito, error, advertencia) en la interfaz.
 * @param {string} msg - El mensaje a mostrar.
 * @param {('success'|'error'|'warning')} type - El tipo de mensaje.
 */
function mostrarFeedback(msg, type) {
    feedbackContainer.textContent = msg;
    feedbackContainer.style.display = 'block';

    if (type === 'success') {
        feedbackContainer.style.backgroundColor = '#d4edda'; // Verde claro
        feedbackContainer.style.color = '#155724';           // Verde oscuro
    } else if (type === 'error') {
        feedbackContainer.style.backgroundColor = '#f8d7da'; // Rojo claro
        feedbackContainer.style.color = '#721c24';           // Rojo oscuro
    } else if (type === 'warning') {
        feedbackContainer.style.backgroundColor = '#fff3cd'; // Amarillo claro
        feedbackContainer.style.color = '#856404';           // Amarillo oscuro
    }
    
    // Ocultar automáticamente después de 7 segundos
    setTimeout(() => {
        feedbackContainer.style.display = 'none';
    }, 7000);
}


/**
 * Valida que todos los campos requeridos estén llenos y que las contraseñas coincidan.
 * @param {Object} datos - Objeto con los datos del formulario.
 * @returns {boolean} True si la validación es exitosa, False en caso contrario.
 */
function validarFormulario(datos) {
    let isValid = true;
    
    // 1. Validar campos obligatorios
    for (const key in datos) {
        // Convierte el valor a String() antes de usar .trim()
        const valorCampo = String(datos[key]);

        if (valorCampo.trim() === "") {
            mostrarFeedback(`Error: El campo es obligatorio. Por favor, llene todos los campos.`, 'warning');
            isValid = false;
            break; // Detenemos la iteración al encontrar el primer error
        }
    }

    if (!isValid) return false;

    // 2. Validar confirmación de contraseña
    const contrasena = datos.contrasena;
    const confirmarContrasena = datos.confirmarContrasena;

    // Asumimos que los inputs tienen 'name="contrasena"' y 'name="confirmarContrasena"'
    if (contrasena !== confirmarContrasena) {
        mostrarFeedback("Error: La contraseña y la confirmación de contraseña no coinciden.", 'error');
        return false;
    }

    return true;
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedbackContainer.style.display = 'none'; // Limpiar mensajes anteriores

    const formData = new FormData(e.currentTarget);
    const datos = Object.fromEntries(formData.entries());

    // 🛑 Paso 1: Ejecutar validación de frontend
    if (!validarFormulario(datos)) {
        return; // Detiene el envío si la validación falla
    }
    
    // El campo confirmarContrasena NO debe ir al backend.
    delete datos.confirmarContrasena;

    mostrarFeedback('Enviando solicitud de registro...', 'warning');
    
    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });

        // 🛑 Manejo de la respuesta no exitosa (incluyendo 409 Conflict)
        if (!response.ok) {
            // Intentamos leer el cuerpo del error
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                errorBody = { message: response.statusText };
            }
            
            let errorMessage = `Error en el registro:`;

            if (response.status === 409) {
                // El 409 (Conflicto) en este contexto significa email duplicado.
                errorMessage = "Este correo electrónico ya se encuentra registrado. Por favor, inicie sesión o use otro correo.";
            } else if (errorBody.message) {
                errorMessage = errorBody.message;
            } else {
                errorMessage = `Ocurrió un error desconocido. Código: ${response.status}`;
            }

            throw new Error(errorMessage);
        }
        
        const data = await response.json();

        console.log('Usuario registrado con éxito:', data);
        
        mostrarFeedback(`¡Usuario creado con éxito! Ahora puedes iniciar sesión.`, 'success');
        form.reset();
        
        // 🚀 Redirección al Login (Retraso de 2 segundos para que el usuario vea el mensaje de éxito)
        setTimeout(() => {
            window.location.href = '/public/Login.html'; 
        }, 2000);
        
    } catch (error) {
        // Muestra el mensaje de error capturado (incluyendo el de email duplicado)
        console.error('Error al registrar el usuario:', error.message);
        mostrarFeedback(`Hubo un error al registrar el usuario: ${error.message}`, 'error');
    }
});
