import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../index.js';
import Sorteo from '../models/sorteos.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import sequelize from '../config/database.js';  // Asegúrate de exportar la instancia de sequelize correctamente

// Configurar __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('controller sorteo', () => {
    describe('crearSorteo', function () {
        this.timeout(3000);
        before(async () => {
            await sequelize.sync({ force: true });
        });
        after(async () => {
            try {
                // Verifica si la tabla existe antes de eliminar
                const tableExists = await sequelize.query(
                    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'sorteos' AND TABLE_SCHEMA = 'test_db'"
                );
        
                if (tableExists[0].length > 0) {
                    await Sorteo.destroy({ where: {} });
                }
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
            // Stub del método create de Sequelize
            const sorteoStub = sinon.stub(Sorteo, 'create').resolves({
                nombreSorteo: 'Sorteo de prueba',
                cantidadSorteos: 100,
                rangoNumeros: '1-100',
                fechaInicioSorteo: new Date(),
                fechaFinSorteo: new Date(),
                ulrImagenSorteo: 'uploads/imagenesPrueba/imagValida.png'
            });

            // Enviar solicitud POST con imagen y datos
            const res = await request(app)
                .post('/api/v1/sorteo/Crearsorteo')
                .field('nombreSorteo', 'Sorteo de prueba')
                .field('cantidadSorteos', 100)
                .field('rangoNumeros', '1-100')
                .field('fechaInicioSorteo', new Date().toISOString())
                .field('fechaFinSorteo', new Date().toISOString())
                .attach('imagenSorteo', path.join(__dirname, '../uploads/imagenesPrueba/imagValida.png'));

            // Validaciones
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Sorteo creado y archivo guardado con éxito.');

            // Restaurar el stub
            sorteoStub.restore();
        });
    });
});
