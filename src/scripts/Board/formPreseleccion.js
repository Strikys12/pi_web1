const $form = document.querySelector('#form');
const URL_API = 'http://127.0.0.1:4000/formularioadmision'; 

$form.addEventListener('submit', (e) => {
    e.preventDefault();
    
   
    const formData = new FormData(e.currentTarget);
    const datos = Object.fromEntries(formData.entries());

  
    fetch(URL_API, {
        method: 'POST',
        headers: {
          
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(datos),
    })
    .then(response => {
        // 
        if (!response.ok) {
           
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        return response.json();     
    })
    .then(data => {
        console.log('Datos enviados y recibidos con éxito:', data);
        alert(`Solicitud registrada con éxito. ID: ${data.idSolicitud}`);
        $form.reset(); // Limpia el formulario
    })
    .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al registrar la solicitud.');
    });
});