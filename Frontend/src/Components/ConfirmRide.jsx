import React from 'react'

const ConfirmRide = (props) => {
  return (
    <div className='z-50'>
        <h5 className='p-1 text-center absolute top-0 text-gray-300 w-[90%] text-4xl'
        onClick={()=>{
          props.setConfirmRidePanel(false)
        }}
        ><i className="ri-arrow-down-wide-line"></i> </h5>
        <h3 className='text-2xl font-bold p-5'>confirm your vehicle</h3>
        <div className='flex flex-col gap-2 justify-between items-center'>
            <img className='h-30' src="https://mobile-content.uber.com/launch-experience/ride.png" alt="" />
            <div className='w-full'>
                <div className='flex items-center gap-5 m-2 p-2 border-b-2'>
                <i className="ri-map-pin-user-fill text-xl"></i>
                <div>
                    <h3 className='text-lg font-medium'>427/12A</h3>
                    <div className='text-sm text-gray-500'>krishnapur,navsari </div>
                </div>
                </div>
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
              <button
                  onClick={() => {
            props.setVehicleFound(true)
            props.setConfirmRidePanel(false)
                  }}
                  className='w-full mt-5 bg-green-700 text-white font-semibold rounded-lg p-2 text-lg'>Confirm</button>
        </div>
    </div>
  )
}

export default ConfirmRide