import express from 'express'
import numeroController from '../../controllers/numeroController.js'

const route = express.Router()

// Define API endpoints
route
  .post('/numero', numeroController.crearNumeroRifa)
  .get('/numero', numeroController.obtenerNumerosRifa)
  .get('/obtenerNumerosAgrupados', numeroController.obtenerNumerosAgrupados)

export default route
