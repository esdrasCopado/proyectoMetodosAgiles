import numeroRifa from '../models/numeroRifa.js'
import usuarioModel from '../models/Usuario.js'
import sequelize from '../config/database.js'
import { Op } from 'sequelize'
import enviarEmail from '../services/emailNotificacion.js'

/**
 * Obtener los no disponibles
 * Si el numero existe en la base de datos significa que ya esta ocupado
 * si la fecha
 * @param {*} req null
 * @param {*} res los numeros ocupados
 */
const obtenerNumerosRifa = async (req, res) => {
  try {
    // Buscar números que están ocupados y cuya reserva no haya expirado
    const numerosOcupados = await numeroRifa.findAll({
      where: {
        [Op.and]: [
          { reservadoHasta: { [Op.ne]: null } }, // Reservado
          { reservadoHasta: { [Op.gt]: new Date() } } // Reserva no expirada
        ]
      },
      attributes: ['numero'] // Solo devolver el número
    })
    obtenerNumerosAgrupados()
    res.status(200).json(numerosOcupados)
  } catch (error) {
    console.error('Error al obtener los números ocupados:', error)
    res.status(500).json({ mensaje: 'Error al obtener los números ocupados.' })
  }
}
/**
 * se obtiene los numeros que ya vencieron
 * @param {*} req null
 * @param {*} res lista de los numeros vencidos
 */
async function obtenerNumerosAgrupados () {
  try {
    // Obtener números agrupados por usuario
    const numerosAgrupados = await numeroRifa.findAll({
      attributes: [
        'usuarioId',
        [sequelize.fn('GROUP_CONCAT', sequelize.col('numero')), 'numeros'], // Agrupar números
        [sequelize.literal('MAX(reservadoHasta)'), 'ultimo_reservado_hasta'] // Última fecha de reserva por grupo
      ],
      where: {
        reservadoHasta: { [Op.lt]: new Date() } // Solo números cuya reserva ya expiró
      },
      group: ['usuarioId'] // Agrupar por usuario
    })
    eliminarNumerosExpirados(numerosAgrupados)
  } catch (error) {
    console.error('Error al obtener números vencidos:', error)
  }
}
async function eliminarNumerosExpirados (numerosAgrupados) {
  try {
    for (const grupo of numerosAgrupados) {
      const { usuarioId, numeros } = grupo.dataValues
      const numerosArray = numeros.split(',').map(Number) // Convertir la lista de números a un array

      // Buscar el email del usuario
      const usuario = await usuarioModel.findByPk(usuarioId, {
        attributes: ['email']
      })

      if (!usuario) {
        console.warn(`Usuario con ID ${usuarioId} no encontrado. Números expirados: ${numerosArray}`)
        continue
      }

      const { email } = usuario
      console.log(`Usuario encontrado: ${email}. Eliminando números expirados: ${numerosArray}`)
      console.log(`Buscando números: ${numerosArray} para usuarioId: ${usuarioId}`)

      // Eliminar los números vencidos
      const deletedCount = await numeroRifa.destroy({
        where: {
          numero: {
            [Op.in]: numerosArray
          },
          usuarioId
        },
        logging: console.log // Muestra el query generado
      })

      if (deletedCount > 0) {
        console.log(`Registros eliminados: ${deletedCount}`)
      } else {
        console.warn(`No se encontraron registros para eliminar con los números: ${numerosArray} y usuarioId: ${usuarioId}`)
      }
      // Llamar a enviarEmail con await para esperar su resolución
      await enviarEmail(email, numerosArray.join(','))
    }
  } catch (error) {
    console.error('Error al eliminar números expirados:', error)
  }
}

// Tipo de dato date ajustable
const tiempoDisponible = () => {
  const today = new Date()
  const limite = 1 // Tiempo en minutos para la reserva
  return new Date(today.getTime() + limite * 60000) // Suma 15 minutos al tiempo actual
}

// Crear o reservar números de rifa
const crearNumeroRifa = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { numeros, usuarioId, sorteoId } = req.body
    const reservadoHasta = tiempoDisponible()
    console.log(sorteoId + '------------------------------------------------')

    if (!Array.isArray(numeros) || numeros.length === 0) {
      return res.status(400).json({ mensaje: 'Debe seleccionar al menos un número para reservar.' })
    }

    const numerosExistentes = await numeroRifa.findAll({
      where: {
        numero: numeros
      },
      attributes: ['numero'],
      transaction: t
    })

    const numerosExistentesSet = new Set(numerosExistentes.map(n => n.numero))
    const numerosParaCrear = numeros.filter(n => !numerosExistentesSet.has(n))

    if (numerosParaCrear.length > 0) {
      await numeroRifa.bulkCreate(
        numerosParaCrear.map(n => ({
          numero: n,
          usuarioId,
          sorteoId,
          reservadoHasta: new Date(reservadoHasta)
        })),
        { transaction: t }
      )
    }

    console.log('Números actualizados y creados, realizando commit...')
    await t.commit()

    res.status(200).json({ ok: true, mensaje: 'Números reservados exitosamente.', numerosReservados: numeros })
  } catch (error) {
    await t.rollback()
    console.error('Error al reservar números:', error)
    res.status(500).json({ mensaje: 'Error al reservar números.' })
  }
}

// Liberar números manualmente por el usuario
const liberarNumerosManualmente = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { numeros, usuarioId } = req.body

    if (!Array.isArray(numeros) || numeros.length === 0) {
      return res.status(400).json({ mensaje: 'Debe seleccionar al menos un número para liberar.' })
    }

    // Validar que los números estén reservados por el usuario actual
    const numerosReservados = await numeroRifa.findAll({
      where: {
        numero: numeros,
        usuarioId
      },
      transaction: t
    })

    if (numerosReservados.length !== numeros.length) {
      const numerosNoReservados = numeros.filter(num => !numerosReservados.map(n => n.numero).includes(num))
      return res.status(400).json({
        mensaje: 'Algunos números no están reservados por usted o ya fueron liberados.',
        numerosNoReservados
      })
    }

    // Liberar los números seleccionados
    await numeroRifa.update(
      {
        usuarioId: null,
        reservadoHasta: null
      },
      {
        where: {
          numero: numeros
        },
        transaction: t
      })

    await t.commit()
    res.status(200).json({ mensaje: 'Números liberados exitosamente.', numerosLiberados: numeros })
  } catch (error) {
    await t.rollback()
    res.status(500).json({ mensaje: 'Error al liberar números.' })
  }
}

export default { obtenerNumerosRifa, crearNumeroRifa, liberarNumerosManualmente, obtenerNumerosAgrupados }
