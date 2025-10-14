const form = document.querySelector('#form');
const URL_API = 'http://127.0.0.1:8000/api/request';

/**
 * Valida que todos los campos del formulario estén llenos.
 * @param {Object} datos - Objeto con los datos del formulario.
 * @returns {boolean} True si todos los campos están completos, False si falta alguno.
 */
function validarFormulario(datos) {
    // Itera sobre todos los valores del objeto de datos
    for (const key in datos) {
        // CORRECCIÓN: Convierte el valor a String() antes de usar .trim() para evitar errores
        const valorCampo = String(datos[key]);

        // Verifica si el valor está vacío o solo contiene espacios
        if (valorCampo.trim() === "") {
            // Muestra una alerta y detiene la validación
            alert('Error: Debe llenar todos los campos del formulario para enviar la solicitud.');
            return false;
        }
    }
    return true;
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const datos = Object.fromEntries(formData.entries());

    // 🛑 Paso Clave: Ejecutar la validación antes de enviar
    if (!validarFormulario(datos)) {
        return; // Detiene el envío del formulario (el fetch)
    }

    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })

        // Manejo de respuesta del servidor
        if (!response.ok) {
            // Leemos el cuerpo del error como JSON para obtener el mensaje del backend
            const errorBody = await response.json(); 
            let errorMessage = `Error en la solicitud: ${response.status} ${response.statusText}`;

            // 🛑 LÓGICA CLAVE: Reemplazar el error 409 con el mensaje amigable
            if (response.status === 409 && errorBody.message) {
                // El backend envió un 409 (Conflicto de documento duplicado)
                errorMessage = "Al parecer ya realizaste una solicitud, por favor revisa tu correo para validar tu estado de admisión. En caso de que no lo encuentres, puedes comunicarte con la línea de atención al cliente.";
            } else if (errorBody.message) {
                 // Para otros errores que contengan mensaje en el cuerpo
                errorMessage = errorBody.message;
            } else {
                 // Fallback genérico
                errorMessage = `Ocurrió un error inesperado. Código: ${response.status}`;
            }

            throw new Error(errorMessage);
        }
        
        const data = await response.json();

        console.log('Datos enviados y recibidos con éxito:', data);
        
        alert(`Solicitud registrada con éxito! Estaremos en contacto contigo!`);
        form.reset(); // Limpia el formulario
        
    } catch (error) {
        console.error('Error al enviar el formulario:', error.message);
        // Muestra el mensaje personalizado o el error genérico
        alert(error.message);
    }
});