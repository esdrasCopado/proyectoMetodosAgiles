import express from 'express';
import v1UserRoutes from './v1/routes/userRoutes.js';
import sequelize from './config/database.js';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Definir rutas
app.use("/api/v1/users", v1UserRoutes);

// Ruta raíz
app.use('/', (req, res) => {
    res.send('API Restful de usuarios');
});

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada');
  
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
});

export default app;



