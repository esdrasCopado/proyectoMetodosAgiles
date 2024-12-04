const dropArea = document.getElementById('file-upload-form');
const fileInput = document.getElementById('file');
const imagePreview = document.getElementById('image-preview');
const imageContainer = document.getElementById('image-container');
const uploadButton = document.getElementById('upload-button');

// URLs para los endpoints del servicio API
const url_pagarSorteo = '/api/v1/numeroRifa/pagarNumeroSorteosUsuario';
const url_consultarIDUser = '/api/v1/users/verificarUsuario';


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

// Manejar el clic en el botón de carga
uploadButton.addEventListener('click', uploadFile);

// Obtener el usuario ID
const idUser = async () => {
    const token = localStorage.getItem("token"); // Obtener token
    try {
        const response = await fetch(hostUrl+url_consultarIDUser, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Incluir el token JWT
            },
            body: JSON.stringify({ datos: "ejemplo" }),
        });

        if (!response.ok) {
            throw new Error(`Error al verificar usuario: ${response.statusText}`);
        }

        const data = await response.json();
        return data.usuarioId; // Retornar el ID del usuario
    } catch (error) {
        console.error("Error al obtener ID de usuario:", error);
    }
};

async function uploadFile() {
    const file = fileInput.files[0];
    if (!file) {
        alert("Selecciona un archivo antes de subir.");
        return;
    }

    try {
        const usuarioId = await idUser();
        const numerosRifa = sorteoDetalles.numeros;

        console.log(numerosRifa)

        if (!usuarioId) {
            alert("Error al obtener el ID del usuario.");
            return;
        }

        const formData = new FormData();
        formData.append('usuarioId', usuarioId);
        formData.append('numeros', numerosRifa);
        formData.append('imagenComprobante', file);

        const token = localStorage.getItem("token");

        const headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(hostUrl+url_pagarSorteo, {
            method: 'POST',
            body: formData, // Usar FormData directamente
            headers: headers,
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.mensaje); // Mostrar mensaje de éxito
            window.location.href = 'home.html'; // Redirigir a la página principal
        } else {
            const errorResult = await response.json();
            console.error("Error en la respuesta del servidor:", errorResult);
            alert(errorResult.mensaje); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        alert("Error al intentar subir el archivo y los datos.");
    }
}



