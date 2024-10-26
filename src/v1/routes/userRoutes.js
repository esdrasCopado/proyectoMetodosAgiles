// userRoutes.js
import express from 'express';
import userController from '../../controllers/userController.js';

const route = express.Router();

// Define API endpoints
route
  .get('/', userController.autenticar);

export default route;
