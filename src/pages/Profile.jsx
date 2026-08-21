import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { removeFromWishlist } from '@/redux/wishlistSlice';
import { addToCart } from '@/redux/cartSlice';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Package, Heart, MapPin, Camera, Trash2, Pencil, CheckCircle2, ShoppingCart } from 'lucide-react';

const API_URL = '/api/v1';

const sampleOrders = [
  {
    id: 'OD839210481029',
    date: '20 Aug 2026',
    status: 'Delivered',
    name: 'Wireless Noise-Canceling Headphones',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'OD839210481030',
    date: '15 Aug 2026',
    status: 'Delivered',
    name: 'RGB Ergonomic Mechanical Gaming Keyboard',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80',
  },
];

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'profile';

  const { user } = useSelector((state) => state.user);
  const { items: wishlistItems } = useSelector((state) => state.wishlist || { items: [] });
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const { data } = await axios.get(`${API_URL}/user/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (data.success) {
            setFormData({
              firstName: data.user.firstName || '',
              lastName: data.user.lastName || '',
              email: data.user.email || '',
            });
            setProfilePic(data.user.profilePic || '');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { data } = await axios.put(
        `${API_URL}/user/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (data.success) {
        toast.success('Profile updated successfully');
        dispatch(setUser(data.user));
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('profilePic', file);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { data } = await axios.post(`${API_URL}/user/uploadProfilePic`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.success) {
        toast.success('Profile picture updated');
        setProfilePic(data.user.profilePic);
        dispatch(setUser(data.user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleAddToCartFromWishlist = (product) => {
    dispatch(addToCart(product));
    toast.success(`Added ${product.name} to Cart`);
  };

  return (
    <div className="bg-[#f1f2f6] min-h-screen font-sans">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Left User Navigation Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* User Avatar Card */}
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 flex items-center justify-center text-[#2874f0] font-black text-xl border">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    formData.firstName?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-semibold">Hello,</p>
                  <h3 className="text-sm font-extrabold text-gray-800 truncate">
                    {formData.firstName ? `${formData.firstName} ${formData.lastName}` : 'Ekart User'}
                  </h3>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white rounded shadow-sm border border-gray-200 divide-y divide-gray-100 font-bold text-xs">
                
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setSearchParams({ tab: 'profile' });
                  }}
                  className={`w-full text-left p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeTab === 'profile' ? 'bg-blue-50 text-[#2874f0] border-l-4 border-[#2874f0]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" /> Personal Information
                </button>

                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setSearchParams({ tab: 'orders' });
                  }}
                  className={`w-full text-left p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeTab === 'orders' ? 'bg-blue-50 text-[#2874f0] border-l-4 border-[#2874f0]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-4 h-4" /> My Orders
                </button>

                <button
                  onClick={() => {
                    setActiveTab('wishlist');
                    setSearchParams({ tab: 'wishlist' });
                  }}
                  className={`w-full text-left p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeTab === 'wishlist' ? 'bg-blue-50 text-[#2874f0] border-l-4 border-[#2874f0]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-4 h-4 text-pink-500" /> My Wishlist ({wishlistItems.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('addresses');
                    setSearchParams({ tab: 'addresses' });
                  }}
                  className={`w-full text-left p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeTab === 'addresses' ? 'bg-blue-50 text-[#2874f0] border-l-4 border-[#2874f0]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-4 h-4" /> Saved Addresses
                </button>
              </div>

            </div>

            {/* Right Tab Content */}
            <div className="lg:col-span-3">

              {/* TAB 1: PROFILE DETAILS */}
              {activeTab === 'profile' && (
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing((prev) => !prev)}
                      className="text-xs border-[#2874f0] text-[#2874f0] hover:bg-blue-50 cursor-pointer font-bold"
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>

                  <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-xs font-bold text-gray-700">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="text-xs mt-1 bg-gray-50 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-xs font-bold text-gray-700">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="text-xs mt-1 bg-gray-50 disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="text-xs mt-1 bg-gray-50 disabled:bg-gray-100"
                      />
                    </div>

                    {isEditing && (
                      <Button type="submit" disabled={loading} className="bg-[#2874f0] text-white font-bold text-xs uppercase px-6">
                        {loading ? 'Saving...' : 'Save Profile'}
                      </Button>
                    )}
                  </form>

                  <div className="border-t pt-4">
                    <Label htmlFor="profilePicUpload" className="text-xs font-bold text-gray-700 block mb-2">
                      Profile Avatar Picture
                    </Label>
                    <label
                      htmlFor="profilePicUpload"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#2874f0] bg-blue-50 border border-blue-200 px-4 py-2 rounded hover:bg-blue-100 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Upload New Photo
                      <input id="profilePicUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: MY ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 space-y-4">
                  <h2 className="text-lg font-bold text-gray-800 border-b pb-3">My Orders History</h2>
                  
                  <div className="space-y-3">
                    {sampleOrders.map((order) => (
                      <div key={order.id} className="border rounded p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-[#2874f0] transition-all bg-gray-50/50">
                        <div className="flex gap-3 items-center">
                          <img src={order.image} alt={order.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'; }} className="w-16 h-16 object-contain bg-white p-1 rounded border" />
                          <div>
                            <span className="text-[11px] font-mono text-gray-400">Order #{order.id}</span>
                            <h4 className="text-xs font-bold text-gray-800">{order.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Ordered on {order.date}</p>
                          </div>
                        </div>

                        <div className="text-right sm:text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end">
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {order.status}
                          </span>
                          <span className="text-sm font-extrabold text-gray-900 mt-1">₹{order.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: WISHLIST */}
              {activeTab === 'wishlist' && (
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 space-y-4">
                  <h2 className="text-lg font-bold text-gray-800 border-b pb-3">My Saved Wishlist ({wishlistItems.length})</h2>

                  {wishlistItems.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 space-y-3">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                      <p className="text-sm font-bold">Your Wishlist is Empty!</p>
                      <p className="text-xs text-gray-400">Explore products and tap the heart icon to save them for later.</p>
                      <Link to="/products">
                        <Button className="bg-[#2874f0] text-white font-bold text-xs uppercase px-6">Explore Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item._id} className="border rounded p-3 bg-gray-50/50 flex flex-col justify-between relative group hover:border-[#2874f0] transition-all">
                          <button
                            onClick={() => dispatch(removeFromWishlist(item._id))}
                            className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <Link to={`/products/${item._id}`}>
                            <div className="h-36 bg-white p-2 rounded flex items-center justify-center mb-2">
                              <img src={item.image} alt={item.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'; }} className="max-h-full max-w-full object-contain" />
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 truncate hover:text-[#2874f0]">{item.name}</h4>
                          </Link>

                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-sm font-extrabold text-gray-900">₹{item.price?.toLocaleString('en-IN')}</span>
                            <Button
                              onClick={() => handleAddToCartFromWishlist(item)}
                              className="bg-[#ffe500] hover:bg-yellow-400 text-blue-900 font-bold text-xs h-7 px-3 cursor-pointer"
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" /> Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SAVED ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-bold text-gray-800">Saved Delivery Addresses</h2>
                    <Button className="bg-[#2874f0] text-white font-bold text-xs uppercase">+ Add New Address</Button>
                  </div>

                  <div className="border rounded p-4 bg-gray-50/50 space-y-2 text-xs text-gray-700">
                    <span className="bg-blue-100 text-[#2874f0] font-bold text-[10px] px-2 py-0.5 rounded uppercase">Default Home</span>
                    <h4 className="font-extrabold text-gray-800 text-sm">{formData.firstName} {formData.lastName}</h4>
                    <p>Flat 402, Highrise Apartments, Outer Ring Road, Bellandur</p>
                    <p>Bengaluru, Karnataka - 560103</p>
                    <p className="font-bold text-gray-900">Phone: 9876543210</p>
                  </div>
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

export default Profile;
