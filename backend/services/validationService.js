// validationService.js

export function validarFechas(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) {
        throw new Error("Las fechas de inicio y fin son necesarias.");
    }

    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);

    if (fechaInicio < today) {
        throw new Error('La fecha de inicio debe ser posterior a la fecha actual.');
    }

    if (fechaFin < fechaInicio) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio.');
    }
}

export function convertirFecha(fecha){
    const [year, month, day] = fecha.split("-");
    return new Date(year, month - 1, day);
}



export function validarRangoNumeros(rangoNumeros) {
    if (!rangoNumeros.includes("-")) {
        throw new Error('El rango de números debe estar separado por un guión.');
    }
    // el rango tiene que ser numero si no se genera un error
    const [numero1, numero2] = rangoNumeros.split("-").map(num => parseInt(num));
    if (isNaN(numero1) || isNaN(numero2)) {
        throw new Error('El rango de números debe ser numérico.');
    }

    if (numero1 >= numero2) {
        throw new Error('El primer número debe ser menor que el segundo.');
    }
    if (numero2 - numero1 < 20) {
    }
}
