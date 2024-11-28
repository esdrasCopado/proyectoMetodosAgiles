// userRoutes.js
import express from 'express'
import userController from '../../controllers/userController.js'
import verificarToken from '../../middlewares/auth.js'

const route = express.Router()

// Define API endpoints
route
  .post('/autenticarUsuario', userController.autenticar)
  .post('/registrarUsuario', userController.registrar)
  .post('/verificarUsuario', verificarToken, userController.consultarIdUsuario)

export default route
