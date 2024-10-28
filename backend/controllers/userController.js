import Sorteo from '../models/Sorteos.js';
import NumeroSorteo from '../models/NumeroSorteo.js';
import Usuario from '../models/Usuario.js';
import sequelize from '../config/database.js';  // Asegúrate de que esta ruta es correcta

const autenticar = (req, res) => {
    // Implementación para validar el token del usuario
    res.json({
        mensaje: 'Autenticado correctamente',
    });
};

const registrar = async (req, res) => {
    const t = await sequelize.transaction();  // Creas la transacción aquí
    try {
        const { nombre, email, contrasena } = req.body;

        // Creas el usuario con la transacción que has definido
        const usuario = await Usuario.create({ nombre, email, contrasena }, { transaction: t });
        
        await t.commit();  // Si todo sale bien, haces el commit de la transacción

        res.status(200).json({ mensaje: 'El usuario se registró exitosamente' });

    } catch (error) {
        await t.rollback();  // Si hay un error, haces rollback
        console.error('Error al registrar:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor',
        });
    }
};

export default { autenticar, registrar };


