const url_registro = '/api/v1/users/registrarUsuario'
async function registrarUsuario(nombre, email, contrasena) {
    console.log(nombre, email, contrasena);
    try {
        const response = await fetch(hostUrl+url_registro, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                email,
                contrasena // No es necesario repetir 'contrasena: contrasena', se puede usar solo 'contrasena'
            })
        });

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Ocurrió un error desconocido'}`);
        }

        // Procesar la respuesta si es exitosa
        const data = await response.json();
        
        // Si la respuesta indica éxito, llama a registroExitoso
        appInstance.registroExitoso();
        
        // Redirigir a otra página después de un retardo de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html'; // Cambia esto por la URL a la que deseas redirigir
        }, 3000);

    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        // Puedes mostrar un mensaje al usuario aquí si lo deseas
        appInstance.open4(); // Mostrar mensaje de error en el UI
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


