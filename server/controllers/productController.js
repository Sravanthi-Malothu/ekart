import mongoose from 'mongoose';
import { Product } from '../models/productModel.js';

const categoryImagePools = {
  Mobiles: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=800&auto=format&fit=crop&q=80',
  ],
  Laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
  ],
  Bags: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
  ],
  Perfumes: [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
  ],
  Shirts: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
  ],
  Shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
  ],
  'T-Shirts': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
  ],
  TVs: [
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80',
  ],
  Watches: [
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80',
  ],
  Electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  ],
  'Home & Furniture': [
    'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80',
  ],
};

const categoryNamesMap = {
  Mobiles: ['Pro Max 5G', 'Ultra Lite 5G', 'Foldable Dual Screen', 'Compact OLED Phone', 'Speed Turbo 5G', 'Amoled Pro Phone'],
  Laptops: ['Ultra Book Thin & Light', 'Gaming RTX Pro Laptop', 'Student Slim Notebook', 'Convertible 2-in-1', 'Workstation Studio', 'Creator Laptop Pro'],
  Bags: ['Waterproof Laptop Backpack', 'Vintage Leather Messenger', 'Designer Handbag', 'Tactical Duffle Bag', 'Crossbody Sling Bag', 'Canvas Travel Pack'],
  Perfumes: ['Luxury French EDP', 'Ocean Breeze Cologne', 'Rose & Vanilla Floral', 'Velvet Oud Eau De Parfum', 'Citrus Fresh Cologne', 'Midnight Amber Fragrance'],
  Shirts: ['Slim Fit Cotton Casual Shirt', 'Formal Checkered Shirt', 'Linen Blend Summer Shirt', 'Oxford Classic Button Down', 'Denim Casual Shirt', 'Spread Collar Formal Shirt'],
  Shoes: ['Pro Air Cushion Running Shoes', 'Classic Leather Formal Oxfords', 'White Retro Streetwear Sneakers', 'High Top Canvas Sneakers', 'Lightweight Mesh Trainers', 'Italian Leather Loafers'],
  'T-Shirts': ['Oversized Graphic Printed Tee', 'Classic Solid Polo Collar Tee', 'Slim Fit Crew Neck Tee', 'Vintage Heavy Cotton Tee', 'V-Neck Summer Tee', 'Athletic Dry-Fit Sport Tee'],
  TVs: ['Smart 4K Ultra HD Android TV', 'Full HD Smart LED TV', '65 inch QLED 4K Cinema TV', 'Bezel-Less HDR Smart TV', 'Ultra Slim OLED 4K TV', 'Curved Smart Display TV'],
  Watches: ['Luxury Stainless Steel Chronograph', 'Smart Fitness Tracker Watch', 'Classic Leather Analog Watch', 'Digital Tactical Sports Watch', 'Automatic Mechanical Wrist Watch', 'Rose Gold Quartz Watch'],
  Electronics: ['Wireless Noise-Canceling Headphones', 'True Wireless Gaming Earbuds', 'Portable Party Speaker', 'Smart Voice Assistant Hub', 'RGB Mechanical Keyboard', 'Precision Wireless Mouse'],
  'Home & Furniture': ['Modern Ergonomic Mesh Chair', 'Scandinavian Wood Coffee Table', 'Minimalist Floor Lamp', 'Luxury Velvet Cushion Sofa', 'Sheesham Wood Dining Table', 'Modular Storage Cabinet'],
};

const generate30ProductsPerCategory = () => {
  const products = [];
  const categories = Object.keys(categoryImagePools);
  let idCounter = 100;

  categories.forEach((cat) => {
    const images = categoryImagePools[cat];
    const nameTemplates = categoryNamesMap[cat] || ['Product'];

    for (let i = 1; i <= 30; i++) {
      idCounter++;
      const idHex = idCounter.toString().padStart(6, '0');
      const mongoId = `64f100000000000000${idHex}`;
      const img = images[(i - 1) % images.length];
      const template = nameTemplates[(i - 1) % nameTemplates.length];
      const name = `${template} (Model ${i})`;
      let price;
      if (cat === 'Laptops') {
        price = Math.floor(Math.random() * 30000) + 70000; // ₹70,000 to ₹1,00,000
      } else {
        price = Math.floor(Math.random() * 45000) + 599;
      }
      const countInStock = Math.floor(Math.random() * 45) + 5;
      const rating = Number((Math.random() * 0.8 + 4.1).toFixed(1));
      const numReviews = Math.floor(Math.random() * 400) + 40;

      products.push({
        _id: mongoId,
        name,
        image: img,
        description: `Premium high-performance ${cat.toLowerCase()} (${name}) with cutting edge specs, Flipkart Assured warranty, and fast delivery.`,
        brand: `Ekart ${cat.split(' ')[0]}`,
        category: cat,
        price,
        countInStock,
        rating,
        numReviews,
      });
    }
  });

  return products;
};

const DEFAULT_SEED_PRODUCTS = generate30ProductsPerCategory();

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    if (mongoose.connection.readyState >= 1) {
      // Re-seed DB to ensure laptop price range sync
      const outOfRangeLaptop = await Product.findOne({ category: 'Laptops', price: { $lt: 70000 } });
      const totalCount = await Product.countDocuments();
      if (totalCount < 300 || outOfRangeLaptop) {
        console.log("Updating DB seed for laptop price range (₹70,000 - ₹100,000)...");
        await Product.deleteMany({});
        await Product.insertMany(DEFAULT_SEED_PRODUCTS);
      }

      const query = category && category !== 'All' ? { category } : {};
      let products = await Product.find(query);

      if (products.length === 0 && category && category !== 'All') {
        const fallback = DEFAULT_SEED_PRODUCTS.filter((p) => p.category === category);
        if (fallback.length > 0) return res.json(fallback);
      }

      return res.json(products);
    }
  } catch (error) {
    console.warn("DB find failed, serving defaults:", error.message);
  }

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
      if (categories && categories.length >= 8) {
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
      await Product.deleteMany({});
      const createdProducts = await Product.insertMany(DEFAULT_SEED_PRODUCTS);
      return res.status(201).json({ message: 'Products seeded successfully', products: createdProducts });
    }
  } catch (error) {
    console.warn("DB seed error:", error.message);
  }

  return res.status(200).json({ message: 'Default products active (Fallback Mode)', products: DEFAULT_SEED_PRODUCTS });
};
