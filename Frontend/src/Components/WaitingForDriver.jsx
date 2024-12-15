import React from 'react'

const WaitingForDriver = (props) => {
  return (
      <div>
        <div>
        <h5 className='p-1 text-center absolute top-0 text-gray-300 w-[90%] text-4xl'
        onClick={()=>{
          props.WaitingForDriver(false)
        }}
        ><i className="ri-arrow-down-wide-line"></i> </h5>
        <h3 className='text-2xl font-bold p-5'>Looking for driver</h3>
        <div className='flex flex-col gap-2 justify-between items-center'>
          <div className='flex justify-around w-full items-center'>
            <img className='h-20' src="https://mobile-content.uber.com/launch-experience/ride.png" alt="" />
            <div className='text-right'>
              <h2 className='font-bold text-lg'>Tamas Tandel</h2>
              <h4 className='font-bold text-xl'>GJ 21 AB 5174</h4>
              <p className='text-sm text-gray-700'>Maruti suzuki alto</p>
            </div>
          </div>
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
        </div>
          </div>
    </div>
  )
}

export default WaitingForDriver