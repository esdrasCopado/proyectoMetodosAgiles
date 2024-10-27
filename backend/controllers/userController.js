// userController.js
const autenticar = (req, res) => {
    res.json({
        mensaje: 'Autenticado correctamente',
    });
};
const registrar = (req, res) => {
    res.json({
        mensaje: 'Registro exitoso',
    });
}

export default { autenticar };

