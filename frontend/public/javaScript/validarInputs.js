function validateNoVoid(identificadorElement) {
    if (identificadorElement.value.trim() === "") {
        inputError(identificadorElement);
        mensajeError("Por favor, introduzca un valor para este campo.", "error-" + identificadorElement.id);
        return false;
    } else {
        limpiarErrores("error-" + identificadorElement.id); // Limpia el mensaje de error correspondiente
        return true;
    }
}
function validateName(nameInput) {
    var validNamePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/;
    
    if (!nameInput.value.trim()) {
        inputError(nameInput);
        mensajeError("Por favor, introduzca su nombre.", "error-name");
        return false;
    }
    
    if (validNamePattern.test(nameInput.value)) {
        limpiarErrores("errorNombre");
        return true;
    } else {
        inputError(nameInput);
        mensajeError("Nombre no válido. Solo se permiten letras y espacios.", "error-name");
        return false;
    }
}

function validateEmail(emailElement) {
    var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (validEmail.test(emailElement.value)) {
        limpiarErrores("errorEmail");
        return true;
    } else {
        inputError(emailElement);
        mensajeError("Correo electrónico no válido", "errorEmail");
        return false;
    }
}

function validatePassword(passwordElement, passwordElement2) {
    if (passwordElement.value !== passwordElement2.value) {
        inputError(passwordElement2);
        mensajeError("Las contraseñas no coinciden.", "errorContraseña2");
        return false;
    }
    var validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordElement.value === "") {
        inputError(passwordElement);
        mensajeError("Por favor, introduzca una contraseña.", "errorContraseña");
        return false;
    }
    if (validPassword.test(passwordElement.value)) {
        limpiarErrores("errorContraseña");
        return true;
    } else {
        inputError(passwordElement);
        mensajeError("Contraseña no válida. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.", "errorContraseña");
        return false;
    }
}

function validateSorteoName(nombreSorteoElement) {
    if (nombreSorteoElement.value.trim() === "") {
        inputError(nombreSorteoElement);
        mensajeError("Por favor, introduzca el nombre del sorteo.", "errorNombreSorteo");
        return false;
    } else {
        limpiarErrores("errorNombreSorteo");
        return true;
    }
}

function validarRangoNumeros(rangoNumerosElement) {
    if (rangoNumerosElement.value.trim() === "") {
        inputError(rangoNumerosElement);
        mensajeError("Por favor, introduzca el rango de números.", "error-RangoNumeros");
        return false;
    } else {
        limpiarErrores("error-RangoNumeros");
        return true;
    }
}

// Valida que la fecha de inicio no esté vacía y sea mayor que la fecha actual
function validarFecha(fechaElement) {
    if (fechaElement.value.trim() === "") {
        inputError(fechaElement);
        mensajeError("Por favor, introduzca la fecha de inicio del sorteo.", "error-" + fechaElement.id);
        return false;
    } else {
        const today = new Date();
        // Dividir la fecha en partes y crear una fecha local
        const [year, month, day] = fechaElement.value.split("-");
        const selectedDate = new Date(year, month - 1, day); // `month - 1` porque los meses son 0-indexados
        
        // Ajustar ambas fechas para ignorar la hora
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            inputError(fechaElement);
            mensajeError("La fecha debe ser la actual o una fecha posterior.", "error-" + fechaElement.id);
            return false;
        }
        
        limpiarErrores("error-" + fechaElement.id);
        return true;
    }
}




// Valida que la fecha de fin sea mayor que la fecha de inicio
function validarFechas(fechaInicioElement, fechaFinElement) {
    const fechaInicio = new Date(fechaInicioElement.value);
    const fechaFin = new Date(fechaFinElement.value);

    // Comprobar que la fecha de inicio es menor que la fecha de fin
    if (fechaInicio.getTime() > fechaFin.getTime()) {
        inputError(fechaInicioElement);
        inputError(fechaFinElement);
        mensajeError("La fecha de inicio del sorteo debe ser menor a la fecha de fin.", "error-fechaInicio");
        return false;
    }

    // Comprobar que las fechas no sean iguales
    if (!validarFechaNoIgual(fechaInicio, fechaFin, fechaFinElement)) {
        return false;
    }

    limpiarErrores("error-fechas");
    return true;
}

// Función para verificar que las fechas no sean iguales
function validarFechaNoIgual(fechaInicio, fechaFin, fechaFinElement) {
    // Comprobar que las fechas no son iguales
    if (fechaInicio.getTime() === fechaFin.getTime()) {
        inputError(fechaFinElement);
        mensajeError("La fecha de inicio y fin deben ser diferentes.", "error-fechaFin");
        return false;
    }
    return true;
}





function mensajeError(message, identificador) {
    const errorContainer = document.getElementById(identificador);
    if (errorContainer) {
        errorContainer.innerHTML = `
            <div class="error-container">
                <div class="icon-container">
                    <svg aria-hidden="true" class="warning-icon" fill="currentColor" focusable="false" width="16px" height="16px"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                    </svg>
                </div>
                <div class="mensaje-error">
                    <span>${message}</span>
                </div>
            </div>
        `;
    }
}

function inputError(element) {
    element.classList.add('input-error');
}

function limpiarErrores(errorId) {
    const errorContainer = document.getElementById(errorId);
    if (errorContainer) {
        errorContainer.innerHTML = "";
    }
}
