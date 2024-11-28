/* eslint-disable no-undef */
import { expect } from 'chai'
import sinon from 'sinon'
import request from 'supertest'
import app from '../index.js'
import Sorteo from '../models/sorteos.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'

// Configurar __dirname manualmente
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('controller sorteo', () => {
  describe('crearSorteo', function () {
    this.timeout(10000) // Extender el tiempo de espera en caso de operaciones lentas

    afterEach(() => {
      sinon.restore() // Restaurar todos los stubs entre pruebas
    })

    after(async () => {
      try {
        await Sorteo.destroy({ where: {} }) // Eliminar registros de la tabla `sorteos`
      } catch (error) {
        console.error('Error al eliminar registros de Sorteo:', error.message)
      }

      try {
        await fs.unlink(path.join(__dirname, '../uploads/imagValida.png')) // Eliminar la imagen de prueba
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
        .set('Authorization', `Bearer ${token}`)
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
