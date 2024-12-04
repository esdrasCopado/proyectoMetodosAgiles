const url_consultarIDUser = "/api/v1/users/verificarUsuario";


function consultarNumerosOcupadosPorUsuario{
    
}
function generarSorteoPago (sorte){

}


const idUser = async () => {
  const token = localStorage.getItem("token"); // O sessionStorage
  try {
    const response = await fetch(hostUrl + url_consultarIDUser, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Incluye el token JWT en el encabezado
      },
      body: JSON.stringify({ datos: "ejemplo" }),
    });

    const data = await response.json();
    return data.usuarioId; // Devuelve el id del usuario
  } catch (error) {
    console.error(error);
  }
};
