import {
  obtenerNumerosOcupadosService,
  obtenerNumerosAgrupadosService,
  reservarNumerosService,
  liberarNumerosService,
  obtenerDetallesSorteosUsuarioService
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

export default { obtenerNumerosRifa, crearNumeroRifa, liberarNumerosManualmente, obtenerDetallesSorteosUsuario }
