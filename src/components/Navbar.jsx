import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, ChevronDown, Sparkles, LogOut, Package, Store } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import axios from 'axios';
import { toast } from 'sonner';

const categoryNavItems = [
  { name: 'Mobiles', category: 'Mobiles', icon: '📱' },
  { name: 'Laptops', category: 'Laptops', icon: '💻' },
  { name: 'Bags', category: 'Bags', icon: '🎒' },
  { name: 'Perfumes', category: 'Perfumes', icon: '✨' },
  { name: 'Shirts', category: 'Shirts', icon: '👔' },
  { name: 'Shoes', category: 'Shoes', icon: '👟' },
  { name: 'T-Shirts', category: 'T-Shirts', icon: '👕' },
  { name: 'TVs', category: 'TVs', icon: '📺' },
  { name: 'Watches', category: 'Watches', icon: '⌚' },
  { name: 'Electronics', category: 'Electronics', icon: '🎧' },
  { name: 'Home', category: 'Home & Furniture', icon: '🛋️' },
];

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist || { items: [] });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      try {
        const { data } = await axios.get('/api/v1/products');
        const filtered = data.filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase()) ||
            p.brand.toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 6));
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSearchResult = (productId) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/products/${productId}`);
  };

  const logoutHandler = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await axios.post(
        '/api/v1/user/logout',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data?.success) {
        toast.success(res.data.message || 'Logged out');
      }
    } catch {
      // Ignore token expiry errors on logout
    } finally {
      localStorage.removeItem('accessToken');
      dispatch(setUser(null));
      setShowUserDropdown(false);
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md font-sans">
      {/* Primary Flipkart Blue Header */}
      <div className="bg-[#2874f0] text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Plus Badge */}
          <Link to="/" className="flex flex-col items-start leading-none group flex-shrink-0">
            <span className="text-2xl font-extrabold italic tracking-tight text-white flex items-center">
              Ekart<span className="text-[#ffe500] not-italic text-sm ml-0.5">.in</span>
            </span>
            <span className="text-[11px] font-semibold italic text-gray-200 flex items-center gap-0.5 hover:underline cursor-pointer">
              Explore <span className="text-[#ffe500] font-bold">Plus</span>
              <Sparkles className="w-3 h-3 text-[#ffe500] fill-[#ffe500]" />
            </span>
          </Link>

          {/* Flipkart Search Bar */}
          <div className="relative flex-1 max-w-2xl" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 1 && setShowSearchDropdown(true)}
                className="w-full bg-white text-gray-800 text-sm px-4 py-2 rounded-l-sm focus:outline-none placeholder-gray-500 shadow-inner"
              />
              <button
                type="submit"
                className="bg-white text-[#2874f0] px-4 py-2 rounded-r-sm hover:bg-gray-100 cursor-pointer flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Live Search Auto-complete Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white text-gray-800 shadow-2xl rounded-b-md border border-gray-200 mt-0.5 z-50 max-h-80 overflow-y-auto">
                <div className="p-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
                  Matching Products
                </div>
                {searchResults.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectSearchResult(item._id)}
                    className="flex items-center gap-3 p-2.5 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  >
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand} • <span className="text-emerald-600 font-medium">₹{item.price?.toLocaleString('en-IN')}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-6">
            
            {/* Login / Profile Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  className="flex items-center gap-1.5 font-bold text-sm bg-white text-[#2874f0] px-4 py-1.5 rounded-sm hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[100px]">{user.firstName || 'My Account'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="font-bold text-sm bg-white text-[#2874f0] px-7 py-1.5 rounded-sm hover:bg-[#ffe500] hover:text-blue-900 transition-all cursor-pointer shadow-sm inline-block"
                >
                  Login
                </Link>
              )}

              {/* User Dropdown Menu */}
              {user && showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 shadow-xl rounded-md border border-gray-100 z-50 py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold truncate text-[#2874f0]">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/profile?tab=orders"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
                  >
                    <Package className="w-4 h-4" />
                    Orders
                  </Link>
                  <Link
                    to="/profile?tab=wishlist"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
                  >
                    <Heart className="w-4 h-4 text-pink-500" />
                    Wishlist ({wishlistItems.length})
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Become a Seller Link */}
            <Link
              to="/products"
              className="hidden lg:flex items-center gap-1.5 text-sm font-bold hover:text-[#ffe500] transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/profile?tab=wishlist"
              className="relative flex items-center gap-1.5 font-bold text-sm hover:text-[#ffe500] transition-colors"
            >
              <Heart className="w-5 h-5 fill-current text-white hover:text-[#ffe500]" />
              <span className="hidden md:inline">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ffe500] text-blue-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 font-bold text-sm hover:text-[#ffe500] transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="bg-[#ffe500] text-blue-900 font-extrabold text-xs px-1.5 py-0.5 rounded-full shadow ml-0.5">
                  {cartItems.length}
                </span>
              )}
            </Link>

          </div>

        </div>
      </div>

      {/* Secondary Flipkart Category Ribbon */}
      <div className="bg-white border-b border-gray-200 shadow-sm overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 py-2.5">
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-700 hover:text-[#2874f0] whitespace-nowrap transition-colors"
          >
            <span>🔥</span>
            <span>All Categories</span>
          </Link>
          {categoryNavItems.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.category)}`}
              className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-[#2874f0] hover:font-bold whitespace-nowrap transition-colors"
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
