import express from 'express';
import sorteoRoutes from '../../controllers/sorteoController.js';

const route = express.Router();


// Define API endpoints
route
  
  .post('/Crearsorteo', sorteoRoutes.crearSorteo)
  .get('/obtenerSorteo',sorteoRoutes.consultarSorteos)

export default route;