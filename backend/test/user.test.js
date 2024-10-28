import { stub } from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';  // Tu archivo principal de la aplicación
import Usuario from '../models/Usuario.js';  // El modelo Usuario

describe('Controlador Usuario - registrar', () => {
    beforeEach(async () => {
      // Borrar todos los usuarios antes de cada prueba
      await Usuario.destroy({ where: {} });
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

    it('Debería responder con un error si el email ya está registrado', async () => {
        const existingUser = { id: 1, nombre: 'John Doe', email: 'john@example.com', contrasena: 'hashed_password' };
        await Usuario.create(existingUser);

        const res = await request(app)
          .post('/api/v1/users/registrarUsuario')
          .send({ nombre: 'Jane Doe', email: 'john@example.com', contrasena: 'password' });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('mensaje', 'El email ya está registrado');
    });

    it('Debería responder con un error si los datos son inválidos', async () => {
        const res = await request(app)
         .post('/api/v1/users/registrarUsuario')
         .send({ nombre: 'John Doe', email: 'john@example.com', contrasena: '' });  // Contrasena vacía

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
});

