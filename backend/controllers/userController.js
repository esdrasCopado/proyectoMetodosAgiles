import Usuario from '../models/Usuario.js'
import sequelize from '../config/database.js' // Asegúrate de que esta ruta es correcta
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const autenticar = async (req, res) => {
  const { email, password } = req.body

  try {
    // Busca el usuario solo por email
    const user = await Usuario.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' })
    }

    // Compara la contraseña ingresada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.contrasena)
    if (!isPasswordValid) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' })
    }
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Aquí puedes poner la información que desees
      process.env.JWT_SECRET, // Usar una clave secreta
      { expiresIn: '1h' } // Expiración del token (1 hora en este caso)
    )

    // Aquí puedes generar y enviar un token de autenticación si lo deseas
    // const token = generarToken(user.id); // Por ejemplo, usando JWT

    res.json({ mensaje: 'Autenticación exitosa', token })
  } catch (error) {
    console.error('Error al autenticar:', error)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

const registrar = async (req, res) => {
  const t = await sequelize.transaction() // Creas la transacción aquí
  try {
    const { nombre, email, contrasena } = req.body

    // Verificar si el correo ya está registrado
    const emailExists = await Usuario.findOne({ where: { email } })
    if (emailExists) {
      return res
        .status(409)
        .json({ mensaje: 'El correo electrónico ya está registrado' })
    }

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es requerido' }) // Detenemos la ejecución
    }
    if (!email) {
      return res.status(400).json({ mensaje: 'El email es requerido' }) // Detenemos la ejecución
    }
    if (!contrasena) {
      return res.status(400).json({ mensaje: 'La contraseña es requerida' }) // Detenemos la ejecución
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10)

    // Crear el usuario con la transacción que has definido
    await Usuario.create(
      { nombre, email, contrasena: hashedPassword }, // Usar "contrasena" en lugar de "hashedPassword"
      { transaction: t }
    )

    await t.commit() // Si todo sale bien, haces el commit de la transacción

    res.status(200).json({ mensaje: 'El usuario se registró exitosamente' })
  } catch (error) {
    await t.rollback() // Si hay un error, haces rollback
    console.error('Error al registrar:', error)

    // Captura de errores de clave duplicada para devolver el código adecuado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(409)
        .json({ mensaje: 'El correo electrónico ya está registrado' })
    }

    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

export default { autenticar, registrar }
