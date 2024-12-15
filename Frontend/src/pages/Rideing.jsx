import React from 'react'
import { Link } from 'react-router-dom'

const Rideing = () => {
  return (
      <div className='h-screen'>
          <Link className='fixed flex h-10 w-10 bg-white items-center justify-center rounded-full text-2xl font-semibold right-2 top-2 m-2' to={'/home'}>
              <i className="ri-home-5-line"></i>
          </Link>
          <div className='h-1/2'>
              <img className='h-full w-full object-cover' src="https://imgs.search.brave.com/dpyAyTY8VcMHt_qOO1NnD7Dn2-vvM3iOMg_4xSkVLLs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzAzLzk4Lzgx/LzM2MF9GXzkwMzk4/ODE4N19IaHpYdWMx/RWVaa3pRbTljQllN/QTJKbWJiUjU2bnlM/Vy5qcGc" alt="" />
          </div>
          <div className="h-1/2 p-4">
            <div className='flex justify-between w-full items-center'>
            <img className='h-20' src="https://mobile-content.uber.com/launch-experience/ride.png" alt="" />
            <div className='text-right'>
              <h2 className='font-bold text-lg'>Tamas Tandel</h2>
              <h4 className='font-bold text-xl'>GJ 21 AB 5174</h4>
              <p className='text-sm text-gray-700'>Maruti suzuki alto</p>
            </div>
          </div>
          <div className='w-full'>
                <div className='flex items-center gap-5 m-2 p-2 border-b-2'>
                <i className="ri-map-pin-2-fill text-xl"></i>
                <div>
                    <h3 className='text-lg font-medium'>427/12A</h3>
                    <div className='text-sm text-gray-500'>krishnapur,navsari </div>
                </div>
                </div>
                <div className='flex items-center gap-5 m-2 p-2'>
                <i className="ri-currency-line text-xl"></i>
                <div>
                    <h3 className='text-lg font-medium'>$193.13</h3>
                    <div className='text-sm text-gray-500'>Cash Cash</div>
                </div>
                </div>
              </div>
              <button className='w-full mt-5 bg-green-700 text-white font-semibold rounded-lg p-2 text-lg'>Make a payment</button>
          </div>
    </div>
  )
}

export default Rideing