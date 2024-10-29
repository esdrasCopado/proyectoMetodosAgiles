import { stub } from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';  // Tu archivo principal de la aplicación
import Usuario from '../models/Usuario.js';  // El modelo Usuario
import sequelize from '../config/database.js';

describe('Controlador Usuario - registrar', () => {

    after(() => {
        sequelize.close();  // Cerrar la conexión con la base de datos
        Usuario.destroy({ where: {} });  // Borrar todos los usuarios registrados
    });
    it('Debería registrar un usuario correctamente', async () => {
        const fakeUser = { id: 1, nombre: 'John Doe', email: 'john@example.com', contrasena: 'hashed_password' };
        const createStub = stub(Usuario, 'create').resolves(fakeUser);

        const res = await request(app)
          .post('/api/v1/users/registrarUsuario')
          .send({ nombre: 'John Doe', email: 'john@example.com', contrasena: 'password' });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('mensaje', 'El usuario se registró exitosamente');

        createStub.restore();  // Restaurar el stub después de la prueba
    });
    it('Debería responder con un error si los datos son inválidos', async () => {
        const res = await request(app)
         .post('/api/v1/users/registrarUsuario')
         .send({ nombre: 'John Doe', email: 'john@example.com', contrasena: '' });  // Contraseña vacía

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('mensaje', 'La contraseña es requerida'); // Asegúrate de que tu controlador maneje esto
    });

    it('Debería responder con un error si los datos están incompletos', async () => {
        const res = await request(app)
         .post('/api/v1/users/registrarUsuario')
         .send({ nombre: '', email: 'john@example.com', contrasena: 'password' });  // Nombre vacío

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('mensaje', 'El nombre es requerido'); // Asegúrate de que tu controlador maneje esto
    });
    it('Deveria responder con un error si los datos están incompletos', async () => {
        const res = await request(app)
         .post('/api/v1/users/registrarUsuario')
         .send({ nombre: 'John Doe', email: '', contrasena: 'password' });  // Email vacío

         expect(res.status).to.equal(400);
        expect(res.body).to.have.property('mensaje', 'El email es requerido'); // Asegúrate de que tu controlador maneje esto
    })

    
});



