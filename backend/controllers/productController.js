import { Product } from '../models/productModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.sort());
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const categoryMap = {
  phone: 'Mobiles', bag: 'Bags', shoe: 'Shoes', tshirt: 'T-Shirts',
  watch: 'Watches', shirt: 'Shirts', tv: 'TVs', perfume: 'Perfumes',
  laptap: 'Laptops', laptab: 'Laptops'
};

const getCategoryFromFilename = (filename) => {
  const base = filename.split('.')[0];
  const key = base.replace(/[0-9]+/g, '').toLowerCase();
  return categoryMap[key] || 'Others';
};

export const seedProducts = async (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    const files = fs.readdirSync(uploadsPath).filter((f) => /\.(avif|webp|jpg|jpeg|png)$/i.test(f));

    const productsToInsert = files.map((filename) => {
      const category = getCategoryFromFilename(filename);
      const price = Math.floor(Math.random() * 900) + 10;
      return {
        name: `${category} - ${filename.split('.')[0]}`,
        image: `http://localhost:8000/api/v1/uploads/${filename}`,
        description: `High-quality ${category.toLowerCase()} product with premium build quality and modern design.`,
        brand: 'Ekart Premium',
        category,
        price,
        countInStock: Math.floor(Math.random() * 50) + 1,
        rating: Number((Math.random() * 2 + 3).toFixed(1)),
        numReviews: Math.floor(Math.random() * 100),
      };
    });

    await Product.deleteMany();
    const createdProducts = await Product.insertMany(productsToInsert);
    res.status(201).json({ message: 'Products seeded successfully', products: createdProducts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
