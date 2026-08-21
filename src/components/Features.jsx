import React from "react";
import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

const Features = () => {
  return (
    <section className="py-8 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {/* Flipkart Assured */}
          <div className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Award className="h-6 w-6 text-[#2874f0]" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base">Ekart Assured</h3>
            <p className="text-xs text-gray-500 mt-1">100% Original & Verified Products</p>
          </div>

          {/* Free Shipping */}
          <div className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Truck className="h-6 w-6 text-[#2874f0]" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base">Express Delivery</h3>
            <p className="text-xs text-gray-500 mt-1">Fast & Reliable Doorstep Shipping</p>
          </div>

          {/* Easy Returns */}
          <div className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <RotateCcw className="h-6 w-6 text-[#2874f0]" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base">7-Day Replacement</h3>
            <p className="text-xs text-gray-500 mt-1">Hassle-free Instant Returns</p>
          </div>

          {/* Secure Payment */}
          <div className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <ShieldCheck className="h-6 w-6 text-[#2874f0]" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base">Secure Payments</h3>
            <p className="text-xs text-gray-500 mt-1">UPI, Cards, EMI & COD Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;