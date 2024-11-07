import Sorteo from '../models/sorteos.js';
import sequelize from '../config/database.js';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const crearSorteo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        // Verificar que se haya cargado un archivo
        if (!req.files || !req.files.imagenSorteo) {
            await t.rollback();
            return res.status(400).send('No se ha cargado ninguna imagen.');
        }

        const file = req.files.imagenSorteo;

        // Verificar tipo y tamaño de imagen
        const imagenValida = await verificarImagen(file);
        if (!imagenValida) {
            await t.rollback();
            return res.status(400).send('Imagen no válida. Debe ser JPG, PNG o GIF y tener al menos 500px de ancho.');
        }

        // Guardar la imagen si es válida
        const imagenPath = await guardarImagen(file);

        

        const fechaInicio = new Date(req.body.fechaInicioSorteo);
        const fechaFin = new Date(req.body.fechaFinSorteo);
        const fechaActual = new Date();


        // Validar la fecha de inicio
        if (fechaInicio <= fechaActual) {
            await t.rollback();
            return res.status(400).json({ mensaje: 'La fecha de inicio debe ser posterior a la fecha actual.' });
        }

        // Validar la fecha de fin
        if (fechaFin <= fechaInicio) {
            await t.rollback();
            return res.status(400).json({ mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio.' });
        }

        // Validación del rango de números
        const rangoNumeros = req.body.rangoNumeros;
        const [numero1, numero2] = rangoNumeros.split("-").map(num => parseInt(num));

        // Verificar que el primer número sea menor que el segundo
        if (numero1 >= numero2) {
            return res.status(400).json({ mensaje: 'El primer número debe ser menor que el segundo.' });
        }

        // Verificar que el rango sea de al menos 20 números
        if (numero2 - numero1 < 20) {
            return res.status(400).json({ mensaje: 'El rango de números debe ser de al menos 20 números.' });
        }

        // Crear el sorteo en la base de datos
        const nuevoSorteo = await Sorteo.create({
            nombreSorteo: req.body.nombreSorteo,
            ulrImagenSorteo: imagenPath,
            rangoNumeros: req.body.rangoNumeros,
            fechaInicioSorteo: fechaInicio,
            fechaFinSorteo: fechaFin
        }, { transaction: t });

        await t.commit();
        res.status(200).send({ message: 'Sorteo creado y archivo guardado con éxito.' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).send('Error al crear el sorteo.');
    }
};

async function verificarImagen(file) {
    try {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return false;
        }

        const metadata = await sharp(file.tempFilePath).metadata();
        if (metadata.width < 500) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al verificar imagen:', error.message);
        return false;
    }
}

async function guardarImagen(file) {
    const uploadDir = path.join('uploads');

    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);

    return new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
            if (err) {
                console.error(err);
                reject(new Error('Error al guardar la imagen.'));
            } else {
                resolve(filePath);
            }
        });
    });
}

export default { crearSorteo };

