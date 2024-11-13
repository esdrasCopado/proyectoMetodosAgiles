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
  }
}, {
  timestamps: true,
  tableName: 'numeros_rifa'
})

export default NumeroRifa
