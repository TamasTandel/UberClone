import React from 'react'

const LocationSearchPanel = (props) => {

  const locations=[
    "near old-bus-stop,ramfaliya,krishnapur, jalalpor, navsari",
    "near old-bus-stop,ramfaliya,krishnapur, jalalpor, navsari",
    "near old-bus-stop,ramfaliya,krishnapur, jalalpor, navsari",
    "near old-bus-stop,ramfaliya,krishnapur, jalalpor, navsari",
  ]

  return (
    <div>

    {
      locations.map(function(elem,idx){
        return  <div key={idx} onClick={()=>{props.setVehiclePanel(true) 
        props.setPanelOpen(false)}} className='flex items-center gap-4 justify-start border-2 border-gray-200 rounded-xl active:border-black m-3 p-2'>
        <h2 className='flex items-center justify-center h-10 bg-[#eee] w-12 rounded-full'><i className="ri-map-pin-line"></i></h2>
        <h4 className='font-medium '> {elem} </h4>
      </div>
      })
    }
    </div>
  )
}

export default LocationSearchPanel