import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '@/redux/userSlice';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import { Toaster } from '@/components/ui/sonner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />
  },
  {
    path: '/products',
    element: <Products />
  },
  {
    path: '/products/:id',
    element: <ProductDetails />
  },
  {
    path: '/cart',
    element: <Cart />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const rehydrateUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await axios.get('/api/v1/user/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            dispatch(setUser(res.data.user));
          }
        } catch {
          localStorage.removeItem('accessToken');
          dispatch(setUser(null));
        }
      }
    };
    rehydrateUser();
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;