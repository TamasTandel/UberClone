import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUp from '../Components/RidePopUp'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp'

const CaptainHome = () => {

  const [ridePopUpPanel, setRidePopUpPanel] = useState(true)
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const ridePopUpPanelRef = useRef(null)
  const confirmRidePopUpPanelRef = useRef(null)
 
    useGSAP(function () {
    if(ridePopUpPanel){
      gsap.to(ridePopUpPanelRef.current,{
        transform:'translateY(0)'
      })}else{
      gsap.to(ridePopUpPanelRef.current, {
          transform:'translateY(100%)'
        })
    }
    }, [ridePopUpPanel])
  
  useGSAP(function () {
    if(confirmRidePopUpPanel){
      gsap.to(confirmRidePopUpPanelRef.current,{
        transform:'translateY(0)'
      })}else{
      gsap.to(confirmRidePopUpPanelRef.current, {
          transform:'translateY(100%)'
        })
    }
  },[confirmRidePopUpPanel])

  return (
    <div className='h-screen'>
      <div className='fixed flex justify-between w-full'>
      <img className='w-28' src="https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400" alt="" />
      <Link className='flex h-10 w-10 m-4 bg-white items-center justify-center rounded-full text-2xl font-semibold' to={'/home'}>
        <i className="ri-logout-box-r-line"></i>
      </Link>
      </div>
      <div className='h-3/5'>
        <img className='h-full w-full object-cover' src="https://imgs.search.brave.com/dpyAyTY8VcMHt_qOO1NnD7Dn2-vvM3iOMg_4xSkVLLs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzAzLzk4Lzgx/LzM2MF9GXzkwMzk4/ODE4N19IaHpYdWMx/RWVaa3pRbTljQllN/QTJKbWJiUjU2bnlM/Vy5qcGc" alt="" />
      </div>
      <div className="h-2/5 p-4">
        <CaptainDetails/>
      </div>
      <div ref={ridePopUpPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <RidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel} />
      </div>
      <div ref={confirmRidePopUpPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 h-screen'>
        <ConfirmRidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel} />
      </div>
    </div>
  )
}

export default CaptainHome