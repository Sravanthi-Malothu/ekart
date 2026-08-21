import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/redux/wishlistSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Heart, Star, SlidersHorizontal, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API_URL = '/api/v1';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const searchQueryParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist || { items: [] });

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/products`);
        setProducts(data);
        setLoading(false);
        setError('');
      } catch (err) {
        console.error('Fetch products error:', err);
        setLoading(false);
        setError(err.response?.data?.message || 'Failed to load products.');
      }
    };
    fetchProducts();
  }, []);

  const defaultCategoriesList = ['Bags', 'Electronics', 'Home & Furniture', 'Laptops', 'Mobiles', 'Perfumes', 'Shirts', 'Shoes', 'T-Shirts', 'TVs', 'Watches'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/categories`);
        if (Array.isArray(data) && data.length > 0) {
          // Merge defaults with API categories
          const combined = Array.from(new Set([...defaultCategoriesList, ...data])).sort();
          setCategories(combined);
        } else {
          setCategories(defaultCategoriesList);
        }
      } catch (err) {
        console.error('Fetch categories error:', err);
        setCategories(defaultCategoriesList);
      }
    };
    fetchCategories();
  }, []);

  let filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (product.price > maxPrice) return false;
    if (product.rating < minRating) return false;
    if (searchQueryParam) {
      const q = searchQueryParam.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchBrand) return false;
    }
    return true;
  });

  // Sorting Logic
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
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

  const resetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(150000);
    setMinRating(0);
    setSortBy('relevance');
    setSearchParams({});
  };

  return (
    <div className="bg-[#f1f2f6] min-h-screen font-sans">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Search query notice header */}
          {searchQueryParam && (
            <div className="bg-white p-3 mb-4 rounded border border-gray-200 shadow-sm flex justify-between items-center text-sm">
              <span>
                Showing results for <strong className="text-[#2874f0]">"{searchQueryParam}"</strong>
              </span>
              <button
                onClick={() => setSearchParams({})}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Left Filter Sidebar */}
            <div className="lg:col-span-1 bg-white p-4 rounded shadow-sm border border-gray-200 h-fit space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-extrabold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <SlidersHorizontal className="w-4 h-4 text-[#2874f0]" /> Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#2874f0] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Category</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'All'}
                      onChange={() => {
                        setSelectedCategory('All');
                        setSearchParams(searchQueryParam ? { search: searchQueryParam } : {});
                      }}
                      className="accent-[#2874f0]"
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => {
                          setSelectedCategory(cat);
                          setSearchParams(searchQueryParam ? { category: cat, search: searchQueryParam } : { category: cat });
                        }}
                        className="accent-[#2874f0]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div className="border-t pt-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
                  Max Price: <span className="text-[#2874f0]">₹{maxPrice.toLocaleString('en-IN')}</span>
                </h4>
                <input
                  type="range"
                  min="500"
                  max="150000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#2874f0] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-500 font-bold mt-1">
                  <span>₹500</span>
                  <span>₹1.5 Lakh</span>
                </div>
              </div>



              {/* Rating Filter */}
              <div className="border-t pt-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Customer Ratings</h4>
                <div className="space-y-1.5">
                  {[4, 3, 2].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === stars}
                        onChange={() => setMinRating(stars)}
                        className="accent-[#2874f0]"
                      />
                      <span className="flex items-center gap-1 font-medium">
                        {stars}★ & above
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="accent-[#2874f0]"
                    />
                    <span>All Ratings</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Product Grid */}
            <div className="lg:col-span-3 space-y-4">

              {/* Sort Bar */}
              <div className="bg-white p-3 rounded shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-gray-700">
                <div>
                  Showing <span className="text-[#2874f0]">{filteredProducts.length}</span> Products
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-normal">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-2 py-1 bg-gray-50 font-bold focus:outline-none text-xs"
                  >
                    <option value="relevance">Popularity</option>
                    <option value="price-low">Price -- Low to High</option>
                    <option value="price-high">Price -- High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Product Cards Grid */}
              {loading ? (
                <div className="bg-white p-12 rounded text-center text-gray-500 font-medium">Loading Products...</div>
              ) : error ? (
                <div className="bg-white p-8 rounded text-center text-red-600">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white p-12 rounded text-center space-y-3">
                  <p className="text-lg font-bold text-gray-700">No products match your active filters.</p>
                  <Button onClick={resetFilters} className="bg-[#2874f0] text-white font-bold text-xs">
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => {
                    const isWishlisted = wishlistItems.some((item) => item._id === product._id);
                    const originalPrice = Math.round(product.price * 1.3);

                    return (
                      <div
                        key={product._id}
                        className="group bg-white rounded border border-gray-200 hover:border-[#2874f0] hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden p-3"
                      >
                        {/* Flipkart Assured Badge */}
                        <span className="absolute top-3 left-3 z-10 bg-[#2874f0] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                          Assured
                        </span>

                        {/* Wishlist Heart Button */}
                        <button
                          onClick={() => handleToggleWishlist(product)}
                          className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors cursor-pointer"
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-pink-600 fill-pink-600' : 'text-gray-400'}`} />
                        </button>

                        <Link to={`/products/${product._id}`} className="block">
                          <div className="h-48 flex items-center justify-center bg-gray-50 rounded p-2 mb-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'; }}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link to={`/products/${product._id}`}>
                              <h3 className="text-xs font-bold text-gray-800 line-clamp-2 hover:text-[#2874f0] mb-1">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-[11px] text-gray-400 mb-2">{product.brand} • {product.category}</p>

                            {/* Green Star Rating */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                {product.rating} <Star className="w-2.5 h-2.5 fill-white" />
                              </span>
                              <span className="text-[11px] text-gray-400 font-medium">({product.numReviews})</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-lg font-extrabold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</span>
                              <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                              <span className="text-xs font-bold text-emerald-600">23% off</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Link to={`/products/${product._id}`}>
                              <Button variant="outline" className="w-full text-xs h-8 border-gray-300 font-bold hover:bg-gray-100 cursor-pointer">
                                View
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-[#ffe500] hover:bg-yellow-400 text-blue-900 font-bold text-xs h-8 cursor-pointer shadow-sm"
                              disabled={product.countInStock === 0}
                            >
                              {product.countInStock > 0 ? 'Add to Cart' : 'Out'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
