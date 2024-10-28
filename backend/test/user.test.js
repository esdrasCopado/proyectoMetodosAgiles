import { stub } from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';  // Tu archivo principal de la aplicación
import Usuario from '../models/Usuario.js';  // El modelo Usuario
import sequelize from '../config/database.js';

describe('Controlador Usuario - registrar', () => {
    before(async () => {
        await sequelize.sync({ force: true });  // Crear la tabla de usuarios si no existe
    });
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

    
});



