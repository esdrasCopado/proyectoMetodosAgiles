/* eslint-disable no-undef */
import { expect } from 'chai'
import sinon from 'sinon'
import request from 'supertest'
import app from '../index.js'
import Sorteo from '../models/sorteos.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import sequelize from '../config/database.js'
import jwt from 'jsonwebtoken'

// Configurar __dirname manualmente
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('controller sorteo', () => {
  describe('crearSorteo', function () {
    this.timeout(5000) // Extender el tiempo de espera en caso de operaciones lentas

    before(async () => {
      try {
        // Deshabilitar las restricciones de clave foránea temporalmente
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })

        // Sincronizar únicamente la tabla Sorteo
        await sequelize.models.Sorteo.sync({ force: true })

        // Volver a habilitar las restricciones de clave foránea
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })

        // Asegurarse de que la imagen de prueba exista
        const imagePath = path.join(__dirname, '../uploads/imagenesPrueba/imagValida.png')
        await fs.access(imagePath) // Verificar si la imagen existe
      } catch (error) {
        throw new Error('Error en la configuración previa a las pruebas: ' + error.message)
      }
    })

    afterEach(() => {
      sinon.restore() // Restaurar todos los stubs entre pruebas
    })

    after(async () => {
      try {
        await Sorteo.destroy({ where: {} }) // Eliminar registros de la tabla `sorteos`
      } catch (error) {
        console.error('Error en el hook after all:', error.message)
      }

      try {
        await fs.unlink(path.join(__dirname, '../uploads/imagValida.png')) // Eliminar la imagen de prueba si existe
      } catch (error) {
        if (error.code !== 'ENOENT') { // Ignorar error si el archivo no existe
          console.error('Error al eliminar la imagen:', error.message)
        }
      }
    })

    it('Debería crear un nuevo sorteo', async () => {
      // Crear fechas válidas para la prueba
      const fechaActual = new Date()
      const fechaInicioSorteo = new Date(fechaActual)
      fechaInicioSorteo.setDate(fechaInicioSorteo.getDate() + 1) // Un día después de la fecha actual
      const fechaFinSorteo = new Date(fechaInicioSorteo)
      fechaFinSorteo.setDate(fechaFinSorteo.getDate() + 1) // Un día después de la fecha de inicio

      // Crear un token de prueba
      const token = jwt.sign({ id: 1, email: 'usuario@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' })

      // Stub del método create de Sequelize
      const sorteoStub = sinon.stub(Sorteo, 'create').resolves({
        nombreSorteo: 'Sorteo de prueba',
        rangoNumeros: '1-100',
        fechaInicioSorteo,
        fechaFinSorteo,
        ulrImagenSorteo: 'uploads/imagenesPrueba/imagValida.png'
      })

      const res = await request(app)
        .post('/api/v1/sorteo/Crearsorteo')
        .set('Authorization', `Bearer ${token}`) // Agregar el token al encabezado de autorización
        .field('nombreSorteo', 'Sorteo de prueba')
        .field('rangoNumeros', '1-100')
        .field('fechaInicioSorteo', fechaInicioSorteo.toISOString())
        .field('fechaFinSorteo', fechaFinSorteo.toISOString())
        .attach('imagenSorteo', path.join(__dirname, '../uploads/imagenesPrueba/imagValida.png'))

      // Validaciones
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('message', 'Sorteo creado y archivo guardado con éxito.')

      // Restaurar el stub
      sorteoStub.restore()
    })
  })
})
