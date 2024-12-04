import express from 'express'
import numeroController from '../../controllers/numeroController.js'

const route = express.Router()

// Define API endpoints
route
  .post('/numero', numeroController.crearNumeroRifa)
  .get('/numero', numeroController.obtenerNumerosRifa)
  .post('/obtenerDetallesSorteosUsuario', numeroController.obtenerDetallesSorteosUsuario)

export default route
