// modelo numeroRifa.js
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
    unique: true // Unicidad garantizada
  },
  estado: {
    type: DataTypes.ENUM('APARTADO', 'PAGADO'),
    defaultValue: 'APARTADO' // Estado por defecto en caso de no especificar
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Mantener la restricción de NOT NULL
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Cambiar SET NULL a CASCADE
  },
  sorteoId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Mantener la restricción de NOT NULL
    references: {
      model: 'sorteos',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Cambiar SET NULL a CASCADE
  },
  reservadoHasta: {
    type: DataTypes.DATE,
    allowNull: true // Fecha límite de la reserva
  },
  comprobanteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'comprobantes',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  timestamps: true,
  tableName: 'numeros_rifa',
  paranoid: false, // Si deseas soporte para "soft delete"
  indexes: [
    { fields: ['usuarioId'] },
    { fields: ['sorteoId'] },
    { fields: ['numero'] },
    { fields: ['comprobanteId'] }
  ]
})

export default NumeroRifa
