import pool from "../database/index.js";
import Joi from "joi";

const productSchema = Joi.object({
    product_name: Joi.string().min(1).max(255).required().messages({
        "string.empty": "El nombre del producto no puede estar vacío.",
        "any.required": "El nombre del producto es obligatorio.",
        "string.max": "El nombre del producto no puede superar los 255 caracteres."
    }),
    expiration_date: Joi.date().required().messages({
        "any.required": "La fecha de expiración es obligatoria.",
        "date.base": "La fecha de expiración debe ser válida."
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "any.required": "La cantidad es obligatoria.",
        "number.base": "La cantidad debe ser un número.",
        "number.min": "La cantidad debe ser al menos 1."
    })
});

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
  const { error } = productSchema.validate(req.body);
  if (error) {
      return res.status(400).json({ error: error.details[0].message });
  }

  const { product_name, expiration_date, quantity } = req.body;

  try {
      const newProduct = await pool.query(
          `INSERT INTO stock (product_name, expiration_date, quantity) VALUES ($1, $2, $3) RETURNING *`,
          [product_name, expiration_date, quantity]
      );
      res.status(201).json({
          message: "Producto creado correctamente.",
          product: newProduct.rows[0],
      });
  } catch (error) {
      console.error("Error al insertar producto:", error.message);
      res.status(500).json({ error: "Error al insertar producto." });
  }
};

////////////////////////////////
// GET all products
const getAllProducts = async (req, res) => {
    try {
      const query = `
        SELECT * FROM stock ORDER BY created_at DESC;
      `;
  
      const result = await pool.query(query);
  
      res.status(200).json({
        message: "Lista de productos obtenida exitosamente.",
        products: result.rows,
      });
    } catch (error) {
      console.error("Error al obtener los productos:", error.message);
      res.status(500).json({ error: "Error al obtener los productos." });
    }
  };

////////////////////////////////
// Edit a product
const editProduct = async (req, res) => {
    const { id } = req.params; // ID del producto a editar
    const { product_name, expiration_date, quantity } = req.body;
  
    if (!id || !product_name || !quantity) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
  
    try {
      const query = `
        UPDATE stock
        SET 
          product_name = $1,
          expiration_date = $2,
          quantity = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
      `;
  
      const values = [product_name, expiration_date || null, quantity, id];
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Producto no encontrado." });
      }
  
      res.status(200).json({
        message: "Producto actualizado exitosamente.",
        product: result.rows[0],
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      res.status(500).json({ error: "Error al actualizar el producto." });
    }
  };

////////////////////////////////
// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: "ID del producto es requerido." });
    }
  
    try {
      const query = `
        DELETE FROM stock
        WHERE id = $1
        RETURNING *;
      `;
  
      const result = await pool.query(query, [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Producto no encontrado." });
      }
  
      res.status(200).json({
        message: "Producto eliminado exitosamente.",
        product: result.rows[0],
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      res.status(500).json({ error: "Error al eliminar el producto." });
    }
  };

////////////////////////////////
// Get product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: "ID del producto es requerido." });
    }
  
    try {
      const query = `
        SELECT * FROM stock
        WHERE id = $1;
      `;
  
      const result = await pool.query(query, [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Producto no encontrado." });
      }
  
      res.status(200).json({
        message: "Producto encontrado exitosamente.",
        product: result.rows[0],
      });
    } catch (error) {
      console.error("Error al obtener el producto:", error.message);
      res.status(500).json({ error: "Error al obtener el producto." });
    }
  };

export {
    createProductTable,
    createProduct,
    getAllProducts,
    editProduct,
    deleteProduct,
    getProductById
};
