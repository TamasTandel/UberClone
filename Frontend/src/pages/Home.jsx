import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../Components/LocationSearchPanel';
import VehiclePanel from '../Components/VehiclePanel';
import ConfirmRide from '../Components/ConfirmRide';
import WaitingForDriver from '../Components/WaitingForDriver';
import LookinngForDriver from '../Components/LookinngForDriver';

const Home = () => {

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const panelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const panelCloseRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)

  const submitHandeler = (e)=>{
      e.preventDefault()
  }

  useGSAP(function(){
    if (panelOpen) {
      gsap.to(panelRef.current,{
        height:'70%',
      })
      gsap.to(panelCloseRef.current,{
        opacity:1
      })
    }else{
      gsap.to(panelRef.current,{
        height:'0%',
      })
      gsap.to(panelCloseRef.current,{
        opacity:0
      })
    }
  },[panelOpen])

  useGSAP(function(){
    if(vehiclePanel){
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(0)'
      })}else{
        gsap.to(vehiclePanelRef.current,{
          transform:'translateY(100%)'
        })
    }
  },[vehiclePanel])

  useGSAP(function(){
    if(confirmRidePanel){
      gsap.to(confirmRidePanelRef.current,{
        transform:'translateY(0)'
      })}else{
        gsap.to(confirmRidePanelRef.current,{
          transform:'translateY(100%)'
        })
    }
  }, [confirmRidePanel])
  
    useGSAP(function(){
    if(vehicleFound){
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(0)'
      })}else{
      gsap.to(vehicleFoundRef
        .current, {
          transform:'translateY(100%)'
        })
    }
    }, [vehicleFound])
      
  useGSAP(function () {
    if(waitingForDriver){
      gsap.to(waitingForDriverRef.current,{
        transform:'translateY(0)'
      })}else{
      gsap.to(waitingForDriverRef.current, {
          transform:'translateY(100%)'
        })
    }
  },[waitingForDriver])

  return (
    <div className='h-screen relative overflow-hidden'>
      <Link to='/'>
        <img className='w-20 absolute left-2 top-2' src="https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400" alt="" />
      </Link>
      <div className='h-screen w-[100%] '>   {/* i use w-[100%] and fix screen issue */}
        <img className='w-[100%] h-full object-cover object-center' src="https://imgs.search.brave.com/dpyAyTY8VcMHt_qOO1NnD7Dn2-vvM3iOMg_4xSkVLLs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzAzLzk4Lzgx/LzM2MF9GXzkwMzk4/ODE4N19IaHpYdWMx/RWVaa3pRbTljQllN/QTJKbWJiUjU2bnlM/Vy5qcGc" alt="" />
      </div>
      <div className='flex flex-col justify-end absolute h-screen top-0 w-full'>
        <div className='bg-white relative h-[30%] p-5'>
          <h4
           className='absolute opacity-0 right-6 top-5 text-2xl'
           ref={panelCloseRef}
           onClick={()=>{
            setPanelOpen(false)
           }}
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h4>
          <h1 className='text-2xl font-semibold'>Find a trip</h1>
          <form onSubmit={(e)=>{
            submitHandeler(e)
          }}>
            <div className='line absolute w-1 h-16 top-[29%] bg-gray-600 left-10 rounded-full'></div>
            <input
             value={pickup}
             onClick={()=>{
              setPanelOpen(true)
             }}
             onChange={(e)=>{
              setPickup(e.target.value)
             }}
             className='bg-[#eeee] px-12 py-2 text-lg rounded-lg w-full mt-3' type="text" placeholder='Add a pick-up location'/>
            <input
             value={destination}
             onClick={()=>{
              setPanelOpen(true)
             }}
             onChange={(e)=>{
              setDestination(e.target.value)
             }}
             className='bg-[#eeee] px-12 py-2 text-lg rounded-lg w-full mt-3' type="text" placeholder='Enter Your destination'/>
          </form>
        </div>
        <div ref={panelRef} className=' bg-white h-[0%]'>
             <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel}/>
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed z-10 bottom-0 translate-y-full w-full bg-white p-5'>
        <VehiclePanel setVehiclePanel={setVehiclePanel} setConfirmRidePanel={setConfirmRidePanel}/>
      </div>
      <div ref={confirmRidePanelRef} className='fixed z-10 bottom-0 translate-y-full w-full bg-white p-5'>
        <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>
      <div ref={vehicleFoundRef} className='fixed z-10 bottom-0 translate-y-full w-full bg-white p-5'>
        <LookinngForDriver setVehicleFound={setVehicleFound} />
      </div>      
      <div ref={waitingForDriverRef} className='fixed z-10 translate-y-full bottom-0 w-full bg-white p-5'>
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}

export default Home