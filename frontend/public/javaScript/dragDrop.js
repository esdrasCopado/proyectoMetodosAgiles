const dropArea = document.getElementById('file-upload-form');
const fileInput = document.getElementById('file');
const imagePreview = document.getElementById('image-preview');
const imageContainer = document.getElementById('image-container');
const uploadButton = document.getElementById('upload-button');

const nombre = document.getElementById('nombre_sorteo');
const RangoNumeros = document.getElementById('RangoNumeros');
const fechaInicio = document.getElementById('fechaInicio');
const fechaFin = document.getElementById('fechaFin');

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
    if(!validateSorteoName(nombre) || !validarRangoNumeros(RangoNumeros)   || !validarFecha(fechaInicio) || !validarFecha(fechaFin)){
        return false;
    }
    if (!validarFechas(fechaInicio , fechaFin)) {
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
    formData.append('rangoNumeros', RangoNumeros.value);
    formData.append('fechaInicioSorteo', fechaInicio.value);
    formData.append('fechaFinSorteo', fechaFin.value);
    formData.append('imagenSorteo', file);
    
    

    try {
        const response = await fetch('http://localhost:3000/api/v1/sorteo/Crearsorteo', {
            method: 'POST',
            body: formData
        });
    
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            generateAlert(result.message);
        } else {
            const errorResult = await response.json(); // Extraer el mensaje de error de la respuesta
            console.error("Error en la respuesta del servidor");
            generateAlert(errorResult.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error al intentar subir el archivo y los datos.");
    }
    
}


