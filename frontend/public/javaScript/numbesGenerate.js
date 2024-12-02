const url_ConsultarNumerosOcupados = "/api/v1/numeroRifa/numero";
const url_crearNumero = "/api/v1/numeroRifa/numero";
const url_consultarIDUser = "/api/v1/users/verificarUsuario";

function mostrarAlerta() {
  document.body.classList.add("alert-active");
}

function ocultarAlerta() {
  document.body.classList.remove("alert-active");
}

function generateNumbersContainer(sorteo) {
  const alertContainer = document.getElementById("alert-container");
  alertContainer.innerHTML = `
      <div class="alertMesage">
      <div class="buttonClose">
        <button class="close" onclick="ocultarAlerta()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-x">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="container-sorteo">

      <div class="image-container">
        <img src="${hostUrl + "/" + sorteo.ulrImagenSorteo}" alt="${
    sorteo.nombreSorteo
  }">
      </div>
      <div class="mesage">
<div class="container-info">
    <span class="Title-sorteo">${sorteo.nombreSorteo}</span>
    <span class="Subtitle-sorteo">Costo de los boletos: ${sorteo.costoVoleto}</span>
</div>


      <div class="container-numbers" id="containerNumbers">
        <!-- Números generados dinámicamente -->
    </div>

    <div class="btns-container">
      <button id="btnBack">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
        </svg>

      </button>
      <button id="btnNext">
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
      </svg>
    </button>
    </div>
    <div class = "btnSumbit-Container">
      <button class="btn-submit" id="btnSubmit">Enviar Selección</button>
    </div>
    </div>
        `;
  numbers(sorteo);
  mostrarAlerta();
}
async function numbers(sorteo) {
  const containerNumbers = document.getElementById("containerNumbers");
  const btnNext = document.getElementById("btnNext");
  const btnBack = document.getElementById("btnBack");
  const btnSubmit = document.getElementById("btnSubmit");

  const range = sorteo.rangoNumeros;
  const [limiteInferior, limiteSuperior] = range.split("-").map(Number);
  const pageSize = 20; // Cantidad de números por página
  let currentPage = 0; // Página actual

  // Obtener los números ocupados
  const response = await consultarNumerosOcupados(); // Supone que devuelve el array de objetos
  const numerosNoMostrar = response.map((obj) => obj.numero); // Extraer solo los números

  // Función para renderizar los números de la página actual
  const renderNumbers = () => {
    containerNumbers.innerHTML = ""; // Limpiar números actuales
    const start = limiteInferior + currentPage * pageSize;
    const end = Math.min(start + pageSize - 1, limiteSuperior);

    for (let i = start; i <= end; i++) {
      if (!numerosNoMostrar.includes(i)) {
        // Solo agregar números que no estén en numerosNoMostrar
        const div = document.createElement("div");
        div.classList.add("number");
        div.innerHTML = `<span>${i}</span>`;
        containerNumbers.appendChild(div);
      }
    }
  };

  // Funcionalidad de selección
  containerNumbers.addEventListener("click", (e) => {
    const target = e.target.closest(".number");
    if (target) {
      target.classList.toggle("selected"); // Cambiar estado seleccionado
    }
  });

  // Botón "Next" para avanzar
  btnNext.addEventListener("click", () => {
    const maxPage = Math.floor((limiteSuperior - limiteInferior) / pageSize);
    if (currentPage < maxPage) {
      currentPage++;
      renderNumbers();
    }
  });

  // Botón "Back" para retroceder
  btnBack.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      renderNumbers();
    }
  });

  // Botón "Submit" para enviar los números seleccionados
  btnSubmit.addEventListener("click", async () => {
    const selectedNumbers = Array.from(
      document.querySelectorAll(".number.selected span")
    ).map((span) => Number(span.textContent)); // Convertir a números
    console.log("Números seleccionados (como números):", selectedNumbers);

    // Enviar al backend -------------->
    const id_user = await idUser();
    apartarNumeros(selectedNumbers, sorteo, id_user);
  });

  // Renderizar la primera página al inicio
  renderNumbers();
}

/**
 * guarda los numerso seleccionados por el usuario
 */
function apartarNumeros(selectedNumbers, sorteo, id_user) {
  const idSorteo = sorteo.id;
  // Verificar que se pasen los parámetros correctamente
  if (!selectedNumbers || !id_user) {
    console.error("Faltan parámetros necesarios");
    return;
  }

  fetch(hostUrl + url_crearNumero, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      numeros: selectedNumbers,
      usuarioId: id_user, // Este es el id del usuario autenticado
      sorteoId: idSorteo, // Si necesitas usar el idSorteo
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      //se guardo los numeros exitosamente
      if (data.ok) {
        alert("Números apartados con éxito");
        generateNumbersContainer(sorteo);
      } else {
        alert("Error al apartar números: " + data.mensaje); // Agregar mensaje si el backend lo devuelve
      }
    })
    .catch((error) => {
      console.error("Error al enviar los números:", error);
      alert("Ocurrió un error. Intenta nuevamente más tarde.");
    });
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

const consultarNumerosOcupados = async () => {
  try {
    const response = await fetch(hostUrl + url_ConsultarNumerosOcupados, {
      method: "GET",
    });
    const data = await response.json();
    return data; // Devuelve los números ocupados
  } catch (error) {
    console.error("Error al consultar los números ocupados:", error);
    return []; // En caso de error, devuelve un array vacío
  }
};
/**
 * This function generates a set of numbers based on the given sorteo object.
 *
 * @param {Object} numbersSorteo - The sorteo object containing information about the sorteo.
 * @param {string} sorteo.rangoNumeros - The range of numbers sorteo.
 *
 * @returns {void} This function does not return any value.
 */
function generationNumbers(sorteo) {
  // Your implementation here
}
