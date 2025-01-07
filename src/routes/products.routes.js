import express from 'express';
import { createProductTable, createProduct, getAllProducts } from '../controllers/products.controllers.js';
import { seedProducts } from '../controllers/seed.controller.js';

const router = express.Router();

router.post('/create-prod-table', createProductTable);

router.post("/create", createProduct);

router.get("/all-products", getAllProducts);


////////////////////////////////////////////////////////////////
// SEED data
router.post('/seed', seedProducts);

export default router;