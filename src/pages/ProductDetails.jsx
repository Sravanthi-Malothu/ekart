import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ArrowLeft, Plus, Minus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API_URL = '/api/v1';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct(data);
        
        // Fetch related products in same category
        if (data && data.category) {
          try {
            const { data: categoryData } = await axios.get(`${API_URL}/products?category=${data.category}`);
            setRelatedProducts(categoryData.filter((p) => p._id !== id).slice(0, 4));
          } catch {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-28 min-h-screen bg-gray-50 flex justify-center items-center">
          <p className="text-xl text-gray-600">Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="pt-28 min-h-screen bg-gray-50 pb-12">
          <div className="max-w-7xl mx-auto px-4 text-center py-16">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested product could not be located.'}</p>
            <Link to="/products">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const originalPrice = Math.round(product.price * 1.25);

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gray-50 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-pink-600">Products</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
          </div>

          {/* Product Detail Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              
              {/* Product Image */}
              <div className="bg-gray-100 rounded-xl overflow-hidden h-[380px] md:h-[480px] relative group flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-pink-50 text-pink-700 font-semibold text-xs px-2.5 py-1 rounded-md border border-pink-200">
                      {product.brand}
                    </span>
                    {product.countInStock > 0 ? (
                      <span className="bg-emerald-50 text-emerald-700 font-semibold text-xs px-2.5 py-1 rounded-md border border-emerald-200">
                        In Stock ({product.countInStock} available)
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 font-semibold text-xs px-2.5 py-1 rounded-md border border-rose-200">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-sm font-bold border border-amber-200">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                      {product.rating}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      ({product.numReviews} Verified Reviews)
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-3 mb-6 bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                    <span className="text-3xl font-bold text-pink-600">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                      20% OFF
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Highlights / Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-xs text-gray-600 border-y border-gray-100 py-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span>Free Express Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-blue-600" />
                      <span>7 Days Replacement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      <span>1 Year Warranty</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Quantity */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 font-bold text-gray-800 text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.countInStock || 10, q + 1))}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                        disabled={quantity >= (product.countInStock || 10)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.countInStock === 0}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold h-12 text-base rounded-xl cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      disabled={product.countInStock === 0}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-12 text-base rounded-xl cursor-pointer"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Similar Products</h2>
                <Link to="/products" className="text-pink-600 font-semibold text-sm hover:underline">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => (
                  <div key={rel._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <Link to={`/products/${rel._id}`}>
                      <div className="h-44 bg-gray-100 overflow-hidden">
                        <img src={rel.image} alt={rel.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/products/${rel._id}`}>
                        <h4 className="font-semibold text-gray-800 truncate hover:text-pink-600 transition-colors mb-1">{rel.name}</h4>
                      </Link>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-pink-600">₹{rel.price?.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-500">{rel.rating} ★</span>
                      </div>
                      <Link to={`/products/${rel._id}`}>
                        <Button variant="outline" className="w-full text-xs h-9 border-gray-300">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
