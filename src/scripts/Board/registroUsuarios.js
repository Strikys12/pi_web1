const form = document.querySelector('#form');
// URL_API está apuntando al endpoint POST del RegistroAspirantesController
const URL_API = 'http://127.0.0.1:8000/api/registroAspirantes';

/**
 * Valida que todos los campos requeridos estén llenos y que las contraseñas coincidan.
 * @param {Object} datos - Objeto con los datos del formulario.
 * @returns {boolean} True si la validación es exitosa, False en caso contrario.
 */
function validarFormulario(datos) {
    // 1. Validar campos obligatorios
    for (const key in datos) {
        if (datos[key].trim() === "") {
            // Se excluye 'confirmarContrasena' de la alerta de 'campo obligatorio' 
            // si quieres un mensaje más específico, pero esta lógica es funcional
            alert(`Error: El campo es obligatorio. Por favor, llene todos los campos.`);
            return false;
        }
    }

    // 2. Validar confirmación de contraseña
    const contrasena = datos.contrasena;
    const confirmarContrasena = datos.confirmarContrasena;

    if (contrasena !== confirmarContrasena) {
        alert("Error: La contraseña y la confirmación de contraseña no coinciden.");
        return false;
    }

    return true;
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const datos = Object.fromEntries(formData.entries());

    // 🛑 Paso 1: Ejecutar validación de frontend
    if (!validarFormulario(datos)) {
        return; // Detiene el envío si la validación falla
    }
    
    // El campo confirmarContrasena NO va al backend.
    delete datos.confirmarContrasena;

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
            // Leemos el cuerpo del error como JSON, ya que el backend lo envía así
            const errorBody = await response.json(); 
            let errorMessage = `Error en el registro (${response.status} ${response.statusText}):`;

            if (response.status === 409 && errorBody.message) {
                // Si es 409 (Email Duplicado), usamos el mensaje específico del backend
                errorMessage = errorBody.message;
            } else if (errorBody.message) {
                // Para otros errores que tengan un mensaje en el cuerpo JSON
                errorMessage = errorBody.message;
            } else {
                 // Fallback para errores sin cuerpo JSON
                errorMessage = `Ocurrió un error desconocido. Código: ${response.status}`;
            }

            throw new Error(errorMessage);
        }
        
        const data = await response.json();

        console.log('Datos enviados y recibidos con éxito:', data);
        
        alert(`Usuario creado con éxito! Ahora puede iniciar sesión con ${data.email}.`);
        form.reset();
        
        // 🚀 Redirección al Login
        window.location.href = '/public/Login.html'; 
        
    } catch (error) {
        // Muestra el mensaje de error capturado (incluyendo el de email duplicado)
        console.error('Error al registrar el usuario:', error.message);
        alert(`Hubo un error al registrar el usuario: ${error.message}`);
    }
});