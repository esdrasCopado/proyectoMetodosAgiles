// NumeroRifa.js
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

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
    usuarioId: { // Usuario que reservó el número
          type: DataTypes.INTEGER,
          allowNull: true, // Null si no está reservado
          references: {
              model: 'usuarios', // Nombre de la tabla usuarios
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
      },
      reservadoHasta: { // Tiempo límite de la reserva
          type: DataTypes.DATE,
          allowNull: true
      }
}, {
  timestamps: true,
  tableName: 'numeros_rifa'
});

export default NumeroRifa
