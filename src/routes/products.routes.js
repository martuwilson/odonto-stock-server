import express from 'express';
import { createProductTable } from '../controllers/products.controllers.js';

const router = express.Router();

router.post('/create-prod-table', createProductTable);

export default router;