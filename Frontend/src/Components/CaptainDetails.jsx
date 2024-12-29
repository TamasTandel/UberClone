import React from 'react'

const CaptainDetails = () => {
  return (
      <div className='z-50'>
        <div className='flex items-center justify-between m-2'>
          <div className='flex items-center justify-start gap-4'>
            <img className='h-10 w-10 object-cover object-center rounded-full' src="https://imgs.search.brave.com/wLR3CQ5qeOMSs4xz8-dH-wyDQRIURTe-qWgHrhRk8sY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2Lzc4LzA5Lzc4/LzM2MF9GXzY3ODA5/Nzg3Nl85a0puRmxS/WUdBZWlic1Z4c3Bx/dENMOVVSOGdpTEF2/Ri5qcGc" alt="" />
            <h4 className='text-lg font-medium'>Tamas Tandel</h4>
          </div>
          <div>
            <h4 className='text-xl font-semibold'>$316.31</h4>
            <p className='text-sm font-medium text-gray-500'>Earned</p>
          </div>
        </div>
        <div className='flex justify-center bg-gray-100 rounded-xl gap-5 items-start p-2 mt-7 m-2'>
            <div className="text-center">
              <i className="text-3xl mb-2 font-thin  ri-timer-2-line"></i>
              <h5 className='text-lg font-medium'>10.2</h5>
              <p className='text-sm text-gray-600'>Hours Online</p>
            </div>
            <div className="text-center">
              <i className="text-3xl mb-2 font-thin  ri-speed-up-line"></i>
              <h5 className='text-lg font-medium'>10.2</h5>
              <p className='text-sm text-gray-600'>Hours Online</p>
            </div>
            <div className="text-center">
              <i className="text-3xl mb-2 font-thin  ri-booklet-line"></i>
              <h5 className='text-lg font-medium'>10.2</h5>
              <p className='text-sm text-gray-600'>Hours Online</p>
            </div>
        </div>          
    </div>
  )
}

export default CaptainDetails