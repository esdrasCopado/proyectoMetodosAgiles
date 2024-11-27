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
        <img src="${hostUrl + "/" + sorteo.ulrImagenSorteo}" alt="${sorteo.nombreSorteo}">
      </div>
      <div class="mesage">
      <span class="Title-sorteo">Escoge los números de: ${sorteo.nombreSorteo}</span>
      </div>
      <div class="container-input">
        <div class="input-user">
          <div  class="input-user">
            <input id ="buscar-numero"
              required="true"
              type="text"
              name="text"
              autocomplete="off"
              class="input"
            />
            <label class="user-label">Busca un numero</label>
          </div>
        </div>
        </div>
      </div>
      <div class="container-numbers">
      </div>

    </div>
        `;
  mostrarAlerta();
}
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
