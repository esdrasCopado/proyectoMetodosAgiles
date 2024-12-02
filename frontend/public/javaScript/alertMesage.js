function ocultarAlerta() {
  document.body.classList.remove('alert-active'); // Quitar la clase que muestra la alerta
  const alertContainer = document.getElementById('alert-container');
  alertContainer.innerHTML = ''; // Limpia el contenido de la alerta
}

function generateAlert(message) {
  return new Promise((resolve) => {
      const alertContainer = document.getElementById('alert-container');

      // Generar el contenido dinámico de la alerta
      alertContainer.innerHTML = `
          <div class="overlay"></div>
          <div class="alertMesage">
              <div class="buttonClose">
                  <button class="close">×</button>
              </div>
              <div class="mesage">
                  <p>${message}</p>
              </div>
          </div>
      `;

      // Referencias a los elementos creados
      const overlay = alertContainer.querySelector('.overlay');
      const closeButton = alertContainer.querySelector('.close');

      // Función para ocultar la alerta y resolver la promesa
      function resolvePromise() {
          ocultarAlerta();
          resolve(); // Resolver la promesa
      }

      // Asignar eventos para cerrar la alerta
      overlay.addEventListener('click', resolvePromise);
      closeButton.addEventListener('click', resolvePromise);

      // Mostrar la alerta
      document.body.classList.add('alert-active');
  });
}


