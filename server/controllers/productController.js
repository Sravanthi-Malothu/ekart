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

const DEFAULT_SEED_PRODUCTS = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Immersive sound with active noise cancellation and 30-hour battery life.',
    brand: 'Ekart Sound',
    category: 'Electronics',
    price: 199,
    countInStock: 25,
    rating: 4.8,
    numReviews: 124,
  },
  {
    name: 'Classic Leather Wrist Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Elegant analogue watch with a genuine leather strap and water resistance.',
    brand: 'Ekart Luxury',
    category: 'Watches',
    price: 149,
    countInStock: 15,
    rating: 4.6,
    numReviews: 88,
  },
  {
    name: 'Ergonomic Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'Lightweight, breathable sports shoes designed for maximum comfort and durability.',
    brand: 'Ekart Sport',
    category: 'Shoes',
    price: 89,
    countInStock: 40,
    rating: 4.7,
    numReviews: 210,
  },
  {
    name: 'Minimalist Travel Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    description: 'Water-resistant laptop backpack with dedicated compartments and USB charging port.',
    brand: 'Ekart Travel',
    category: 'Bags',
    price: 69,
    countInStock: 30,
    rating: 4.5,
    numReviews: 95,
  },
  {
    name: 'Premium Cotton T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    description: '100% organic cotton crew-neck t-shirt with tailored fit.',
    brand: 'Ekart Apparel',
    category: 'T-Shirts',
    price: 29,
    countInStock: 50,
    rating: 4.4,
    numReviews: 67,
  },
  {
    name: 'Luxury Eau De Parfum',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    description: 'Captivating fragrance with notes of cedarwood, amber, and fresh citrus.',
    brand: 'Ekart Beauty',
    category: 'Perfumes',
    price: 110,
    countInStock: 20,
    rating: 4.9,
    numReviews: 142,
  }
];

export const seedProducts = async (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }

    const files = fs.readdirSync(uploadsPath).filter((f) => /\.(avif|webp|jpg|jpeg|png)$/i.test(f));

    let productsToInsert = [];

    if (files.length > 0) {
      productsToInsert = files.map((filename) => {
        const category = getCategoryFromFilename(filename);
        const price = Math.floor(Math.random() * 900) + 10;
        return {
          name: `${category} - ${filename.split('.')[0]}`,
          image: `/api/v1/uploads/${filename}`,
          description: `High-quality ${category.toLowerCase()} product with premium build quality and modern design.`,
          brand: 'Ekart Premium',
          category,
          price,
          countInStock: Math.floor(Math.random() * 50) + 1,
          rating: Number((Math.random() * 2 + 3).toFixed(1)),
          numReviews: Math.floor(Math.random() * 100),
        };
      });
    } else {
      productsToInsert = DEFAULT_SEED_PRODUCTS;
    }

    await Product.deleteMany();
    const createdProducts = await Product.insertMany(productsToInsert);
    res.status(201).json({ message: 'Products seeded successfully', products: createdProducts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

