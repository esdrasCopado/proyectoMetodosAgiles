import { Sequelize } from 'sequelize';

// Configura tu conexión a la base de datos
const sequelize = new Sequelize('metodosAgilesDB', 'root', 'metodosAgiles10', {
  host: 'localhost',  // O usa '127.0.0.1'
  dialect: 'mysql',
  port: 3302
});

  

export default sequelize;


