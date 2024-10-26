


function validateNoVoid(identificadorElement){
    if(identificadorElement.value.trim() === ""){
        inputError(identificadorElement)
        mensajeError("Por favor, introduzca un valor para este campo.", "error-"+identificadorElement.id);
        return false;
    }else{
        limpiarErrores(identificadorElement); // Limpiamos el error si es que tenía uno
        return true;
    }
}
function validateEmail(emailElement) {
    var validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if(emailElement.value==""){
        inputError(emailElement)
        mensajeError("Por favor, introduzca su correo electrónico.", "errorEmail");
        return false;
    }
    if(validEmail.test(emailElement.value)){
        limpiarErrores(emailElement); // Limpiamos el error si es que tenía uno
        return true;
    }else{
        inputError(emailElement)
        mensajeError("Correo electrónico no válido", "errorEmail");
        return false;
    }
}

function validatePassword(passwordElement) {
    var validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(passwordElement.value==""){
        inputError(passwordElement)
        mensajeError("Por favor, introduzca una contraseña.", "errorContraseña");
        return false;
    }
    if(validPassword.test(passwordElement.value)){
        limpiarErrores(passwordElement); // Limpiamos el error si es que tenía uno
        return true;
    }
    else{
        inputError(passwordElement)
        mensajeError("Contraseña no válida. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.", "errorContraseña");
        return false;
    }
}

function mensajeError(message, identificador) {
    const inputElement = document.getElementById(identificador);
    const htmlErrorMesaje = `
        <div class="error-container">
            <div class="icon-container">
                <svg aria-hidden="true" class="warning-icon" fill="currentColor" focusable="false" width="16px" height="16px"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
                    </path>
                </svg>
            </div>
            <div class="mensaje-error">
                <span>${message}</span>
            </div>
        </div>
    `;
    setTimeout(() => {
        inputElement.innerHTML = htmlErrorMesaje;
    }, 200); // Aparece después de 200ms
}
function inputError(identificador){
    identificador.classList.add('input-error');
}
function limpiarErrores(identificador){
    identificador.classList.remove('input-error');
}