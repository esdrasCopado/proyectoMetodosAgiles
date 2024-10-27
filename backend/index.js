import express from 'express';
import v1UserRoutes from './v1/routes/userRoutes.js';
import path from 'path';  // Cambié 'pat' a 'path'

const app = express();

app.use("/api/v1/users", v1UserRoutes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

