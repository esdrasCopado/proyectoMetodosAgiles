const url_consultarIDUser = "/api/v1/users/verificarUsuario";
const url_obtenerDetallesSorteoApartado =
  "/api/v1/numeroRifa/obtenerDetallesSorteosUsuario";

// Consultar números ocupados por el usuario
async function consultarNumerosOcupadosPorUsuario() {
  try {
    const usuario = await idUser(); // Obtener el usuario ID
    const response = await fetch(hostUrl + url_obtenerDetallesSorteoApartado, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuarioId: usuario }), // Cuerpo como JSON
    });

    if (!response.ok) {
      throw new Error(`Error al obtener detalles: ${response.statusText}`);
    }

    const datos = await response.json(); // Parsear respuesta a JSON

    if (!datos || datos.length === 0) {
      console.log("No hay sorteos para mostrar.");
      return;
    }

    datos.forEach((detalleSorteo) => generarSorteoPago(detalleSorteo)); // Generar tarjetas dinámicamente
  } catch (error) {
    console.error("Error al consultar números ocupados:", error);
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
    const imagenUrl = `${hostUrl}/${detalleSorteo.ulrImagenSorteo.replace(
      /\\/g,
      "/"
    )}`;
  
    // Guardar detalles del sorteo en sessionStorage con clave única
    sessionStorage.setItem(`sorteo-${detalleSorteo.id}`, JSON.stringify(detalleSorteo));
  
    const divCard = document.createElement("div");
    divCard.className = "cardSorteo";
    divCard.id = `sorteo-${detalleSorteo.id}`; // ID único basado en el ID del sorteo
    divCard.innerHTML = `
              <img src="${imagenUrl}" alt="Imagen del sorteo">
              <h4>${detalleSorteo.nombreSorteo}</h4>
              <h5>Números: ${detalleSorteo.numeros.join(", ")}</h5>
              <p>Costo Total: $${detalleSorteo.costoTotal.toFixed(2)}</p>
              <div class="boton-pagar">
                  <button class="btnPagar" onclick="irAPagar(${detalleSorteo.id})">
                      <span>Pagar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet-fill" viewBox="0 0 16 16">
                              <path d="M0 3a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2H0zm0 2h15a2 2 0 0 1-2 2v4a2 2 0 0 1-2 2H0V5z"/>
                          </svg>
                  </button>
          </div>
      `;
  
    contenedor.appendChild(divCard); // Agregar tarjeta al contenedor
  }
  

// Ir a la página de pago al presionar el botón "Pagar"
function irAPagar(sorteoId) {
    try {
      // Redirigir a la página de pago con el ID del sorteo en la URL
      window.location.href = `pagar-comprobante.html?sorteoId=${sorteoId}`;
    } catch (error) {
      console.error("Error al procesar los detalles del sorteo:", error);
    }
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
window.onload = () => consultarNumerosOcupadosPorUsuario();
