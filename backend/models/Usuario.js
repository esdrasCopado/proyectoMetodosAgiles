// Usuario.js
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'


const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'usuarios'
  }
)

export default Usuario
