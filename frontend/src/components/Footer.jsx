import React from "react";
import { Link } from "react-router-dom";
import ekartLogo from "../pages/ekart.png";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">
        {/* Info */}
        <div className="mb-6 md:mb-0">
          <Link to="/">
            <img src={ekartLogo} alt="Ekart Logo" className="w-32" />
          </Link>

          <p className="mt-2 text-sm">
            Powering Your World with the Best in Electronics.
          </p>

          <p className="mt-2 text-sm">
            123 Electronics St, Style City, NY 10001
          </p>

          <p className="text-sm">
            Email: support@zaptro.com
          </p>

          <p className="text-sm">
            Phone: (123) 456-7890
          </p>
        </div>

        {/* Customer Service Links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">
            Customer Service
          </h3>

          <ul className="mt-2 text-sm space-y-2">
            <li>Contact Us</li>
            <li>Shipping & Returns</li>
            <li>FAQs</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">
            Follow Us
          </h3>

          <div className="flex space-x-4 mt-4 text-2xl">
            <FaFacebook className="hover:text-blue-500 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaTwitterSquare className="hover:text-sky-500 cursor-pointer" />
            <FaPinterest className="hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
