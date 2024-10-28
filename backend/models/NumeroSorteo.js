import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const NumeroSorteo = sequelize.define('NumeroSorteo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idSorteo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'libre'
    }
}, {
    timestamps: true,
    tableName: 'numeros_sorteos'
});

export default NumeroSorteo;

