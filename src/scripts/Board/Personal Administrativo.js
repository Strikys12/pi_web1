const aspirantes = [
  {
    nombre: "Ana Martínez",
    cedula: "1020345678",
    programa: "Desarrollo de Software",
    estado: "en-proceso",
  },
  {
    nombre: "Luis Pérez",
    cedula: "1098765432",
    programa: "Arte Culinario",
    estado: "aprobado",
  },
  {
    nombre: "Claudia Gómez",
    cedula: "1122334455",
    programa: "Marketing Digital",
    estado: "rechazado",
  },
];

const lista = document.getElementById("aspiranteList");
const searchInput = document.getElementById("searchInput");
const filterEstado = document.getElementById("filterEstado");

// Agregamos la referencia al botón de cerrar sesión (ajusta el ID si es necesario)
const btnLogout = document.getElementById("btnLogout"); 
// 💡 NOTA: Asumimos que la página inicial de login está en '../index.html'
const LOGIN_PAGE_URL = '../index.html'; 

/**
 * Renderiza la lista de aspirantes aplicando filtros de texto y estado.
 * @param {string} filtroTexto - Texto para filtrar por nombre, cédula o programa.
 * @param {string} filtroEstado - Estado ('en-proceso', 'aprobado', 'rechazado') para filtrar.
 */
function renderAspirantes(filtroTexto = "", filtroEstado = "") {
  lista.innerHTML = "";

  const filtrados = aspirantes.filter((a) => {
    const coincideTexto =
      a.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      a.cedula.includes(filtroTexto) ||
      a.programa.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideEstado = filtroEstado ? a.estado === filtroEstado : true;
    return coincideTexto && coincideEstado;
  });

  filtrados.forEach((a) => {
    const card = document.createElement("div");
    card.className = "aspirante-card";

    card.innerHTML = `
      <div class="aspirante-info">
        <strong>${a.nombre}</strong>
        <span>Cédula: ${a.cedula}</span>
        <span>Programa: ${a.programa}</span>
      </div>
      <span class="estado ${a.estado}">${a.estado}</span>
    `;

    lista.appendChild(card);
  });
}

// Eventos de búsqueda y filtrado
searchInput.addEventListener("input", () => {
  renderAspirantes(searchInput.value, filterEstado.value);
});
filterEstado.addEventListener("change", () => {
  renderAspirantes(searchInput.value, filterEstado.value);
});

// ----------------------------------------------------
// LÓGICA DE CIERRE DE SESIÓN AGREGADA AQUÍ
// ----------------------------------------------------

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        // En una aplicación real, aquí se limpiaría el token o la sesión
        console.log("Sesión cerrada. Redirigiendo a la página de inicio.");
        
        // Redirige al inicio de la aplicación
        window.location.href = LOGIN_PAGE_URL;
    });
} else {
    console.error("Error: Botón de Cerrar Sesión (ID: btnLogout) no encontrado.");
}

// Inicializa la renderización al cargar la página
renderAspirantes();
