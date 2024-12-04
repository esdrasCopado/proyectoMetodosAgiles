document.addEventListener("DOMContentLoaded", () => {
    // Obtener el ID del sorteo desde los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const sorteoId = urlParams.get("sorteoId");

    if (!sorteoId) {
        console.error("No se especificó un ID de sorteo.");
        return;
    }

    // Recuperar los detalles del sorteo desde sessionStorage
    const sorteo = sessionStorage.getItem(`sorteo-${sorteoId}`);
    if (!sorteo) {
        console.error("No se encontraron detalles del sorteo en sessionStorage.");
        return;
    }

    const sorteoDetalles = JSON.parse(sorteo);

    // Mostrar los detalles del sorteo en la página
    document.getElementById("sorteoDetalle").innerHTML = `
<div class="sorteo-detalle">
<h2>Pagar Sorteo</h2>
<div class="detalle-contenedor">
<h4>${sorteoDetalles.nombreSorteo}</h4>
<h5>Números: ${sorteoDetalles.numeros.join(", ")}</h5>
<p>Costo Total: <span>$${sorteoDetalles.costoTotal.toFixed(2)}</span></p>
</div>
</div>

`;
});