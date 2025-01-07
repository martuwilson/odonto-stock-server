import pool from "../database/index.js";
import { v4 as uuidv4 } from "uuid";

export const seedProducts = async () => {

    try {

      const products = [
        {
          id: uuidv4(),
          product_name: "Guantes de látex",
          expiration_date: "2025-01-01",
          quantity: 200,
        },
        {
          id: uuidv4(),
          product_name: "Anestesia local",
          expiration_date: "2024-07-15",
          quantity: 50,
        },
        {
          id: uuidv4(),
          product_name: "Hilos de sutura",
          expiration_date: "2025-09-30",
          quantity: 100,
        },
        {
          id: uuidv4(),
          product_name: "Mascarillas quirúrgicas",
          expiration_date: "2026-03-01",
          quantity: 300,
        },
        {
          id: uuidv4(),
          product_name: "Gel desinfectante",
          expiration_date: "2023-12-15",
          quantity: 20,
        },
        {
          id: uuidv4(),
          product_name: "Esterilizador de instrumentos",
          expiration_date: "2024-11-20",
          quantity: 5,
        },
        {
          id: uuidv4(),
          product_name: "Cemento dental",
          expiration_date: "2024-11-20",
          quantity: 40,
        },
        {
          id: uuidv4(),
          product_name: "Algodón",
          expiration_date: "2024-11-20",
          quantity: 500,
        },
        {
          id: uuidv4(),
          product_name: "Fresas dentales",
          expiration_date: "2027-05-10",
          quantity: 80,
        },
        {
          id: uuidv4(),
          product_name: "Espejos dentales",
          expiration_date: "2024-11-20",
          quantity: 15,
        },
      ];

      for (const product of products) {
        await pool.query(
          `INSERT INTO stock (product_name, expiration_date, quantity) VALUES ($1, $2, $3)`,
          [product.product_name, product.expiration_date, product.quantity]
        );
      }
      console.log("Productos insertados correctamente.");
    } catch (error) {
      console.error("Error al insertar productos:", error.message);
    } finally {
      pool.end();
    }
};
