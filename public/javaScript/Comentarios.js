// Simulando publicaciones con comentarios (puedes reemplazar esto con datos reales)
const publicaciones = [
    {
        id: 1,
        titulo: 'La Importancia del Deporte en la Salud',
        contenido: 'El deporte juega un papel fundamental en la promoción de la salud física y mental.',
        comentarios: [
            { autor: 'Juan', contenido: 'Totalmente de acuerdo!' },
            { autor: 'Ana', contenido: 'Me ha ayudado mucho en mi vida.' }
        ]
    },
    {
        id: 2,
        titulo: 'La Leyenda de Stephen Curry en la NBA',
        contenido: 'Stephen Curry ha revolucionado el baloncesto moderno.',
        comentarios: [
            { autor: 'Carlos', contenido: 'Curry es un fenómeno!' }
        ]
    }
];

// Renderizar los comentarios de una publicación seleccionada
function renderizarPublicacion(idPublicacion) {
    const publicacion = publicaciones.find(p => p.id === idPublicacion);
    if (!publicacion) return;

    const publicacionDetalles = document.querySelector('.publicacion-detalles');
    const comentariosSection = document.querySelector('.comentarios');

    publicacionDetalles.innerHTML = `
        <h2>${publicacion.titulo}</h2>
        <p>${publicacion.contenido}</p>
    `;

    comentariosSection.innerHTML = '';
    publicacion.comentarios.forEach(comentario => {
        const comentarioElem = document.createElement('div');
        comentarioElem.classList.add('comentario');
        comentarioElem.innerHTML = `
            <p><strong>${comentario.autor}:</strong> ${comentario.contenido}</p>
        `;
        comentariosSection.appendChild(comentarioElem);
    });
}

// Manejar el clic en las publicaciones
document.querySelectorAll('.publicacion-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const idPublicacion = parseInt(this.dataset.id);
        renderizarPublicacion(idPublicacion);
        document.querySelector('.publicacion-detalles').scrollIntoView();
    });
});