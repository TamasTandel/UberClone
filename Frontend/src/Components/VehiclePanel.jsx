import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div className=''>
        <h5 className='p-1 text-center absolute top-0 text-gray-300 w-[90%] text-4xl'
        onClick={()=>{
          props.setVehiclePanel(false)
        }}
        ><i className="ri-arrow-down-wide-line"></i> </h5>
        <h3 className='text-2xl font-bold p-5'>Choose a vehicle</h3>
        <div 
        onClick={()=>{
          props.setConfirmRidePanel(true)
          props.setVehiclePanel(false)
        }}
        className='flex items-center w-full justify-center border-2 active:border-black rounded-xl p-1 my-2'>
          <img className='h-[80px] w-[80px]' src="https://mobile-content.uber.com/launch-experience/ride.png" alt="" />
          <div className='w-1/2'>
            <h2 className='font-medium text-lg'>Uber Go <span><i className="ri-user-3-fill"></i>4</span></h2>
            <h3 className='font-medium text-base'>2 mins away</h3>
            <p className='font-normal text-xs text-gray-800'>Affordable, compact Rides</p>
          </div>
          <h2 className='text-xl font-semibold'>$123.45</h2>
        </div>
        <div 
        onClick={()=>{
          props.setConfirmRidePanel(true)
          props.setVehiclePanel(false)
        }} 
        className='flex items-center w-full justify-center border-2 active:border-black rounded-xl p-1 my-2'>
          <img className='h-[80px] w-[80px]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1649230978/assets/a2/553a18-2f77-4722-a4ba-f736f4cb405e/original/Uber_Moto_Orange_558x372_pixels_Desktop.png" alt="" />
          <div className='w-1/2'>
            <h2 className='font-medium text-lg'>Uber Moto<span><i className="ri-user-3-fill"></i>1</span></h2>
            <h3 className='font-medium text-base'>3 mins away</h3>
            <p className='font-normal text-xs text-gray-800'>Affordable Uber Moto rides</p>
          </div>
          <h2 className='text-xl font-semibold'>$65.45</h2>
        </div>
        <div 
        onClick={()=>{
          props.setConfirmRidePanel(true)
          props.setVehiclePanel(false)
        }} 
        className='flex items-center w-full justify-center border-2 active:border-black rounded-xl p-1 my-2'>
          <img className='h-[80px] w-[80px]' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_193,w_343/v1597151228/assets/fc/101ff8-81a1-46c3-995a-67b4bbd2f2bf/original/TukTuk.jpg" alt="" />
          <div className='w-1/2'>
            <h2 className='font-medium text-lg'>Uber Moto<span><i className="ri-user-3-fill"></i>3</span></h2>
            <h3 className='font-medium text-base'>2 mins away</h3>
            <p className='font-normal text-xs text-gray-800'>Affordable Uber Auto rides</p>
          </div>
          <h2 className='text-xl font-semibold'>$118.21</h2>
        </div>
    </div>
  )
}

export default VehiclePanel