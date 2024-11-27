import numeroRifa from "../models/numeroRifa.js"
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Obtener los números disponibles para mostrarlos en el frontend
const obtenerNumerosRifa = async (req, res) => {
    try {
        // Buscar números que están disponibles (no reservados o reserva expirada)
        const numerosDisponibles = await NumeroRifa.findAll({
            where: {
                [Op.or]: [
                    { reservadoHasta: null }, // Nunca reservados
                    { reservadoHasta: { [Op.lt]: new Date() } } // Reserva expirada
                ]
            },
            attributes: ['numero'] // Solo devolver el número
        });
        res.status(200).json(numerosDisponibles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los números disponibles.' });
    }
};

const crearNumeroRifa = (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { numeros, usuarioId, reservadoHasta } = req.body;

        if (!Array.isArray(numeros) || numeros.length === 0) {
            return res.status(400).json({ mensaje: 'Debe seleccionar al menos un número para reservar.' });
        }

        // Validar disponibilidad de los números seleccionados
        const numerosDisponibles = await NumeroRifa.findAll({
            where: {
                numero: numeros,
                [Op.or]: [
                    { reservadoHasta: null },
                    { reservadoHasta: { [Op.lt]: new Date() } }
                ]
            },
            transaction: t
        });

        if (numerosDisponibles.length !== numeros.length) {
            const numerosNoDisponibles = numeros.filter(num => !numerosDisponibles.map(n => n.numero).includes(num));
            return res.status(400).json({ mensaje: 'Algunos números ya no están disponibles.', numerosNoDisponibles
            });
        }

        // Asignar los números al usuario
        await NumeroRifa.update(
                {
                    usuarioId,
            reservadoHasta: new Date(reservadoHasta)
        },
        {
            where: {
                numero: numeros
            },
            transaction: t
        }
                );

        await t.commit();
        res.status(200).json({ mensaje: 'Números reservados exitosamente.', numerosReservados: numeros });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ mensaje: 'Error al reservar números.' });
    }
};

// Liberar números cuya reserva haya expirado
const liberarNumerosExpirados = async () => {
    try {
        const ahora = new Date();

        // Actualizar los números con reservas expiradas
        const [cantidadLiberados] = await NumeroRifa.update({
            usuarioId: null,
            reservadoHasta: null
        },
        {
            where: {
                reservadoHasta: { [Op.lte]: ahora } // Liberar los que expiraron
            }
        });
        console.log(`Liberados ${cantidadLiberados} números cuya reserva había expirado.`);
    } catch (error) {
        console.error('Error al liberar números expirados:', error);
    }
};

const liberarNumerosManualmente = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {numeros, usuarioId} = req.body;

        if (!Array.isArray(numeros) || numeros.length === 0) {
            return res.status(400).json({mensaje: 'Debe seleccionar al menos un número para liberar.'});
        }

        // Validar que los números estén reservados por el usuario actual
        const numerosReservados = await NumeroRifa.findAll({
            where: {
                numero: numeros,
                usuarioId // Solo puede liberar los números que él reservó
            },
            transaction: t
        });

        if (numerosReservados.length !== numeros.length) {
            const numerosNoReservados = numeros.filter(num => !numerosReservados.map(n => n.numero).includes(num));
            return res.status(400).json({
                mensaje: 'Algunos números no están reservados por usted o ya fueron liberados.',
                numerosNoReservados
            });
        }

        // Liberar los números seleccionados
        await NumeroRifa.update({
            usuarioId: null,
            reservadoHasta: null
        },
        {
            where: {
                numero: numeros
            },
            transaction: t
        });

        await t.commit();
        res.status(200).json({mensaje: 'Números liberados exitosamente.', numerosLiberados: numeros});
    } catch (error) {
        await t.rollback();
        res.status(500).json({mensaje: 'Error al liberar números.'});
    }
};

export default {obtenerNumerosRifa, crearNumeroRifa, liberarNumerosExpirados, liberarNumerosManualmente};
