import React from 'react'

const RidePopUp = (props) => {
  return (
    <div>
        <h5 className='p-1 text-center absolute top-0 text-gray-300 w-[90%] text-4xl'
        onClick={()=>{
          props.setRidePopUpPanel(false)
        }}
        ><i className="ri-arrow-down-wide-line"></i> </h5>
        <h3 className='text-2xl font-bold p-5'>New Ride Available </h3>
        <div className='flex w-full items-center justify-between bg-yellow-300 rounded-full p-2'>
            <div className='flex items-center justify-start gap-4'>
            <img className='h-10 w-10 object-cover object-center rounded-full' src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6" alt="" />
            <h4 className='text-lg font-bold'>Deep bhooooo</h4>
              </div>
              <h5 className='text-lg font-bold mr-3'>2.5 KM</h5>
        </div>
        <div className='flex flex-col gap-2 justify-between items-center'>
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
            <div className='flex w-full gap-2'>
              <button
                onClick={() => {
                    props.setConfirmRidePopUpPanel(true)
                    props.setRidePopUpPanel(false)
                  }}
                  className='w-full mt-5 bg-green-700 text-white font-semibold rounded-lg p-2 text-lg'>Accept
              </button>
              <button
                  onClick={() => {
                      props.setRidePopUpPanel(false)
                  }}
                  className='w-full mt-5 bg-gray-200 text-gray-700 font-semibold rounded-lg p-2 text-lg'>Reject
              </button>
            </div>
        </div>
    </div>
  )
}

export default RidePopUp