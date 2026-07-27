import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import { Toaster } from '@/components/ui/sonner'
import Footer from './components/Footer';


const router = createBrowserRouter([
  {
    path:'/',
    element:<><Navbar/><Home/></>,
    errorElement: <NotFound />
  },
{
  path:'/products',
  element:<Products/>
},
{
  path:'/cart',
  element:<Cart/>
},
{
  path:'/profile',
  element:<Profile/>
},
{
  path:'/signup',
  element:<Signup/>
},
{
  path:'/login',
  element:<Login/>
},
{
  path:'/signup',
  element:<Signup/>
},
{
  path:'*',
  element:<NotFound/>
}
])


const App = () => {
  return (
    <>
       <RouterProvider router={router}/>
       <Toaster />
    </>
  );
};

export default App;