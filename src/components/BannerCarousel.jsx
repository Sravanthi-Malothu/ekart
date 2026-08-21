import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const banners = [
  {
    id: 1,
    title: "Big Billion Shopping Spree",
    subtitle: "Up to 80% OFF on Top Electronics, Fashion & Mobiles",
    badge: "SPECIAL DEAL OF THE DAY",
    buttonText: "Shop The Sale",
    link: "/products",
    bgGradient: "from-blue-700 via-indigo-700 to-blue-900",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Next-Gen Laptops & Tablets",
    subtitle: "Special Range ₹70,000 to ₹1,00,000 + Instant Bank Discount",
    badge: "FLIPKART ASSURED",
    buttonText: "Explore Laptops",
    link: "/products?category=Laptops",
    bgGradient: "from-sky-700 via-blue-800 to-indigo-950",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Latest 5G Smartphones",
    subtitle: "No Cost EMI Available | Exchange Offer Up to ₹15,000",
    badge: "BEST PRICES GUARANTEED",
    buttonText: "View Mobiles",
    link: "/products?category=Mobiles",
    bgGradient: "from-amber-600 via-orange-600 to-red-700",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
  },
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden shadow-md bg-gray-900 group">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative min-h-[220px] md:min-h-[300px]">
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-90 z-10`} />
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="relative z-20 max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col justify-center h-full text-white">
              <span className="inline-block bg-[#ffe500] text-blue-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider w-max mb-2">
                {banner.badge}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold mb-2 tracking-tight drop-shadow-md">
                {banner.title}
              </h2>
              <p className="text-sm md:text-lg font-medium mb-6 text-blue-100 max-w-xl">
                {banner.subtitle}
              </p>
              <Link to={banner.link}>
                <button className="bg-[#ffe500] hover:bg-yellow-400 text-blue-900 font-bold px-6 py-2.5 rounded shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm md:text-base">
                  {banner.buttonText} →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-r-lg shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-l-lg shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentSlide === idx ? 'w-6 bg-[#ffe500]' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
