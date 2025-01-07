import pool from "../database/index.js";

////////////////////////////////
//Create product table with PostgreSQL

const createProductTable = async (req, res) => {
    try {
        await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        const query = `
            CREATE TABLE IF NOT EXISTS stock (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                product_name VARCHAR(255) NOT NULL,
                expiration_date DATE NOT NULL,
                quantity INTEGER NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        await pool.query(query); 
        res.status(201).json({ message: "Tabla 'stock' creada o ya existe." });
    } catch (error) {
        console.error("Error al crear la tabla 'stock':", error.message);
        res.status(500).json({ error: "Error al crear la tabla 'stock'." });
    }
};

////////////////////////////////
// Create a product
const createProduct = async (req, res) => {
    const { product_name, expiration_date, quantity } = req.body;

    if(!product_name || !expiration_date || !quantity) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const newProduct = await pool.query(
            `INSERT INTO stock (product_name, expiration_date, quantity) VALUES ($1, $2, $3) RETURNING *`,
            [product_name, expiration_date, quantity]
        );
        res.status(201).json({
            message: "Producto creado correctamente.",
            product: newProduct.rows[0]
        });
        
    } catch (error) {
        console.error("Error al insertar producto:", error.message);
        res.status(500).json({ error: "Error al insertar producto." });
    }
};

export { createProductTable, createProduct };
