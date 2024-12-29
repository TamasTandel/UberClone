import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap'; // GSAP import
import axios from 'axios';
import LocationSearchPanel from '../Components/LocationSearchPanel';
import VehiclePanel from '../Components/VehiclePanel';
import ConfirmRide from '../Components/ConfirmRide';
import WaitingForDriver from '../Components/WaitingForDriver';
import LookinngForDriver from '../Components/LookinngForDriver';
import MapComponent from '../Components/MapComponent';

// Custom Hook for GSAP animations
const useGSAP = (callback, dependencies) => {
  useEffect(() => {
    callback();
  }, dependencies);
};

const Home = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [isLocationsSelected, setIsLocationsSelected] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const map = useRef(null);
  const locationPanelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null)
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundPanelRef = useRef(null); // Ref for Vehicle Found Panel
  const waitingForDriverRef = useRef(null); // Ref for Waiting for Driver Panel

  // Fetch route when pickup and destination are set
  useEffect(() => {
    if (pickup && destination) {
      const fetchRoute = async () => {
        try {
          const response = await axios.get(
            'https://api.openrouteservice.org/v2/directions/driving-car',
            {
              headers: { Authorization: '5b3ce3597851110001cf62481c56779035fe43b8ab50db80f7032ba9' },
              params: {
                start: `${pickup.lng},${pickup.lat}`,
                end: `${destination.lng},${destination.lat}`,
              },
            }
          );
          setRoute(response.data);
          // setIsLocationsSelected(true);
          setVehiclePanel(true);
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      };
      fetchRoute();
    }
  }, [pickup, destination]);

  // Animate LocationSearchPanel
  useGSAP(() => {
    if (isLocationsSelected) {
      gsap.to(locationPanelRef.current, {
        translateY: '100%',
        opacity: 0,
        duration: 0.5,
      });
    } else {
      gsap.to(locationPanelRef.current, {
        translateY: '0%',
        opacity: 1,
        duration: 0.5,
      });
    }
  }, [isLocationsSelected]);

  // Animate VehiclePanel
  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [vehiclePanel]);

  // Animate ConfirmRidePanel
  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [confirmRidePanel]);

  // Animate Vehicle Found Panel
  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [vehicleFound]);

  // Animate Waiting for Driver Panel
  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [waitingForDriver]);

  const addMapMarker = (lat, lng, type) => {
    if (!map.current) return;
    const marker = L.marker([lat, lng]);
    const icon = type === 'pickup' ? new L.Icon({ iconUrl: '/pickup-icon.png' }) : new L.Icon({ iconUrl: '/destination-icon.png' });
    marker.setIcon(icon).addTo(map.current);
    marker.bindPopup(type === 'pickup' ? 'Pickup Location' : 'Destination Location').openPopup();
  };

  return (
    <div className='h-screen relative overflow-hidden'>
      <div className="h-[70vh] w-full">
        <MapComponent
          route={route}
          pickup={pickup}
          destination={destination}
          setPickup={setPickup}
          setDestination={setDestination}
          map={map}
        />
      </div>
      <div className='flex flex-col justify-end absolute h-screen top-0 w-full'>
      <div
        ref={locationPanelRef}
        className="absolute bg-white w-full bottom-24 transition-all duration-300"
      >
        <LocationSearchPanel
          setPickup={setPickup}
          setDestination={setDestination}
          addMarker={addMapMarker}
        />
      </div>
      </div>
        <div ref={vehiclePanelRef} className='fixed z-20 bottom-0 translate-y-full w-full p-5 bg-white'>
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
};

export default Home;
