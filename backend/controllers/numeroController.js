import numeroRifa from '../models/numeroRifa.js'
import sequelize from '../config/database.js'

const crearNumeroRifa = (req, res) => {

}

const obtenerNumerosRifa = async (req, res) => {
  res.send('hola')
}

export default { crearNumeroRifa, obtenerNumerosRifa }
