import nodemailer from 'nodemailer'
import dotenv from 'dotenv' // Para cargar variables de entorno
dotenv.config()

// Crear una instancia de transporte de correo
export default async function enviarEmail (email, numerosReservados) {
  // Configurar transporte
  const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio que uses
    auth: {
      user: process.env.EMAIL_USER, // Usa la variable de entorno para el correo
      pass: process.env.EMAIL_PASS // Usa la variable de entorno para la contraseña
    }
  })

  // Crear el contenido HTML del correo
  const mensajeHTML = `
      <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación de Sorteo</title>
    <style>
      body {
        background-color: #f1f1f1;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
      .container {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      }
      .img-container img {
        width: 100%;
        height: auto;
      }
      h1 {
        text-align: center;
        color: #333;
      }
      h4 {
        text-align: center;
        color: #555;
      }
      p {
        margin-top: 20px;
        font-size: 16px;
        color: #555;
        line-height: 1.5;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #888;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="container">
        <div class="content">
          <h1>Notificación: "Nombre del Sorteo"</h1>
          <h4>
            El sorteo "Nombre del Sorteo" ha finalizado, los números apartados son: ${numerosReservados}
          </h4>
          <p>
            hola ${email} Por este medio se le informa que sus números apartados ya vencieron. Si desea seguir participando, puede volver a seleccionar otros números.
          </p>
        </div>
      </div>
      <div class="footer">
        <p>Gracias por participar en nuestros sorteos. Si tiene alguna duda, no dude en contactarnos.</p>
      </div>
    </main>
  </body>
  </html>
  
    `
  // Enviar correo
  try {
    await transporter.sendMail({
      from: '"Sistema de Rifas" <tu-correo@gmail.com>',
      to: email,
      subject: 'Números Reservados Expirados',
      html: mensajeHTML // Enviar HTML en lugar de texto plano
    })
    console.log(`Correo enviado a: ${email}`)
  } catch (error) {
    console.error('Error al enviar el correo:', error)
  }
}
