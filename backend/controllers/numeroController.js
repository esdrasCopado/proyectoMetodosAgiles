import numeroRifa from '../models/numeroRifa.js'
import sequelize from '../config/database.js'
import { Op } from 'sequelize'

// Obtener los números disponibles para mostrarlos en el frontend
const obtenerNumerosRifa = async (req, res) => {
  try {
    // Buscar números que están disponibles (no reservados o reserva expirada)
    const numerosDisponibles = await numeroRifa.findAll({
      where: {
        [Op.or]: [
          { reservadoHasta: null }, // Nunca reservados
          { reservadoHasta: { [Op.lt]: new Date() } } // Reserva expirada
        ]
      },
      attributes: ['numero'] // Solo devolver el número
    })
    res.status(200).json(numerosDisponibles)
  } catch (error) {
    console.error('Error al obtener los números disponibles:', error)
    res.status(500).json({ mensaje: 'Error al obtener los números disponibles.' })
  }
}

// Tipo de dato date ajustable
const tiempoDisponible = () => {
  const today = new Date()
  const limite = 5 // Tiempo en minutos para la reserva
  return new Date(today.getTime() + limite * 60000) // Suma 5 minutos al tiempo actual
}

// Crear o reservar números de rifa
const crearNumeroRifa = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { numeros, usuarioId } = req.body
    const reservadoHasta = tiempoDisponible()

    console.log(numeros)
    console.log(usuarioId)
    console.log(reservadoHasta)

    if (!Array.isArray(numeros) || numeros.length === 0) {
      return res.status(400).json({ mensaje: 'Debe seleccionar al menos un número para reservar.' })
    }

    console.log('Comenzando transacción...')

    // Primero, intentamos actualizar los números que ya existen.
    await numeroRifa.update(
      {
        usuarioId,
        reservadoHasta: new Date(reservadoHasta)
      },
      {
        where: {
          numero: numeros
        },
        transaction: t
      }
    )

    // Luego, creamos los números que no existen.
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
          reservadoHasta: new Date(reservadoHasta)
        })),
        { transaction: t }
      )
    }

    console.log('Números actualizados y creados, realizando commit...')
    await t.commit()

    res.status(200).json({ mensaje: 'Números reservados exitosamente.', numerosReservados: numeros })
  } catch (error) {
    await t.rollback()
    console.error('Error al reservar números:', error)
    res.status(500).json({ mensaje: 'Error al reservar números.' })
  }
}

// Liberar números cuya reserva haya expirado
const liberarNumerosExpirados = async () => {
  try {
    const ahora = new Date()

    // Actualizar los números con reservas expiradas
    const [cantidadLiberados] = await numeroRifa.update(
      {
        usuarioId: null,
        reservadoHasta: null
      },
      {
        where: {
          reservadoHasta: { [Op.lte]: ahora } // Liberar los que expiraron
        }
      })
    console.log(`Liberados ${cantidadLiberados} números cuya reserva había expirado.`)
  } catch (error) {
    console.error('Error al liberar números expirados:', error)
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

export default { obtenerNumerosRifa, crearNumeroRifa, liberarNumerosExpirados, liberarNumerosManualmente }
