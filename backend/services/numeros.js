import { Op } from 'sequelize'
import sequelize from '../config/database.js'
import numeroRifa from '../models/numeroRifa.js'
import usuarioModel from '../models/Usuario.js'
import { tiempoDisponible } from './tiempoDisponible.js'
import { verificarImagen, guardarImagen } from '../services/imageService.js'
import Comprobante from '../models/Comprobante.js'
import enviarEmail from './emailNotificacion.js'
import Sorteo from '../models/sorteos.js'
// crea un nuevo registro de comprobante con la imagen del comprobante y se actualiza el estado de los numeros
export const pagarNumerosService = async (file, numeros, usuarioId) => {
  const t = await sequelize.transaction() // Crear transacción
  try {
    // Verificar y guardar la imagen del comprobante
    await verificarImagen(file) // Validar el tipo y dimensiones de la imagen
    const filePath = await guardarImagen(file) // Guardar la imagen y obtener la URL

    // Crear un registro de comprobante en la base de datos
    const comprobanteGuardado = await Comprobante.create(
      {
        url: filePath,
        descripcion: 'Comprobante de pago'
      },
      { transaction: t }
    )

    // Actualizar los números de rifa
    const [updatedRows] = await numeroRifa.update(
      {
        estado: 'PAGADO',
        comprobanteId: comprobanteGuardado.id
      },
      {
        where: {
          numero: numeros,
          usuarioId,
          estado: 'APARTADO' // Asegurarse de que el estado sea APARTADO
        },
        transaction: t
      }
    )

    if (updatedRows === 0) {
      throw new Error('No se encontraron números para actualizar.')
    }

    await t.commit() // Confirmar la transacción
    return {
      mensaje: 'Números pagados exitosamente.',
      comprobanteId: comprobanteGuardado.id,
      urlComprobante: comprobanteGuardado.url
    }
  } catch (error) {
    await t.rollback() // Revertir la transacción en caso de error
    console.error('Error en pagarNumerosService:', error)
    throw new Error('Error al procesar el pago.')
  }
}

/**
 * Obtiene detalles del sorteo pagado, incluyendo:
 * - Nombre del sorteo
 * - Números pagados
 * - Imagen del comprobante
 * @param {number} comprobanteId - ID del comprobante
 * @returns {object} - Detalles del sorteo pagado
 */
export const obtenerDetallesSorteoPagadoService = async (comprobanteId) => {
  try {
    // Obtener los números de rifa asociados al comprobante
    const numeros = await numeroRifa.findAll({
      where: {
        comprobanteId,
        estado: 'PAGADO' // Asegurarse de que el estado sea PAGADO
      },
      include: [
        {
          model: Sorteo,
          as: 'sorteo', // Especificar el alias definido en la relación
          attributes: ['id', 'nombreSorteo', 'ulrImagenSorteo'] // Atributos necesarios
        }
      ]
    })

    if (numeros.length === 0) {
      throw new Error('No se encontraron números pagados para este comprobante.')
    }

    // Obtener el comprobante
    const comprobante = await Comprobante.findByPk(comprobanteId, {
      attributes: ['url'] // Solo necesitamos la URL del comprobante
    })

    if (!comprobante) {
      throw new Error('No se encontró el comprobante.')
    }

    // Extraer información del sorteo
    const sorteo = numeros[0].sorteo // Suponemos que todos los números pertenecen al mismo sorteo
    if (!sorteo) {
      throw new Error('No se encontró información del sorteo.')
    }

    // Obtener los números pagados
    const numerosPagados = numeros.map((numero) => numero.numero)

    return {
      nombreSorteo: sorteo.nombreSorteo,
      numerosPagados,
      urlComprobante: comprobante.url
    }
  } catch (error) {
    console.error('Error en obtenerDetallesSorteoPagadoService:', error)
    throw new Error('Error al obtener los detalles del sorteo pagado.')
  }
}

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
 * Servicio para obtener detalles de los sorteos en los que un usuario ha apartado números
 */
export const obtenerDetallesSorteosUsuarioService = async (usuarioId) => {
  try {
    const sorteos = await Sorteo.findAll({
      include: [
        {
          model: numeroRifa,
          as: 'numeroRifas', // Alias de la relación
          where: {
            usuarioId,
            estado: 'APARTADO' // Solo números apartados
          },
          attributes: ['numero'] // Solo se necesita el número
        }
      ],
      attributes: [
        'id',
        'nombreSorteo',
        'ulrImagenSorteo',
        'costoVoleto',
        'fechaInicioSorteo',
        'fechaFinSorteo'
      ]
    })

    // Formatear los datos para devolverlos en un formato claro
    const resultados = sorteos.map((sorteo) => {
      const numeros = sorteo.numeroRifas.map((n) => n.numero)
      const costoTotal = numeros.length * parseFloat(sorteo.costoVoleto) // Calcular el costo total

      return {
        id: sorteo.id,
        nombreSorteo: sorteo.nombreSorteo,
        ulrImagenSorteo: sorteo.ulrImagenSorteo,
        costoVoleto: parseFloat(sorteo.costoVoleto),
        fechaInicioSorteo: sorteo.fechaInicioSorteo,
        fechaFinSorteo: sorteo.fechaFinSorteo,
        numeros,
        costoTotal // Costo total calculado
      }
    })

    return resultados
  } catch (error) {
    console.error('Error al obtener detalles de sorteos por usuario:', error)
    throw new Error('No se pudo obtener la información de los sorteos.')
  }
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
