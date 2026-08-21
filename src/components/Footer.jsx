import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#172337] text-gray-300 text-xs py-10 font-sans border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 pb-8 border-b border-gray-700">
        
        {/* ABOUT */}
        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-xs">About</h3>
          <ul className="space-y-2">
            <li><Link to="/products" className="hover:underline hover:text-white">Contact Us</Link></li>
            <li><Link to="/products" className="hover:underline hover:text-white">About Us</Link></li>
            <li><Link to="/products" className="hover:underline hover:text-white">Careers</Link></li>
            <li><Link to="/products" className="hover:underline hover:text-white">Ekart Stories</Link></li>
            <li><Link to="/products" className="hover:underline hover:text-white">Press & News</Link></li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-xs">Help</h3>
          <ul className="space-y-2">
            <li><Link to="/cart" className="hover:underline hover:text-white">Payments</Link></li>
            <li><Link to="/products" className="hover:underline hover:text-white">Shipping</Link></li>
            <li><Link to="/profile?tab=orders" className="hover:underline hover:text-white">Cancellation & Returns</Link></li>
            <li><Link to="/products" className="hover:underline hover:text-white">FAQ</Link></li>
            <li><Link to="/products" className="hover:underline hover:text-white">Report Infringement</Link></li>
          </ul>
        </div>

        {/* POLICY */}
        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-xs">Policy</h3>
          <ul className="space-y-2">
            <li><span className="hover:underline hover:text-white cursor-pointer">Return Policy</span></li>
            <li><span className="hover:underline hover:text-white cursor-pointer">Terms Of Use</span></li>
            <li><span className="hover:underline hover:text-white cursor-pointer">Security</span></li>
            <li><span className="hover:underline hover:text-white cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:underline hover:text-white cursor-pointer">Sitemap</span></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-xs">Social</h3>
          <ul className="space-y-2">
            <li><span className="hover:underline hover:text-white cursor-pointer">Facebook</span></li>
            <li><span className="hover:underline hover:text-white cursor-pointer">Twitter / X</span></li>
            <li><span className="hover:underline hover:text-white cursor-pointer">YouTube</span></li>
            <li><span className="hover:underline hover:text-white cursor-pointer">Instagram</span></li>
          </ul>
        </div>

        {/* REGISTERED OFFICE */}
        <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
          <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-xs">Registered Office</h3>
          <p className="text-gray-400 leading-relaxed">
            Ekart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India
          </p>
        </div>

      </div>

      {/* Bottom Footer Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-1.5"><span className="text-[#ffe500]">💼</span> Become a Seller</span>
          <span className="flex items-center gap-1.5"><span className="text-[#ffe500]">⭐</span> Advertise</span>
          <span className="flex items-center gap-1.5"><span className="text-[#ffe500]">🎁</span> Gift Cards</span>
          <span className="flex items-center gap-1.5"><span className="text-[#ffe500]">❓</span> Help Center</span>
        </div>
        <div>
          © 2026 Ekart.in. All Rights Reserved. Flipkart Clone Demo.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
