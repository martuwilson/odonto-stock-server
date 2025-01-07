import dotenv from 'dotenv';
import express from 'express'; 
import pool from './database/index.js'; // call pool to connect to database
import productsRoutes from './routes/products.routes.js';

const app = express();
dotenv.config();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de gestión de stock de materiales!');
  });
  

app.use('/api/stock', productsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
