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
// tipo de dato date ajustable
const tiempoDisponible = () => {
  const today = new Date()
  const limite = 5 // Tiempo en minutos para la reserva
  return new Date(today.getTime() + limite * 60000) // Suma 5 minutos al tiempo actual
}

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
    // Filtramos los números que no están ya reservados.
    const numerosExistentes = await numeroRifa.findAll({
      where: {
        numero: numeros
      },
      attributes: ['numero'],
      transaction: t
    })

    const numerosExistentesSet = new Set(numerosExistentes.map(n => n.numero))
    const numerosParaCrear = numeros.filter(n => !numerosExistentesSet.has(n))

    // Si hay números que no existen, los creamos.
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

export default { obtenerNumerosRifa, crearNumeroRifa }
