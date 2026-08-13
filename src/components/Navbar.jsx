import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';

const Navbar = () => {
  const { user } = useSelector(state => state.user);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await axios.post('/api/v1/user/logout', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.data.success) {
        localStorage.removeItem('accessToken');
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem('accessToken');
      dispatch(setUser(null));
    }
  };

  return (
    <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-4'>
        {/* Brand section */}
        <Link to='/' className='flex items-center gap-2'>
          <span className='text-2xl font-bold text-pink-600'>Ekart</span>
        </Link>
        <nav className='flex gap-8 items-center'>
          <ul className='flex gap-6 items-center text-lg font-semibold text-gray-700'>
            <li><Link to={'/'} className='hover:text-pink-600 transition-colors'>Home</Link></li>
            <li><Link to={'/products'} className='hover:text-pink-600 transition-colors'>Products</Link></li>
            <li>
              <Link to={'/cart'} className='relative flex items-center gap-1.5 hover:text-pink-600 transition-colors'>
                <ShoppingCart className='h-5 w-5' />
                <span>Cart</span>
                {items.length > 0 && (
                  <span className='bg-pink-500 rounded-full text-white text-xs px-2 py-0.5 font-bold ml-0.5'>
                    {items.length}
                  </span>
                )}
              </Link>
            </li>
            {user && (
              <li>
                <Link to={'/profile'} className='flex items-center gap-1.5 hover:text-pink-600 transition-colors'>
                  <User className='h-5 w-5' />
                  <span>{user.firstName ? `${user.firstName}` : user.email}</span>
                </Link>
              </li>
            )}
          </ul>
          <div className='flex items-center gap-2'>
            {user ? (
              <Button className='bg-pink-600 hover:bg-pink-700 text-white cursor-pointer ml-2' onClick={logoutHandler}>
                Logout
              </Button>
            ) : (
              <Link to='/login' className='ml-2'>
                <Button className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'>
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
