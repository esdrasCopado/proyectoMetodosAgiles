import sequelize from '../config/database.js'
import { verificarImagen, guardarImagen } from '../services/imageService.js'
import jwt from 'jsonwebtoken'
import {
  validarFechas,
  validarRangoNumeros,
  convertirFecha
} from '../services/validationService.js'
import { crearSorteoEnBD } from '../services/sorteoService.js'
import Sorteo from '../models/sorteos.js' // Asegúrate de importar el modelo de Sorteo

const crearSorteo = async (req, res) => {
  verificarToken(req)

  // verificar que no exista un sorteo con el mismo nombre
  const sorteoExiste = await Sorteo.findOne({
    where: { nombreSorteo: req.body.nombreSorteo }
  })
  if (sorteoExiste) {
    return res
      .status(409)
      .json({ message: 'Ya existe un sorteo con el mismo nombre.' })
  }
  const t = await sequelize.transaction()
  try {
    if (!req.files || !req.files.imagenSorteo) {
      return res
        .status(400)
        .send({ message: 'No se ha cargado ninguna imagen.' })
    }

    const file = req.files.imagenSorteo

    // Verificar y guardar la imagen
    try {
      await verificarImagen(file)
    } catch (error) {
      await t.rollback()
      return res
        .status(400)
        .send({
          message:
            'Imagen no válida. Debe ser JPG, PNG o GIF y tener al menos 500px de ancho.'
        })
    }

    const imagenPath = await guardarImagen(file)
    const fechaInicio = convertirFecha(req.body.fechaInicioSorteo)
    const fechaFin = convertirFecha(req.body.fechaFinSorteo)

    // Validar fechas y rango de números
    validarFechas(fechaInicio, fechaFin)
    validarRangoNumeros(req.body.rangoNumeros)

    // Crear el sorteo en la base de datos
    await crearSorteoEnBD(
      {
        nombreSorteo: req.body.nombreSorteo,
        ulrImagenSorteo: imagenPath,
        rangoNumeros: req.body.rangoNumeros,
        fechaInicioSorteo: fechaInicio,
        fechaFinSorteo: fechaFin
      },
      t
    )

    await t.commit()
    res
      .status(200)
      .send({ message: 'Sorteo creado y archivo guardado con éxito.' })
  } catch (error) {
    await t.rollback()
    console.error(error)
    res.status(400).send({ message: error.message })
  }
}

// Consultar todos los sorteos en la base de datos
const consultarSorteos = async (req, res) => {
  verificarToken(req) // Verificar el token antes de consultar los sorteos
  // Consultar los sorteos si el token es válido
  try {
    const sorteos = await Sorteo.findAll() // Obtener los sorteos desde la base de datos
    res.status(200).send(sorteos)
  } catch (error) {
    console.error('Error al consultar los sorteos:', error)
    res.status(500).send({ message: 'Error al consultar los sorteos.' })
  }
}

function verificarToken (req) {
  // Extraer el token del encabezado 'Authorization'
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1] // Token en formato Bearer <token>
  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id // Extraer el userId del token decodificado

    console.log('Token verificado para el usuario:', userId)
  } catch (error) {
    return error
  }
}

export default { crearSorteo, consultarSorteos }
