const url_consultarIDUser = "/api/v1/users/verificarUsuario";
const url_obtenerDetallesSorteoApartado =
  "/api/v1/numeroRifa/sorteosPagadosPorElUsuario";

// Consultar sorteos pagados por el usuario
async function consultarSorteosPagados() {
    try {
      const usuario = await idUser(); // Obtener el usuario ID
  
      const response = await fetch(`${hostUrl}${url_obtenerDetallesSorteoApartado}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId: usuario }), // Enviar el usuario ID
      });
  
      if (!response.ok) {
        throw new Error(`Error al obtener detalles: ${response.statusText}`);
      }
  
      let datos = await response.json(); // Parsear respuesta a JSON
  
      // Si los datos no son un array, los convierte en uno
      if (!Array.isArray(datos)) {
        datos = [datos];
      }
  
      if (datos.length === 0) {
        mostrarMensaje("No hay sorteos para mostrar."); // Mostrar mensaje amigable
        return;
      }
  
      datos.forEach((detalleSorteo) => generarSorteoPago(detalleSorteo)); // Generar tarjetas dinámicamente
    } catch (error) {
      console.error("Error al consultar sorteos pagados:", error);
      mostrarMensaje("Ocurrió un error al obtener los datos.");
    } finally {
      ocultarCargando(); // Oculta el spinner de carga
    }
  }
  

// Generar tarjeta de cada sorteo
function generarSorteoPago(detalleSorteo) {
  const contenedor = document.getElementById("contenedorNumeros");

  if (!contenedor) {
    console.error("Contenedor no encontrado.");
    return;
  }

  // Convertir la ruta relativa de la imagen a una URL absoluta
  const imagenUrl = `${hostUrl}/${detalleSorteo.urlComprobante.replace(
    /\\/g,
    "/"
  )}`;

  const divCard = document.createElement("div");
  divCard.className = "cardSorteo";
  divCard.innerHTML = `
      
          <img src="${imagenUrl}" alt="Imagen del sorteo">
          <h4>${detalleSorteo.nombreSorteo}</h4>
          <h5>Números: ${detalleSorteo.numerosPagados.join(", ")}</h5>
      
  `;

  contenedor.appendChild(divCard); // Agregar tarjeta al contenedor
}






// Obtener el usuario ID
const idUser = async () => {
  const token = localStorage.getItem("token"); // O sessionStorage
  try {
    const response = await fetch(hostUrl + url_consultarIDUser, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Incluye el token JWT en el encabezado
      },
      body: JSON.stringify({ datos: "ejemplo" }),
    });

    if (!response.ok) {
      throw new Error(`Error al verificar usuario: ${response.statusText}`);
    }

    const data = await response.json();
    return data.usuarioId; // Devuelve el id del usuario
  } catch (error) {
    console.error("Error al obtener ID de usuario:", error);
  }
};

// Ejecutar la consulta al cargar la página
window.onload = () => consultarSorteosPagados();
