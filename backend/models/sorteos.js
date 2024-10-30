import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Usuario = sequelize.define('Sorteo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    nombreSorteo: {
        references: {
            model: 'numeroRifa',
            key: 'id'
        }
    },
    cantidadSorteos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    premio: {
        type: DataTypes.STRING
    },
    ulrImagenSorteo:{
        type: DataTypes.STRING
    },
    rangoNumeros: {
        type: DataTypes.STRING
    },
    fechaInicioSorteo: { 
        type: DataTypes.DATE
    },
    fechaFinSorteo: {
        type: DataTypes.DATE
    }
})