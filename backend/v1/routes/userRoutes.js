// userRoutes.js
import express from 'express'
import userController from '../../controllers/userController.js'

const route = express.Router()

// Define API endpoints
route
  .post('/autenticarUsuario', userController.autenticar)
  .post('/registrarUsuario', userController.registrar)

export default route
