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

export { createProductTable };
