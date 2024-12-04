import {
  obtenerNumerosOcupadosService,
  obtenerNumerosAgrupadosService,
  reservarNumerosService,
  liberarNumerosService
} from '../services/numeros.js'

/**
 * Obtener los números ocupados
 */
export const obtenerNumerosRifa = async (req, res) => {
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
 * Crear o reservar números de rifa
 */
export const crearNumeroRifa = async (req, res) => {
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
export const liberarNumerosManualmente = async (req, res) => {
  try {
    const resultado = await liberarNumerosService(req.body)
    res.status(200).json(resultado)
  } catch (error) {
    console.error('Error al liberar números:', error)
    res.status(500).json({ mensaje: 'Error al liberar números.' })
  }
}

export default { obtenerNumerosRifa, crearNumeroRifa, liberarNumerosManualmente }
