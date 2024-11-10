import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


// Configura tu conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_ROOT_PASSWORD, {
  host: process.env.DB_HOST,  // O usa '127.0.0.1'
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT
});

  

export default sequelize;


