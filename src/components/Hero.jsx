import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import heroImg from './frontpage.jpeg'

const Hero = () => {
    return (
        <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='grid md:grid-cols-2 gap-8 items-center'>
                    <div>
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>Latest Electronics and all other products at Best Prices</h1>
                        <p className='text-xl mb-6 text-blue-100'>Discover cutting-edge unbeatable deals on laptops and more..</p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Link to='/products'><Button className='bg-white text-blue-600 hover:bg-gray-100 cursor-pointer font-semibold'>Shop Now</Button></Link>
                            <Link to='/products'><Button className='bg-white text-blue-600 hover:bg-gray-100 cursor-pointer font-semibold'>View Details</Button></Link>
                        </div>
                    </div>
                    <div className='relative'>
                        <img src={heroImg} alt="" width={500} height={400} className='rounded-lg shadow-2xl' />
                    </div>
                </div>

            </div>

        </section>
    )
}

export default Hero
