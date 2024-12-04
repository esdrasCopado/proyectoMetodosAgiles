export const tiempoDisponible = () => {
  const today = new Date()
  const limite = 1 // Tiempo en minutos para la reserva
  return new Date(today.getTime() + limite * 60000) // Suma 5 minutos al tiempo actual
}
