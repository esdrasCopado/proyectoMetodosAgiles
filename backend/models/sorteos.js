// Sorteo.js
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

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
  },
  ulrImagenSorteo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rangoNumeros: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaInicioSorteo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFinSorteo: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'sorteos' // Especifica el nombre de la tabla si deseas que sea diferente al nombre del modelo
})

export default Sorteo
