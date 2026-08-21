import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '@/redux/cartSlice';
import { addToWishlist } from '@/redux/wishlistSlice';
import { Trash2, ShoppingBag, ShieldCheck, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    paymentMethod: 'COD',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = Math.round(subtotal * 0.2); // 20% discount simulation
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const totalAmount = subtotal - discount + deliveryFee;

  const handleDecrement = (item) => {
    dispatch(removeFromCart(item._id));
  };

  const handleMoveToWishlist = (item) => {
    dispatch(addToWishlist(item));
    dispatch(removeFromCart(item._id));
    toast.success(`Moved ${item.name} to Wishlist`);
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.address || !addressForm.pincode) {
      toast.error('Please fill in all required delivery details.');
      return;
    }
    setOrderPlaced(true);
    setTimeout(() => {
      dispatch(clearCart());
      toast.success('Order Placed Successfully! Thank you for shopping on Ekart.');
      setShowCheckoutModal(false);
      setOrderPlaced(false);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#f1f2f6] min-h-screen font-sans">
        <Navbar />
        <div className="pt-28 pb-16 min-h-[70vh] flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded shadow-sm border border-gray-200 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty!</h2>
            <p className="text-xs text-gray-500 mb-6">Explore our wide range of products and add items to your cart.</p>
            <Button
              onClick={() => (window.location.href = '/products')}
              className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs px-6 py-2 rounded uppercase cursor-pointer"
            >
              Shop Now
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f1f2f6] min-h-screen font-sans">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Shopping Cart ({items.length} Items)</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Items List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase flex justify-between">
                  <span>My Cart ({items.length})</span>
                  <span className="text-[#2874f0]">Deliver to: 560103</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const originalPrice = Math.round(item.price * 1.25);

                    return (
                      <div key={item._id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded border p-2 flex items-center justify-center">
                          <img src={item.image} alt={item.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'; }} className="max-h-full max-w-full object-contain" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs md:text-sm font-bold text-gray-800 truncate mb-1">{item.name}</h3>
                          <p className="text-xs text-gray-400 mb-2">Seller: Ekart Retail</p>

                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-base font-extrabold text-gray-900">₹{item.price?.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                            <span className="text-xs font-bold text-emerald-600">20% Off</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className="text-gray-600 hover:text-[#2874f0] flex items-center gap-1 cursor-pointer"
                            >
                              <Heart className="w-3.5 h-3.5" /> Move to Wishlist
                            </button>
                            <button
                              onClick={() => handleDecrement(item)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>

                        {/* Delivery Estimate */}
                        <div className="text-right text-xs text-gray-500 font-medium sm:w-36">
                          Delivery by Tomorrow | <span className="text-emerald-600 font-bold">FREE</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Clear Cart
                  </button>
                  <Button
                    onClick={() => setShowCheckoutModal(true)}
                    className="bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-xs px-8 py-2 uppercase rounded cursor-pointer shadow-md"
                  >
                    Place Order <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Flipkart Assurance Banner */}
              <div className="bg-white p-3 rounded border border-gray-200 flex items-center gap-3 text-xs text-gray-600 font-medium">
                <ShieldCheck className="w-5 h-5 text-[#2874f0] flex-shrink-0" />
                <span>Safe and Secure Payments. Easy returns. 100% Authentic products guaranteed.</span>
              </div>
            </div>

            {/* Right Price Details Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow-sm border border-gray-200 p-4 sticky top-28 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-3">Price Details</h3>

                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>Price ({items.length} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed pt-3 flex justify-between text-sm font-black text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-2.5 rounded border border-emerald-200">
                  You will save ₹{discount.toLocaleString('en-IN')} on this order!
                </div>

                <Button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-xs h-10 uppercase rounded cursor-pointer shadow-md"
                >
                  Place Order
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {orderPlaced ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-xl font-extrabold text-gray-800">Processing Your Order...</h3>
                <p className="text-xs text-gray-500">Please wait while we confirm your Flipkart delivery details.</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrderSubmit} className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-black text-[#2874f0]">Flipkart Delivery Details</h3>
                  <p className="text-xs text-gray-500">Enter your address and payment preference to confirm.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full border text-xs p-2 rounded bg-gray-50 focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full border text-xs p-2 rounded bg-gray-50 focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="560103"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="w-full border text-xs p-2 rounded bg-gray-50 focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">City / District</label>
                    <input
                      type="text"
                      placeholder="Bengaluru"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full border text-xs p-2 rounded bg-gray-50 focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Street Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House No, Street, Flat, Area"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    className="w-full border text-xs p-2 rounded bg-gray-50 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['COD', 'UPI', 'CARD', 'NETBANKING'].map((method) => (
                      <label
                        key={method}
                        className={`p-2 border rounded cursor-pointer font-bold text-center transition-colors ${
                          addressForm.paymentMethod === method
                            ? 'bg-blue-50 border-[#2874f0] text-[#2874f0]'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={addressForm.paymentMethod === method}
                          onChange={(e) => setAddressForm({ ...addressForm, paymentMethod: e.target.value })}
                          className="hidden"
                        />
                        {method === 'COD' ? 'Cash on Delivery' : method}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500">Payable Amount</span>
                    <p className="text-base font-black text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <Button type="submit" className="bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-xs px-6 py-2 uppercase rounded cursor-pointer shadow">
                    Confirm Order
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
