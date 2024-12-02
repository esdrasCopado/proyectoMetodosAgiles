
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
document.addEventListener('DOMContentLoaded', () => {
    const usuarioButton = document.getElementById('usuarioButton');
    const dropdown = usuarioButton.parentElement;

    // Mostrar/Ocultar menú desplegable al hacer clic en "Usuario"
    usuarioButton.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar el comportamiento por defecto del enlace
        dropdown.classList.toggle('show'); // Agregar/quitar la clase "show"
    });

    // Cerrar el menú desplegable si se hace clic fuera
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
});
