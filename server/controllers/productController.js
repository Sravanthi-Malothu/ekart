import mongoose from 'mongoose';
import { Product } from '../models/productModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_SEED_PRODUCTS = [
  {
    _id: '64f100000000000000000001',
    name: 'Wireless Noise-Canceling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Immersive sound with active noise cancellation and 30-hour battery life.',
    brand: 'Ekart Sound',
    category: 'Electronics',
    price: 1999,
    countInStock: 25,
    rating: 4.8,
    numReviews: 124,
  },
  {
    _id: '64f100000000000000000002',
    name: 'Classic Leather Wrist Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Elegant analogue watch with a genuine leather strap and water resistance.',
    brand: 'Ekart Luxury',
    category: 'Watches',
    price: 1499,
    countInStock: 15,
    rating: 4.6,
    numReviews: 88,
  },
  {
    _id: '64f100000000000000000003',
    name: 'Ergonomic Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'Lightweight, breathable sports shoes designed for maximum comfort and durability.',
    brand: 'Ekart Sport',
    category: 'Shoes',
    price: 2499,
    countInStock: 40,
    rating: 4.7,
    numReviews: 210,
  },
  {
    _id: '64f100000000000000000004',
    name: 'Minimalist Travel Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    description: 'Water-resistant laptop backpack with dedicated compartments and USB charging port.',
    brand: 'Ekart Travel',
    category: 'Bags',
    price: 1299,
    countInStock: 30,
    rating: 4.5,
    numReviews: 95,
  },
  {
    _id: '64f100000000000000000005',
    name: 'Premium Cotton T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    description: '100% organic cotton crew-neck t-shirt with tailored fit.',
    brand: 'Ekart Apparel',
    category: 'T-Shirts',
    price: 499,
    countInStock: 50,
    rating: 4.4,
    numReviews: 67,
  },
  {
    _id: '64f100000000000000000006',
    name: 'Luxury Eau De Parfum',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    description: 'Captivating fragrance with notes of cedarwood, amber, and fresh citrus.',
    brand: 'Ekart Beauty',
    category: 'Perfumes',
    price: 1899,
    countInStock: 20,
    rating: 4.9,
    numReviews: 142,
  }
];

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

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    if (mongoose.connection.readyState >= 1) {
      const query = category && category !== 'All' ? { category } : {};
      let products = await Product.find(query);

      if (products.length === 0 && (!category || category === 'All')) {
        try {
          console.log("No products in DB. Seeding defaults...");
          products = await Product.insertMany(DEFAULT_SEED_PRODUCTS);
        } catch (seedErr) {
          console.error("Auto-seed error:", seedErr.message);
          products = DEFAULT_SEED_PRODUCTS;
        }
      }
      return res.json(products);
    }
  } catch (error) {
    console.warn("DB find failed, serving defaults:", error.message);
  }

  // Fallback to DEFAULT_SEED_PRODUCTS when DB is not connected
  let products = DEFAULT_SEED_PRODUCTS;
  const { category } = req.query;
  if (category && category !== 'All') {
    products = products.filter((p) => p.category === category);
  }
  return res.json(products);
};

export const getCategories = async (req, res) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const categories = await Product.distinct('category');
      if (categories && categories.length > 0) {
        return res.json(categories.sort());
      }
    }
  } catch (error) {
    console.warn("DB getCategories failed, serving defaults:", error.message);
  }

  const defaultCategories = Array.from(new Set(DEFAULT_SEED_PRODUCTS.map((p) => p.category))).sort();
  return res.json(defaultCategories);
};

export const getProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
    }
  } catch (error) {
    console.warn("DB getProductById failed, serving fallback:", error.message);
  }

  const product = DEFAULT_SEED_PRODUCTS.find((p) => p._id === req.params.id) || DEFAULT_SEED_PRODUCTS[0];
  return res.json(product);
};

export const seedProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const uploadsPath = path.join(__dirname, '..', 'uploads');
      let productsToInsert = DEFAULT_SEED_PRODUCTS;

      if (fs.existsSync(uploadsPath)) {
        const files = fs.readdirSync(uploadsPath).filter((f) => /\.(avif|webp|jpg|jpeg|png)$/i.test(f));
        if (files.length > 0) {
          productsToInsert = files.map((filename) => {
            const category = getCategoryFromFilename(filename);
            const price = Math.floor(Math.random() * 4500) + 499;
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
        }
      }

      await Product.deleteMany();
      const createdProducts = await Product.insertMany(productsToInsert);
      return res.status(201).json({ message: 'Products seeded successfully', products: createdProducts });
    }
  } catch (error) {
    console.warn("DB seed error:", error.message);
  }

  return res.status(200).json({ message: 'Default products active (Fallback Mode)', products: DEFAULT_SEED_PRODUCTS });
};
