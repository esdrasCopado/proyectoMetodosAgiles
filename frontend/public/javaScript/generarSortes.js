// url de los endpoins
const url_obtenerSorteo= '/api/v1/sorteo/obtenerSorteo' // para obtener los sorteos

// Función para consultar sorteos desde la API
async function consultarSorteos() {
    console.log(hostUrl+url_obtenerSorteo)
    try {
        const response = await fetch(hostUrl+url_obtenerSorteo);
        
        if (response.ok) {
            const sorteos = await response.json();
            
            // Validación y generación de tarjetas para cada sorteo
            if (Array.isArray(sorteos)) {
                sorteos.forEach(sorteo => generarSorteosCart(sorteo)); 
            } else {
                console.error("La respuesta no es un arreglo.");
            }
        } else {
            console.error('Error en la respuesta de la API:', response.status);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }
}

// Función para generar una tarjeta con la información del sorteo
function generarSorteosCart(sorteo) {
    const contenedor = document.getElementById("contenedorSorteos");
    console.log(sorteo)
    if (!contenedor) {
        console.error('Contenedor no encontrado.');
        return;
    }

    const descripcion = sorteo.descripcion || 'Descripción no disponible';

    const htmlSorteoCart = `
        <div class="cardSorteo">
            <img src="${hostUrl+"/"+sorteo.ulrImagenSorteo}" alt="Imagen representativa del sorteo">
            <h3>${sorteo.nombreSorteo}</h3>
            <p>Rango de numeros: ${sorteo.rangoNumeros}</p>
            <p>Fecha de inicio: ${new Date(sorteo.fechaInicioSorteo).toLocaleDateString()}</p>
            <p>Fecha final: ${new Date(sorteo.fechaFinSorteo).toLocaleDateString()}</p>
        </div>
    `;
    contenedor.innerHTML += htmlSorteoCart;
}

// Llamada inicial para cargar los sorteos
window.onload = consultarSorteos;