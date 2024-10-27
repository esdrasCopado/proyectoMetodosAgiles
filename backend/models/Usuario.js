import { DataTypes } from 'sequelize';
import { sequelize  } from '../config/database';

const Usuario = sequelize.define('Usuario', {
    // Definir columnas y sus tipos
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true, 
    tableName: 'usuarios'
  });
  
  module.exports = Usuario;
