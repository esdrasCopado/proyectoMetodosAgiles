import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../index.js';
import Sorteo from '../models/sorteos.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import sequelize from '../config/database.js';

// Configurar __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('controller sorteo', () => {
    describe('crearSorteo', function () {
        this.timeout(5000);  // Extender el tiempo de espera en caso de operaciones lentas
        
        before(async () => {
            await sequelize.sync({ force: true });
            
            // Asegurarse de que la imagen de prueba exista
            const imagePath = path.join(__dirname, '../uploads/imagenesPrueba/imagValida.png');
            try {
                await fs.access(imagePath);  // Verificar si la imagen existe
            } catch (error) {
                throw new Error('La imagen de prueba no existe: ' + imagePath);
            }
        });

        afterEach(() => {
            sinon.restore();  // Restaurar todos los stubs entre pruebas
        });

        after(async () => {
            try {
                await Sorteo.destroy({ where: {} }); // Eliminar registros de la tabla `sorteos`
            } catch (error) {
                console.error("Error en el hook after all:", error.message);
            }
            
            try {
                await fs.unlink(path.join(__dirname, '../uploads/imagValida.png'));  // Eliminar la imagen de prueba si existe
            } catch (error) {
                if (error.code !== 'ENOENT') {  // Ignorar error si el archivo no existe
                    console.error('Error al eliminar la imagen:', error.message);
                }
            }
        });

        it('Debería crear un nuevo sorteo', async () => {
            // Crear fechas válidas para la prueba
            const fechaActual = new Date();
            const fechaInicioSorteo = new Date(fechaActual);
            fechaInicioSorteo.setDate(fechaInicioSorteo.getDate() + 1);  // Un día después de la fecha actual
            const fechaFinSorteo = new Date(fechaInicioSorteo);
            fechaFinSorteo.setDate(fechaFinSorteo.getDate() + 1);  // Un día después de la fecha de inicio
        
            // Stub del método create de Sequelize
            const sorteoStub = sinon.stub(Sorteo, 'create').resolves({
                nombreSorteo: 'Sorteo de prueba',
                cantidadSorteos: 100,
                rangoNumeros: '1-100',
                fechaInicioSorteo,
                fechaFinSorteo,
                ulrImagenSorteo: 'uploads/imagenesPrueba/imagValida.png'
            });
        
            // Enviar solicitud POST con la imagen y las fechas válidas
            const res = await request(app)
                .post('/api/v1/sorteo/Crearsorteo')
                .field('nombreSorteo', 'Sorteo de prueba')
                .field('cantidadSorteos', 100)
                .field('rangoNumeros', '1-100')
                .field('fechaInicioSorteo', fechaInicioSorteo.toISOString())
                .field('fechaFinSorteo', fechaFinSorteo.toISOString())
                .attach('imagenSorteo', path.join(__dirname, '../uploads/imagenesPrueba/imagValida.png'));
        
            // Validaciones
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Sorteo creado y archivo guardado con éxito.');
        
            // Restaurar el stub
            sorteoStub.restore();
        });
        
    });
});

