import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

const Navbar = () => {
  const { user } = useSelector(state => state.user);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler=async()=>{
    try{
            const accessToken = localStorage.getItem('accessToken')
            const res=await axios.post('/api/v1/user/logout',{},
            {
              headers:{
                Authorization:`Bearer ${accessToken}`
              }
            })
            if(res.data.success){
              localStorage.removeItem('accessToken')
              dispatch(setUser(null));
              toast.success(res.data.message)
              navigate('/');
            }
    }catch(error){
        console.log(error)
    }

  }
  return (
    <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>

        {/*brand section */}

        <div>
          <span className='text-xl font-bold text-pink-600'>Ekart</span>
        </div>
        <nav className='flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <li><Link to={'/'}>Home</Link></li>
            <li><Link to={'/products'}>Products</Link></li>
            <li><Link to={'/cart'}>Cart</Link></li>
            {
              user && <li><Link to={'/profile'} className='flex items-center gap-1'>
                <User className='h-5 w-5'/>
                {user.email}
              </Link></li>
            }

          </ul>
          <li className='relative flex items-center gap-1 list-none'>
            {
            user ? <Button className='bg-pink-600 text-white cursor-pointer ml-4' onClick={logoutHandler}>Logout </Button>:
             <Link to='/login' className='ml-4'><Button className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'>Login</Button></Link>
            }
            <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2'>
              {items.length}
            </span>
          </li>
        </nav>
      </div>

    </header>
  )
 }

export default Navbar
