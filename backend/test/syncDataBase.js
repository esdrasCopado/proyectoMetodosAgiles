import sequelize from '../config/database.js'; // Cambia esta ruta según tu configuración

before(async () => {
  await sequelize.sync({ force: true }); // 'force: true' recreará las tablas cada vez
});
