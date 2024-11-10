// NumeroRifa.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const NumeroRifa = sequelize.define('NumeroRifa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    // los estados pueden ser libre, apartado, compado
    estado: {
        type: DataTypes.ENUM('libre', 'apartado', 'comprado'),
        defaultValue: 'libre'
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'sorteos', // Asegura que referencie el modelo Sorteo
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Si un sorteo es eliminado, se asignará NULL
    }
}, {
    timestamps: true,
    tableName: 'numeros_rifa'
});

export default NumeroRifa;
