const dropArea = document.getElementById('file-upload-form');
const fileInput = document.getElementById('file');
const imagePreview = document.getElementById('image-preview');
const imageContainer = document.getElementById('image-container');
const uploadButton = document.getElementById('upload-button');

const nombre = document.getElementById('nombre_sorteo');
const rango_sorteo = document.getElementById('rango_sorteo');
const fecha_inicio = document.getElementById('fecha_inicio');
const fecha_fin = document.getElementById('fecha_fin');

// Prevenir el comportamiento predeterminado al arrastrar y soltar
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Resaltar el área de soltar al arrastrar sobre ella
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

// Manejar la soltura de la imagen
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            imagePreview.src = event.target.result;
            imageContainer.style.display = 'flex';
        };
        
        reader.readAsDataURL(file);
        fileInput.files = files;
    }
}

// Manejar el evento de cambio de archivo de entrada
fileInput.addEventListener('change', handleFileInputChange);

function handleFileInputChange() {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            imagePreview.src = event.target.result;
            imageContainer.style.display = 'flex';
        };

        reader.readAsDataURL(file);
    }
}

// Validar los campos
function checkFields() {
    if (!nombre.value || !rango_sorteo.value || !fecha_inicio.value || !fecha_fin.value) {
        alert("Todos los campos deben ser completados antes de cargar el archivo.");
        return false;
    }
    return true;
}

// Manejar el clic en el botón de carga
uploadButton.addEventListener('click', uploadFile);

async function uploadFile() {
    if (!checkFields()) return;

    const file = fileInput.files[0];
    if (!file) {
        alert("Selecciona un archivo antes de subir.");
        return;
    }

    const formData = new FormData();
    formData.append('nombreSorteo', nombre.value);
    formData.append('rangoNumeros', rango_sorteo.value);
    formData.append('fechaInicioSorteo', fecha_inicio.value);
    formData.append('fechaFinSorteo', fecha_fin.value);
    formData.append('imagenSorteo', file);
    
    

    try {
        const response = await fetch('http://localhost:3000/api/v1/sorteo/Crearsorteo', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            alert("Archivo y datos del sorteo subidos exitosamente.");
        } else {
            console.error("Error en la respuesta del servidor");
            alert("Hubo un problema al subir los datos.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error al intentar subir el archivo y los datos.");
    }
}


