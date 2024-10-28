import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import NumeroSorteo from './NumeroSorteo.js'; // Asegúrate de tener este modelo definido
import Usuario from './Usuario.js';

const Sorteo = sequelize.define('Sorteo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    nombreSorteo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'sorteos'
});

// Relación Uno a Muchos entre Sorteo y NumeroSorteo
Sorteo.hasMany(NumeroSorteo, { foreignKey: 'idSorteo' });
NumeroSorteo.belongsTo(Sorteo, { foreignKey: 'idSorteo' });

// Relación Muchos a Muchos entre Usuario y Sorteo
Usuario.belongsToMany(Sorteo, { through: NumeroSorteo, foreignKey: 'idUsuario' });
Sorteo.belongsToMany(Usuario, { through: NumeroSorteo, foreignKey: 'idSorteo' });

export default Sorteo;

