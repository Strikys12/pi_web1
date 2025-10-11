const form = document.querySelector('#form');
const URL_API = 'http://127.0.0.1:8000/api/request';

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
        
        alert(`Solicitud registrada con éxito! Estaremos en contacto contigo!`);
        form.reset();
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al registrar la solicitud, por favor vuelva a intentarlo');
    }

});