import {
  obtenerNumerosOcupadosService,
  obtenerNumerosAgrupadosService,
  reservarNumerosService,
  liberarNumerosService,
  obtenerDetallesSorteosUsuarioService,
  pagarNumerosService,
  obtenerDetallesSorteoPagadoService
} from '../services/numeros.js'

/**
 * Obtener los números ocupados
 */
const obtenerNumerosRifa = async (req, res) => {
  try {
    const numerosOcupados = await obtenerNumerosOcupadosService()
    obtenerNumerosAgrupadosService()
    res.status(200).json(numerosOcupados)
  } catch (error) {
    console.error('Error al obtener los números ocupados:', error)
    res.status(500).json({ mensaje: 'Error al obtener los números ocupados.' })
  }
}

/**
 * Controlador para devolver detalles de sorteos y números apartados por usuario
 */
const obtenerDetallesSorteosUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.body
    console.log(usuarioId)

    if (!usuarioId) {
      return res.status(400).json({ mensaje: 'El usuarioId es requerido.' })
    }

    const detalles = await obtenerDetallesSorteosUsuarioService(usuarioId)

    if (detalles.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron sorteos para este usuario.' })
    }

    res.status(200).json(detalles)
  } catch (error) {
    res.status(500).json({ mensaje: error.message || 'Error al obtener detalles de sorteos.' })
  }
}

/**
 * Controlador para obtener la lista de los sorteos pagados según el usuario
 */
const obtenerSorteosPagados = async (req, res) => {
  try {
    const { usuarioId } = req.body

    // Validar entrada
    if (!usuarioId) {
      return res.status(400).json({ mensaje: 'Debe proporcionar el ID del usuario.' })
    }

    // Llamar al servicio para obtener los sorteos pagados
    const sorteosPagados = await obtenerDetallesSorteoPagadoService(usuarioId)

    res.status(200).json(sorteosPagados)
  } catch (error) {
    console.error('Error en obtenerSorteosPagados:', error)
    res.status(500).json({ mensaje: error.message || 'Error al obtener la lista de sorteos pagados.' })
  }
}

/**
 * pagar una lista de numeros apartados por el usuario
 * el usuario subira la imagen del comprobante del pago
 * para que despues se cambie el estado de APARTADO a PAGADO
 * y se se creara un registro nuevo de Comprobante en la base de
 * datos y se agregara el id del comprobante al numero rifa en la
 * parte de numero id
 * @param {Array} numerosDelUsuario
 * @param usuarioID
 * @file la imagen
 */
const pagarNumeros = async (req, res) => {
  try {
    let { numeros, usuarioId } = req.body
    const file = req.files?.imagenComprobante
    if (!Array.isArray(numeros)) {
      if (typeof numeros === 'string') {
        // Si es una cadena separada por comas
        numeros = numeros.split(',').map(num => parseInt(num.trim(), 10))
      } else {
        // Si no es un array o cadena, convertir en un array único
        numeros = [numeros]
      }
    }

    // Validación de datos
    if (!numeros || !Array.isArray(numeros) || numeros.length === 0) {
      return res.status(400).json({ mensaje: 'Debe proporcionar una lista de números.' })
    }

    if (!usuarioId) {
      return res.status(400).json({ mensaje: 'Debe proporcionar el ID del usuario.' })
    }

    if (!file) {
      return res.status(400).json({ mensaje: 'Debe subir una imagen del comprobante.' })
    }

    // Llamar al servicio
    const resultado = await pagarNumerosService(file, numeros, usuarioId)
    res.status(200).json(resultado)
  } catch (error) {
    console.error('Error al pagar números:', error)
    res.status(500).json({ mensaje: 'Error al procesar el pago.', error: error.message })
  }
}

/**
 * Crear o reservar números de rifa
 */
const crearNumeroRifa = async (req, res) => {
  try {
    const resultado = await reservarNumerosService(req.body)
    res.status(200).json(resultado)
  } catch (error) {
    console.error('Error al reservar números:', error)
    res.status(500).json({ mensaje: 'Error al reservar números.' })
  }
}

/**
 * Liberar números manualmente por el usuario
 */
const liberarNumerosManualmente = async (req, res) => {
  try {
    const resultado = await liberarNumerosService(req.body)
    res.status(200).json(resultado)
  } catch (error) {
    console.error('Error al liberar números:', error)
    res.status(500).json({ mensaje: 'Error al liberar números.' })
  }
}

export default { obtenerNumerosRifa, crearNumeroRifa, liberarNumerosManualmente, obtenerDetallesSorteosUsuario, pagarNumeros, obtenerSorteosPagados }
