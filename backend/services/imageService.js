// imageService.js

import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

export async function verificarImagen (file) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Tipo de imagen no válido.')
  }

  const metadata = await sharp(file.tempFilePath).metadata()
  if (metadata.width < 500) {
    throw new Error('La imagen debe tener al menos 500px de ancho.')
  }
}

export async function guardarImagen (file) {
  const uploadDir = path.join('uploads')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, file.name)
  await file.mv(filePath)
  return filePath
}
