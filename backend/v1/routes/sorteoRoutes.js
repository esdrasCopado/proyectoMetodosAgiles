import express from 'express'
import verificarToken from '../../middlewares/auth.js'
import sorteoRoutes from '../../controllers/sorteoController.js'

const route = express.Router()

// Define API endpoints
route

  .post('/Crearsorteo', verificarToken, sorteoRoutes.crearSorteo)
  .get('/obtenerSorteo', verificarToken, sorteoRoutes.consultarSorteos)

export default route
