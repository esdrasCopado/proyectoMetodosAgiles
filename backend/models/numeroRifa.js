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
  usuarioId: { // Cambié el nombre a 'usuarioId' para referirse a la tabla 'usuarios'
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios', // Asegúrate de que el modelo 'usuarios' esté correctamente referenciado
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  timestamps: true,
  tableName: 'numeros_rifa'
})

export default NumeroRifa
