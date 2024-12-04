import { Op } from 'sequelize'
import sequelize from '../config/database.js'
import numeroRifa from '../models/numeroRifa.js'
import usuarioModel from '../models/Usuario.js'
import { tiempoDisponible } from './tiempoDisponible.js'
import enviarEmail from './emailNotificacion.js'

/**
 * Obtener los números ocupados
 */
export const obtenerNumerosOcupadosService = async () => {
  return await numeroRifa.findAll({
    where: {
      [Op.and]: [
        { reservadoHasta: { [Op.ne]: null } },
        { reservadoHasta: { [Op.gt]: new Date() } }
      ]
    },
    attributes: ['numero']
  })
}

/**
 * Obtener números agrupados por usuario con reserva vencida
 */
export const obtenerNumerosAgrupadosService = async () => {
  const numerosAgrupados = await numeroRifa.findAll({
    attributes: [
      'usuarioId',
      [sequelize.fn('GROUP_CONCAT', sequelize.col('numero')), 'numeros'],
      [sequelize.literal('MAX(reservadoHasta)'), 'ultimo_reservado_hasta']
    ],
    where: {
      [Op.and]: [
        { reservadoHasta: { [Op.lt]: new Date() } }, // Reserva vencida
        { estado: 'APARTADO' } // Solo números con estado "APARTADO"
      ]
    },
    group: ['usuarioId']
  })

  for (const grupo of numerosAgrupados) {
    const numerosArray = grupo.dataValues.numeros.split(',').map(Number) // Convertir a array de números
    await eliminarNumerosExpiradosService(grupo.dataValues.usuarioId, numerosArray)
  }
}

/**
   * Eliminar números expirados
   */
export const eliminarNumerosExpiradosService = async (usuarioId, numerosArray) => {
  const usuario = await usuarioModel.findByPk(usuarioId, {
    attributes: ['email']
  })

  if (!usuario) {
    console.warn(`Usuario con ID ${usuarioId} no encontrado.`)
    return
  }

  const { email } = usuario

  // Eliminar números con estado APARTADO
  const deletedCount = await numeroRifa.destroy({
    where: {
      numero: { [Op.in]: numerosArray },
      usuarioId,
      estado: 'APARTADO' // Asegurar que solo se eliminen los números con estado "APARTADO"
    }
  })

  if (deletedCount > 0) {
    console.log(`Registros eliminados: ${deletedCount}`)
    await enviarEmail(email, `Los siguientes números expiraron: ${numerosArray.join(', ')}`)
  } else {
    console.warn(`No se encontraron registros para eliminar para usuarioId: ${usuarioId}`)
  }
}

/**
 * Reservar números de rifa
 */
export const reservarNumerosService = async ({ numeros, usuarioId, sorteoId }) => {
  const t = await sequelize.transaction()
  try {
    if (!Array.isArray(numeros) || numeros.length === 0) {
      throw new Error('Debe seleccionar al menos un número para reservar.')
    }

    const numerosExistentes = await numeroRifa.findAll({
      where: { numero: numeros },
      attributes: ['numero'],
      transaction: t
    })

    const numerosExistentesSet = new Set(numerosExistentes.map((n) => n.numero))
    const numerosParaCrear = numeros.filter((n) => !numerosExistentesSet.has(n))

    if (numerosParaCrear.length > 0) {
      await numeroRifa.bulkCreate(
        numerosParaCrear.map((n) => ({
          numero: n,
          usuarioId,
          sorteoId,
          reservadoHasta: new Date(tiempoDisponible())
        })),
        { transaction: t }
      )
    }

    await t.commit()
    return { ok: true, mensaje: 'Números reservados exitosamente.', numerosReservados: numeros }
  } catch (error) {
    await t.rollback()
    throw error
  }
}

/**
 * Liberar números manualmente
 */
export const liberarNumerosService = async ({ numeros, usuarioId }) => {
  const t = await sequelize.transaction()
  try {
    if (!Array.isArray(numeros) || numeros.length === 0) {
      throw new Error('Debe seleccionar al menos un número para liberar.')
    }

    const numerosReservados = await numeroRifa.findAll({
      where: { numero: numeros, usuarioId },
      transaction: t
    })

    if (numerosReservados.length !== numeros.length) {
      const numerosNoReservados = numeros.filter(
        (num) => !numerosReservados.map((n) => n.numero).includes(num)
      )
      throw new Error(`Números no reservados: ${numerosNoReservados.join(', ')}`)
    }

    await numeroRifa.update(
      { usuarioId: null, reservadoHasta: null },
      { where: { numero: numeros }, transaction: t }
    )

    await t.commit()
    return { mensaje: 'Números liberados exitosamente.', numerosLiberados: numeros }
  } catch (error) {
    await t.rollback()
    throw error
  }
}
