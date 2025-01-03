import jwt from 'jsonwebtoken'

// Middleware de autenticación para proteger las rutasimport jwt from 'jsonwebtoken';

// Middleware de autenticación para proteger las rutas
const verificarToken = (req, res, next) => {
  // Obtener el token del encabezado 'Authorization'
  const token = req.headers.authorization

  // Verificar si el token existe
  if (!token) {
    return res.status(403).json({ mensaje: 'Acceso denegado. No se proporcionó un token.' })
  }

  try {
    // Eliminar el "Bearer " del token, si está presente
    const tokenSinBearer = token.startsWith('Bearer ') ? token.split(' ')[1] : token

    // Verificar el token con la clave secreta
    jwt.verify(tokenSinBearer, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ mensaje: 'Token inválido' })
      }

      // Guardar la información decodificada del token en la solicitud para el uso posterior
      req.user = decoded

      // Llamar a `next()` para pasar al siguiente middleware o ruta
      next()
    })
  } catch (error) {
    return res.status(500).json({ mensaje: 'Hubo un problema con la autenticación del token' })
  }
}

export default verificarToken
