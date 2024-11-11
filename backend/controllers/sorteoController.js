import sequelize from '../config/database.js';
import { verificarImagen, guardarImagen } from '../services/imageService.js';
import { validarFechas, validarRangoNumeros, convertirFecha } from '../services/validationService.js';
import { crearSorteoEnBD } from '../services/sorteoService.js';
import Sorteo from '../models/sorteos.js'; // Asegúrate de importar el modelo de Sorteo

const crearSorteo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if (!req.files || !req.files.imagenSorteo) {
            return res.status(400).send({ message: 'No se ha cargado ninguna imagen.' });
        }

        const file = req.files.imagenSorteo;

        // Verificar y guardar la imagen
        try {
            await verificarImagen(file);
        } catch (error) {
            await t.rollback();
            return res.status(400).send({ message: 'Imagen no válida. Debe ser JPG, PNG o GIF y tener al menos 500px de ancho.' });
        }

        const imagenPath = await guardarImagen(file);
        const fechaInicio = convertirFecha(req.body.fechaInicioSorteo);
        const fechaFin = convertirFecha(req.body.fechaFinSorteo);

        // Validar fechas y rango de números
        validarFechas(fechaInicio, fechaFin);
        validarRangoNumeros(req.body.rangoNumeros);

        // Crear el sorteo en la base de datos
        await crearSorteoEnBD({
            nombreSorteo: req.body.nombreSorteo,
            ulrImagenSorteo: imagenPath,
            rangoNumeros: req.body.rangoNumeros,
            fechaInicioSorteo: fechaInicio,
            fechaFinSorteo: fechaFin
        }, t);

        await t.commit();
        res.status(200).send({ message: 'Sorteo creado y archivo guardado con éxito.' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(400).send({ message: error.message });
    }
};

// Consultar todos los sorteos en la base de datos
const consultarSorteos = async (req, res) => {
    console.log('se esta enviando los sorteos');
    try {
        const sorteos = await Sorteo.findAll(); // Aquí se debe usar el modelo de Sorteo
        res.status(200).send(sorteos);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al consultar los sorteos.' });
    }
};

export default { crearSorteo, consultarSorteos };

