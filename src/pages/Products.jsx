import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API_URL = '/api/v1';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products`);
        setProducts(data);
        setLoading(false);
        setError('');

        if (data.length === 0) {
          try {
            await axios.post(`${API_URL}/products/seed`);
            const { data: seeded } = await axios.get(`${API_URL}/products`);
            setProducts(seeded);
          } catch (seedError) {
            console.error('Auto-seed failed:', seedError);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        const errMsg = error.response?.data?.message || error.message || 'Failed to connect to backend server.';
        setError(errMsg);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/categories`);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
  };

  const handleManualSeed = async () => {
    setSeeding(true);
    setError('');
    try {
      await axios.post(`${API_URL}/products/seed`);
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
      toast.success('Products seeded!');
    } catch (error) {
      toast.error('Failed to seed products');
      const errMsg = error.response?.data?.message || error.message || 'Failed to connect to backend server.';
      setError(errMsg);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('All')}
              className={selectedCategory === 'All' ? 'bg-blue-600 text-white' : ''}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-blue-600 text-white' : ''}
              >
                {category}
              </Button>
            ))}
          </div>

          {error ? (
            <div className="text-center mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-xl text-red-600 mb-2">Unable to load products</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleManualSeed} disabled={seeding} className="bg-blue-600 hover:bg-blue-700 text-white">
                {seeding ? 'Seeding...' : 'Retry & Load Products'}
              </Button>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center mt-12">
              <p className="text-xl text-gray-600 mb-4">No products found in this category.</p>
              <Button onClick={handleManualSeed} disabled={seeding} className="bg-blue-600 hover:bg-blue-700 text-white">
                {seeding ? 'Seeding...' : 'Load Sample Products'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-pink-600">${product.price}</span>
                      <span className="text-sm text-gray-500">{product.rating} ★ ({product.numReviews})</span>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={product.countInStock === 0}
                    >
                      {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
