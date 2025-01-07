import pool from "../database/index.js";

////////////////////////////////
//Create product table with PostgreSQL

const createProductTable = async (req, res) => {
    try {
        const query = `
      CREATE TABLE IF NOT EXISTS stock (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        expiration_date DATE NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query); // Ejecuta el comando SQL
    res.status(201).json({ message: "Tabla 'stock' creada o ya existe." });
    } catch (error) {
        console.error("Error al crear la tabla 'stock':", error.message);
    res.status(500).json({ error: "Error al crear la tabla 'stock'." });
    }
}
////////////////////////////////

export {
    createProductTable
};