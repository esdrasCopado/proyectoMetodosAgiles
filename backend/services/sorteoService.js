// sorteoService.js

import Sorteo from '../models/sorteos.js';

export async function crearSorteoEnBD(data, transaction) {
    return await Sorteo.create(data, { transaction });
}
