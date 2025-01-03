// url de los endpoins
const url_obtenerSorteo = "/api/v1/sorteo/obtenerSorteo"; // para obtener los sorteos

// Función para consultar sorteos desde la API
async function consultarSorteos() {
    try {
      const token = localStorage.getItem("token");

      if(token==null) {
        window.location.href= 'index.html';
      }
      
      // Si el token está presente, agregarlo en los encabezados
      const headers = {
        "Content-Type": "application/json",
      };
  
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
  
      // Realizar la solicitud con los encabezados adecuados
      const response = await fetch(hostUrl + url_obtenerSorteo, {
        method: "GET",
        headers: headers,
      });
  
      if (response.ok) {
        const sorteos = await response.json();
  
        // Validación y generación de tarjetas para cada sorteo
        if (Array.isArray(sorteos)) {
            
          sorteos.forEach((sorteo) => generarSorteosCart(sorteo));
        } else {
          console.error("La respuesta no es un arreglo.");
        }
      } else {
        console.error("Error en la respuesta de la API:", response.status);
      }
    } catch (error) {
      console.error("Hubo un error en la solicitud:", error);
    }
  }
  

// Función para generar una tarjeta con la información del sorteo
function generarSorteosCart(sorteo) {
  const contenedor = document.getElementById("contenedorSorteos");
  if (!contenedor) {
    console.error("Contenedor no encontrado.");
    return;
  }

  const descripcion = sorteo.descripcion || "Descripción no disponible";

  // Crear el HTML de la card como un elemento DOM
  const divCard = document.createElement("div");
  divCard.className = "cardSorteo";
  divCard.id = sorteo.id;

  divCard.innerHTML = `
    <img src="${hostUrl + "/" + sorteo.ulrImagenSorteo}" alt="Imagen representativa del sorteo">
    <h3>${sorteo.nombreSorteo}</h3>
    <p>Rango de números: ${sorteo.rangoNumeros}</p>
    <p>Fecha de inicio: ${new Date(sorteo.fechaInicioSorteo).toLocaleDateString()}</p>
    <p>Fecha final: ${new Date(sorteo.fechaFinSorteo).toLocaleDateString()}</p>
  `;

  // Agregar evento click
  divCard.addEventListener("click", () => {
    console.log(`Card de sorteo con ID ${sorteo.id} clickeada.`);
    // Lógica adicional al hacer clic
    generateNumbersContainer(sorteo);
  });

  // Añadir la card al contenedor
  contenedor.appendChild(divCard);
}




// Llamada inicial para cargar los sorteos
window.onload = consultarSorteos;
