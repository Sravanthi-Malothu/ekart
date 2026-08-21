import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/redux/wishlistSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw, ArrowLeft, Plus, Minus, Tag, MapPin, Zap } from 'lucide-react';
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
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const { items: wishlistItems } = useSelector((state) => state.wishlist || { items: [] });

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct(data);

        if (data && data.category) {
          try {
            const { data: categoryData } = await axios.get(`${API_URL}/products?category=${data.category}`);
            setRelatedProducts(categoryData.filter((p) => p._id !== id).slice(0, 4));
          } catch {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error('Fetch product details error:', err);
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const isWishlisted = product ? wishlistItems.some((item) => item._id === product._id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info(`Removed ${product.name} from Wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`Added ${product.name} to Wishlist!`);
    }
  };

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

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus(`Available! Fast delivery to ${pincode} by tomorrow 5 PM.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Pincode.');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f1f2f6] min-h-screen">
        <Navbar />
        <div className="pt-28 pb-12 text-center font-bold text-gray-500">Loading Product Details...</div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#f1f2f6] min-h-screen">
        <Navbar />
        <div className="pt-28 pb-12 max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-red-600">Product Not Found</h2>
          <p className="text-sm text-gray-600">{error || 'The requested product could not be located.'}</p>
          <Link to="/products">
            <Button className="bg-[#2874f0] text-white font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const originalPrice = Math.round(product.price * 1.3);

  return (
    <div className="bg-[#f1f2f6] min-h-screen font-sans">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#2874f0]">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#2874f0]">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#2874f0]">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-800 font-bold truncate max-w-xs">{product.name}</span>
          </div>

          {/* Product Detail Card */}
          <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Image Gallery & Action Buttons */}
              <div className="md:col-span-5 space-y-4">
                <div className="border border-gray-200 rounded p-6 bg-gray-50 h-[380px] flex items-center justify-center relative group">
                  {/* Flipkart Assured Badge */}
                  <span className="absolute top-3 left-3 bg-[#2874f0] text-white text-xs font-black px-2.5 py-1 rounded shadow">
                    Ekart Assured
                  </span>

                  {/* Wishlist Heart */}
                  <button
                    onClick={handleToggleWishlist}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'text-pink-600 fill-pink-600' : 'text-gray-400'}`} />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'; }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.countInStock === 0}
                    className="bg-[#ffe500] hover:bg-yellow-400 text-blue-900 font-bold h-12 text-sm uppercase rounded cursor-pointer shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={product.countInStock === 0}
                    className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold h-12 text-sm uppercase rounded cursor-pointer shadow-md"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-current" /> Buy Now
                  </Button>
                </div>
              </div>

              {/* Right Column: Info & Offers */}
              <div className="md:col-span-7 space-y-6">
                
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{product.brand}</span>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 leading-snug">
                    {product.name}
                  </h1>

                  {/* Star Rating Badge */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      {product.rating} <Star className="w-3 h-3 fill-white" />
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {product.numReviews} Ratings & Verified Reviews
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-blue-50/60 p-4 rounded border border-blue-100 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-sm font-bold text-emerald-600">23% off</span>
                  <span className="text-xs font-bold text-[#2874f0] bg-white px-2 py-0.5 rounded border border-blue-200 ml-auto">
                    Special Price
                  </span>
                </div>

                {/* Available Bank Offers */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Available Offers</h3>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <p className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>Bank Offer:</strong> 10% Instant Discount on HDFC Credit & Debit Cards.</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>Special Price:</strong> Get extra ₹1,200 off (price inclusive of cashback).</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>No Cost EMI:</strong> Available starting at ₹349/month.</span>
                    </p>
                  </div>
                </div>

                {/* Pincode Delivery Estimator */}
                <div className="border-t pt-4 space-y-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2874f0]" /> Delivery Pincode Check
                  </h3>
                  <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="Enter 6-digit Pincode"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="border text-xs px-3 py-2 rounded focus:outline-none focus:border-[#2874f0] flex-1 bg-gray-50"
                    />
                    <button type="submit" className="bg-[#2874f0] text-white text-xs font-bold px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                      Check
                    </button>
                  </form>
                  {pincodeStatus && (
                    <p className={`text-xs font-bold mt-1 ${pincodeStatus.includes('Available') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {pincodeStatus}
                    </p>
                  )}
                </div>

                {/* Quantity & Services Highlights */}
                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-700">Quantity:</span>
                    <div className="flex items-center border rounded bg-gray-50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 text-xs font-bold"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 text-xs font-extrabold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.countInStock || 10, q + 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 text-xs font-bold"
                        disabled={quantity >= (product.countInStock || 10)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-emerald-600 font-bold">
                      {product.countInStock > 0 ? `In Stock (${product.countInStock} items remaining)` : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#2874f0]" />
                      <span>Free Express Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-[#2874f0]" />
                      <span>7 Days Replacement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
                      <span>1 Year Brand Warranty</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t pt-4">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Product Description</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
                </div>

              </div>

            </div>
          </div>

          {/* Similar Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => (
                  <div key={rel._id} className="border border-gray-100 rounded p-3 hover:border-[#2874f0] transition-all bg-gray-50/50">
                    <Link to={`/products/${rel._id}`}>
                      <div className="h-36 bg-white p-2 rounded flex items-center justify-center mb-2">
                        <img src={rel.image} alt={rel.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 truncate hover:text-[#2874f0]">{rel.name}</h4>
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-extrabold text-gray-900">₹{rel.price?.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded">{rel.rating} ★</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
