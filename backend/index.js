import express from 'express'
import sequelize from './config/database.js'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'

// Modelos y relaciones de la base de datos
import db from './models/index.js'

// Rutas de la aplicación
import v1UserRoutes from './v1/routes/userRoutes.js'
import v1SorteoRoutes from './v1/routes/sorteoRoutes.js'
import v1NumeroRifaRoutes from './v1/routes/numeroRoutes.js'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware de CORS
app.use(cors())

// Middleware para manejar JSON
app.use(express.json())

// Middleware para manejar archivos
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads/',
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 } // Limitar tamaño de archivos a 10MB
  })
)

app.use('/uploads', express.static('uploads'))

// Sincronizar modelos con la base de datos
db.sequelize
  .sync({ alter: true }) // Puedes usar `force: false` en lugar de `alter` si no deseas modificar la estructura automáticamente
  .then(() => {
    console.log('Base de datos sincronizada')
    // Iniciar el servidor después de sincronizar la base de datos
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err)
  })

// Definir rutas
app.use('/api/v1/users', v1UserRoutes)
app.use('/api/v1/sorteo', v1SorteoRoutes)
app.use('/api/v1/numeroRifa', v1NumeroRifaRoutes)

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API Restful de usuarios')
})

// Manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada')
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error interno del servidor')
})

export default app
