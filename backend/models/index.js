import sequelize from '../config/database.js'
import NumeroRifa from './numeroRifa.js'
import Comprobante from './Comprobante.js'
import Usuario from './Usuario.js'
import Sorteo from './sorteos.js'

// Definir las relaciones
Comprobante.hasMany(NumeroRifa, { foreignKey: 'comprobanteId' })
NumeroRifa.belongsTo(Comprobante, { foreignKey: 'comprobanteId' })

// Exportar los modelos y la instancia de Sequelize
const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  NumeroRifa,
  Comprobante,
  Usuario,
  Sorteo
}

export default db
