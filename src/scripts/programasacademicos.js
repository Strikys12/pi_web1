const btnInscripcion = document.getElementById("btnInscripcion");

    btnInscripcion.addEventListener("click", function (event) {
      event.preventDefault(); // evita que vaya de inmediato
      const confirmacion = confirm("¿Deseas ir al formulario de inscripción?");
      if (confirmacion) {
        window.location.href = this.href; // redirige si acepta
      }
    });

// Regreso a la página de inicio al hacer clic en el logo
  const logo = document.getElementById("logoNexus");
  logo.addEventListener("click", function () {
    window.location.href = "/public/index.html"; 
  });