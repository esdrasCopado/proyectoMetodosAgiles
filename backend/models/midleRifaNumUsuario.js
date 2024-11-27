import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const midleRifaNumUser = sequelize.define('midleRifaNumUser', {
  numero: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Usuario', // Nombre de la tabla en la base de datos
      key: 'id'
    }
  },
  sorteoId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Sorteo', // Nombre de la tabla en la base de datos
      key: 'id'
    }
  }
})

export default midleRifaNumUser
