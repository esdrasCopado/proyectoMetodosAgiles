import express from 'express';
import v1UserRoutes from './v1/routes/userRoutes.js';
import path from 'path';  // Cambié 'pat' a 'path'

const app = express();

app.use("/api/v1/users", v1UserRoutes);

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(path.resolve(), 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

