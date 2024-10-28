import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

import NumeroSorteo from './NumeroSorteo.js'; // Asegúrate de tener este modelo definido

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'usuarios'
});

// Relación de Usuario con NumeroSorteo (uno a muchos)
Usuario.hasMany(NumeroSorteo, { foreignKey: 'idUsuario' });
NumeroSorteo.belongsTo(Usuario, { foreignKey: 'idUsuario' });

export default Usuario;


