const form = document.querySelector('#form');
const URL_API = 'http://127.0.0.1:8000/api/registroAspirantes';

form.addEventListener('submit', async (e) => {
    e.preventDefault();


    const formData = new FormData(e.currentTarget);
    const datos = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
            },

            body: JSON.stringify(datos),
        })

        // 
        if (!response.ok) {

            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        console.log('Datos enviados y recibidos con éxito:', data);
        
        alert(`Usuario creado con éxito!`);
        form.reset();
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        alert('Hubo un error al registrar el usuario, por favor intentelo nuevamente');
    }

});