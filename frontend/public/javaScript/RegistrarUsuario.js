const url_registro = '/api/v1/users/registrarUsuario'
async function registrarUsuario(nombre, email, contrasena) {
    console.log(nombre, email, contrasena);
    try {
        const response = await fetch(hostUrl + url_registro, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, contrasena }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Ocurrió un error desconocido'}`);
        }

        const data = await response.json();

        // Mostrar alerta y esperar a que el usuario la cierre
        await generateAlert('Registro exitoso');

        // Redirigir después de que el usuario cierra la alerta
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
    }
}



// Código de Vue
var Main = {
    methods: {
        open1() {
            this.$message({
                showClose: true,
                message: 'This is a message.'
            });
        },

        open2() {
            this.$message({
                showClose: true,
                message: 'Usuario Registrado',
                type: 'success'
            });
        },

        open3() {
            this.$message({
                showClose: true,
                message: 'Warning, this is a warning message.',
                type: 'warning'
            });
        },

        open4() {
            this.$message({
                showClose: true,
                message: 'Oops, this is an error message.',
                type: 'error'
            });
        },

        registroExitoso() {
            this.open2(); // Llama a open2 para mostrar mensaje de éxito
        }
    }
}

// Crea una instancia de Vue
var appInstance = new Vue(Main);
appInstance.$mount('#app');


