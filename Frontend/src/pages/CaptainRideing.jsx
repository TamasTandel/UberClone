import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FinishRide from '../Components/FinishRide'


const CaptainRideing = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const finishRidePanelRef = useRef(null)

  useGSAP(function () {
    if(finishRidePanel){
      gsap.to(finishRidePanelRef.current,{
        transform:'translateY(0)'
      })}else{
      gsap.to(finishRidePanelRef.current, {
          transform:'translateY(100%)'
        })
    }
  },[finishRidePanel])

  return (
    <div className='h-screen'>
      
      <div className='fixed flex justify-between w-full'>
      <img className='w-28' src="https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400" alt="" />
      <Link className='flex h-10 w-10 m-4 bg-white items-center justify-center rounded-full text-2xl font-semibold' to={'/home'}>
        <i className="ri-logout-box-r-line"></i>
      </Link>
      </div>
      <div className='h-4/5'>
        <img className='h-full w-full object-cover' src="https://imgs.search.brave.com/dpyAyTY8VcMHt_qOO1NnD7Dn2-vvM3iOMg_4xSkVLLs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzAzLzk4Lzgx/LzM2MF9GXzkwMzk4/ODE4N19IaHpYdWMx/RWVaa3pRbTljQllN/QTJKbWJiUjU2bnlM/Vy5qcGc" alt="" />
        </div>
        <h5 className='p-2 text-center absolute text-gray-100 w-full text-4xl'
        ><i className="ri-arrow-up-wide-line"></i> </h5>
        <div className='h-1/5 p-6 bg-yellow-400 flex items-center justify-between' >
        <h4 className='text-xl w-full p-2 font-bold'>4 KM away</h4>
        <button className='w-full flex text-xl bg-green-700 text-white items-center justify-center p-2 rounded-lg font-semibold' onClick={()=>{
          setFinishRidePanel(true)
        }}>Complete Ride</button>
      </div>
      <div ref={finishRidePanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <FinishRide setFinishRidePanel={setFinishRidePanel } />
      </div>

    </div>  )
}

export default CaptainRideing