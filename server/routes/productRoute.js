import express from 'express';
import { getProducts, getProductById, seedProducts, getCategories } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/seed', seedProducts);
router.get('/:id', getProductById);

export default router;
