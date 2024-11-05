import Sorteo from '../models/sorteos.js';
import sequelize from '../config/database.js';
import path from 'path';
import sharp from 'sharp';

const crearSorteo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        // Verificar que se haya cargado un archivo
        if (!req.files || !req.files.imagenSorteo) {
            return res.status(400).send('No se ha cargado ninguna imagen.');
        }

        
        const file = req.files.imagenSorteo;

        // Verificar tipo y tamaño de imagen
        const imagenValida = await verificarImagen(file);
        if (!imagenValida) {
            return res.status(400).send('Imagen no válida. Debe ser JPG, PNG o GIF y tener al menos 500px de ancho.');
        }

        // Guardar la imagen si es válida
        const imagenPath = await guardarImagen(file);
        console.log("imagenPath"+imagenPath);

        const fechaInicio = new Date(req.body.fechaInicioSorteo);
        const fechaFin = new Date(req.body.fechaFinSorteo);
        const fechaActual = new Date();

        // Validar la fecha de inicio
        if (fechaInicio <= fechaActual) {
            return res.status(400).json({ mensaje: 'La fecha de inicio debe ser posterior a la fecha actual.' });
        }

        // Validar la fecha de fin
        if (fechaFin <= fechaInicio) {
            return res.status(400).json({ mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio.' });
        }

        // Crear el sorteo en la base de datos
        const nuevoSorteo = await Sorteo.create({
            nombreSorteo: req.body.nombreSorteo,
            cantidadSorteos: req.body.cantidadSorteos,
            ulrImagenSorteo: imagenPath,
            rangoNumeros: req.body.rangoNumeros,
            fechaInicioSorteo: fechaInicio,
            fechaFinSorteo: fechaFin
        }, { transaction: t });

        await t.commit();
        res.status(200).send({message : 'Sorteo creado y archivo guardado con éxito.'});
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).send('Error al crear el sorteo.');
    }
};

async function verificarImagen(file) {
    
    try {
        // Verificar que el archivo sea una imagen de tipo JPG, PNG o GIF
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return false;
        }

        // Verificar dimensiones (mínimo 500px de ancho)
        const metadata = await sharp(file.tempFilePath).metadata(); // Usar tempFilePath



        if (metadata.width < 500) {
            return false;
        }

        return true; // La imagen cumple con los requisitos
    } catch (error) {
        console.error('Error al verificar imagen: ', error.message);
        return false;
    }
}


async function guardarImagen(file) {
    const uploadDir = path.join('uploads');
    const filePath = path.join(uploadDir, file.name);

    return new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
            if (err) {
                console.error(err);
                reject(new Error('Error al guardar la imagen.'));
            } else {
                resolve(filePath); // Retorna la ruta de la imagen guardada
            }
        });
    });
}

export default { crearSorteo };
