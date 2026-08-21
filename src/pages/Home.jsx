import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/redux/wishlistSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BannerCarousel from '@/components/BannerCarousel';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const API_URL = '/api/v1';

const topCategoryItems = [
  { name: 'Mobiles', category: 'Mobiles', icon: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80' },
  { name: 'Laptops', category: 'Laptops', icon: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80' },
  { name: 'Bags', category: 'Bags', icon: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&auto=format&fit=crop&q=80' },
  { name: 'Perfumes', category: 'Perfumes', icon: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=80' },
  { name: 'Shirts', category: 'Shirts', icon: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=80' },
  { name: 'Shoes', category: 'Shoes', icon: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80' },
  { name: 'T-Shirts', category: 'T-Shirts', icon: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80' },
  { name: 'TVs', category: 'TVs', icon: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=150&auto=format&fit=crop&q=80' },
  { name: 'Watches', category: 'Watches', icon: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=150&auto=format&fit=crop&q=80' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist || { items: [] });

  // Countdown timer for Deals of the Day
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
      setLoading(false);
      setError('');

      if (data.length === 0) {
        try {
          await axios.post(`${API_URL}/products/seed`);
          const { data: seeded } = await axios.get(`${API_URL}/products`);
          setProducts(seeded);
        } catch (seedErr) {
          console.error('Auto-seed failed:', seedErr);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Failed to connect to backend server.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to Cart!`);
  };

  const handleToggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info(`Removed ${product.name} from Wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`Added ${product.name} to Wishlist!`);
    }
  };

  const handleManualSeed = async () => {
    setSeeding(true);
    setError('');
    try {
      await axios.post(`${API_URL}/products/seed`);
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
      toast.success('Products seeded!');
    } catch (err) {
      toast.error('Failed to seed products');
      setError(err.response?.data?.message || err.message || 'Failed to connect');
    } finally {
      setSeeding(false);
    }
  };

  const dealsOfTheDay = products.slice(0, 5);
  const electronicsDeals = products.filter((p) => p.category === 'Electronics' || p.category === 'Laptops').slice(0, 4);

  return (
    <div className="bg-[#f1f2f6] min-h-screen font-sans">
      <Navbar />

      {/* Main Container below double header */}
      <div className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 space-y-6">

          {/* Top Category Icon Circles Bar */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200 overflow-x-auto">
            <div className="flex items-center justify-between gap-6 min-w-max">
              {topCategoryItems.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.category)}`}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#2874f0] transition-all p-0.5 bg-gray-100">
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-[#2874f0]">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Promotional Banner Carousel */}
          <BannerCarousel />

          {/* Deals of the Day Section */}
          <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Flipkart Blue Deals Header Bar */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                  Deals of the Day
                  <Sparkles className="w-5 h-5 text-[#ffe500]" />
                </h2>
                <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded text-xs font-mono font-bold text-[#ffe500]">
                  <Clock className="w-4 h-4 text-[#ffe500]" />
                  <span>
                    {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')} Left
                  </span>
                </div>
              </div>
              <Link to="/products" className="bg-white text-[#2874f0] hover:bg-[#ffe500] hover:text-blue-900 font-bold text-xs px-4 py-2 rounded uppercase tracking-wider transition-colors">
                View All Deals →
              </Link>
            </div>

            {/* Deals Grid */}
            {loading ? (
              <div className="p-12 text-center text-gray-500 font-medium">Loading Flipkart Deals...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-600 bg-red-50">
                <p className="font-semibold">{error}</p>
                <Button onClick={handleManualSeed} disabled={seeding} className="mt-3 bg-[#2874f0] text-white">
                  {seeding ? 'Seeding...' : 'Load Demo Products'}
                </Button>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {dealsOfTheDay.map((product) => {
                  const isWishlisted = wishlistItems.some((item) => item._id === product._id);
                  const discountPercent = 25; // 25% discount display
                  const originalPrice = Math.round(product.price * 1.33);

                  return (
                    <div
                      key={product._id}
                      className="group bg-white rounded border border-gray-200 hover:border-[#2874f0] hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Flipkart Assured Badge */}
                      <span className="absolute top-2 left-2 z-10 bg-[#2874f0] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                        Assured
                      </span>

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={() => handleToggleWishlist(product)}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors cursor-pointer"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'text-pink-600 fill-pink-600' : 'text-gray-400'}`} />
                      </button>

                      <Link to={`/products/${product._id}`} className="block">
                        <div className="h-44 p-3 flex items-center justify-center bg-gray-50 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'; }}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <Link to={`/products/${product._id}`}>
                            <h3 className="text-xs font-bold text-gray-800 truncate hover:text-[#2874f0] mb-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] text-gray-500 mb-2">{product.brand}</p>

                          {/* Green Rating Star Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              {product.rating} <Star className="w-2.5 h-2.5 fill-white" />
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">({product.numReviews})</span>
                          </div>

                          {/* Flipkart Price Layout */}
                          <div className="flex items-baseline gap-1.5 mb-3">
                            <span className="text-base font-extrabold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                            <span className="text-xs font-bold text-emerald-600">{discountPercent}% off</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-[#ffe500] hover:bg-yellow-400 text-blue-900 font-bold text-xs h-8 cursor-pointer shadow-sm"
                          disabled={product.countInStock === 0}
                        >
                          {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Electronics & Gadgets Banner Section */}
          <div className="bg-white rounded shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h2 className="text-xl font-black text-gray-800">Best of Electronics & Laptops</h2>
                <p className="text-xs text-gray-500">Top Brands, Lowest Prices of the Season</p>
              </div>
              <Link to="/products?category=Electronics" className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded uppercase cursor-pointer">
                Explore All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {electronicsDeals.map((item) => (
                <div key={item._id} className="border border-gray-100 rounded p-3 hover:border-[#2874f0] transition-all flex gap-3 bg-gray-50/50">
                  <div className="w-24 h-24 flex-shrink-0 bg-white p-2 rounded flex items-center justify-center border border-gray-200">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link to={`/products/${item._id}`}>
                        <h4 className="text-xs font-bold text-gray-800 truncate hover:text-[#2874f0]">{item.name}</h4>
                      </Link>
                      <p className="text-[11px] text-emerald-600 font-bold mt-1">From ₹{item.price?.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.brand}</p>
                    </div>
                    <Link to={`/products/${item._id}`} className="text-xs text-[#2874f0] font-bold hover:underline">
                      Shop Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Features />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
