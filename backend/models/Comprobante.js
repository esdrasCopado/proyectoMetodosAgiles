import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Comprobante = sequelize.define('Comprobante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false // La URL es obligatoria
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true // Información adicional opcional
  }
}, {
  timestamps: true,
  tableName: 'comprobantes',
  paranoid: false // Si deseas soporte para "soft delete"
})

export default Comprobante
