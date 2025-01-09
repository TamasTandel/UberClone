import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap'; // GSAP import
import axios from 'axios';
import LocationSearchPanel from '../Components/LocationSearchPanel';
import VehiclePanel from '../Components/VehiclePanel';
import ConfirmRide from '../Components/ConfirmRide';
import WaitingForDriver from '../Components/WaitingForDriver';
import LookinngForDriver from '../Components/LookinngForDriver';
import MapComponent from '../Components/MapComponent';

const Home = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState(null);
  const [isLocationsSelected, setIsLocationsSelected] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleImage, setSelectedVehicleImage] = useState(null);
  const [vehicleFee, setVehicleFee] = useState(null);

  const mapRef = useRef(null);
  const locationPanelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  useEffect(() => {
  if (pickup && destination) {
    // Update both pickupLocation and destinationLocation
    setPickupLocation(pickup);
    setDestinationLocation(destination);
    setVehiclePanel(true);  
    gsap.to(locationPanelRef.current, {
        opacity: 1,
        duration: 0.5,
      });
  }
}, [pickup, destination]);


  const updateLocation = (location, type) => {
    if (type === 'pickup') {
      setPickup(location);
    } else if (type === 'destination') {
      setDestination(location);
    }
  };

  // Animations
  useEffect(() => {
    if (isLocationsSelected) {
      gsap.to(locationPanelRef.current, {
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

  useEffect(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(200%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [vehiclePanel]);

  useEffect(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(200%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [confirmRidePanel]);

  useEffect(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(200%)',
        zIndex:'0',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [vehicleFound]);

  useEffect(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(200%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [waitingForDriver]);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Map component with z-index to stay behind */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <MapComponent
          route={route}
          pickup={pickup}
          destination={destination}
          setPickup={setPickup}
          setDestination={setDestination}
          updateLocation={updateLocation}
          map={mapRef}
        />
      </div>

      {/* Location Panel */}
      <div className="flex flex-col justify-end absolute h-screen top-0 w-full z-0">
        <div
          ref={locationPanelRef}
          className="absolute bg-white w-full bottom-0 transition-all duration-300 z-0"
        >
          <LocationSearchPanel
            pickup={pickup}
            destination={destination}
            setPickup={setPickup}
            setDestination={setDestination}
          />
        </div>
      </div>

      {/* Vehicle Panel */}
      <div ref={vehiclePanelRef} className="fixed z-20 bottom-0 translate-y-full w-full p-5 bg-white">
        <VehiclePanel
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          setVehiclePanel={setVehiclePanel}
          setConfirmRidePanel={setConfirmRidePanel}
          setSelectedVehicle={setSelectedVehicle}
          userToken={userToken}
          setSelectedVehicleImage={setSelectedVehicleImage} 
          setFee={setVehicleFee} 
        />
      </div>

      {/* Confirm Ride Panel */}
      <div ref={confirmRidePanelRef} className="fixed z-20 bottom-0 translate-y-full w-full bg-white p-5">
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          selectedVehicleImage={selectedVehicleImage}
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          vehicleFee={vehicleFee} // Fee for the selected vehicle
        />
      </div>

      {/* Vehicle Found Panel */}
      <div ref={vehicleFoundRef} className="fixed z-30 bottom-0 translate-y-full w-full bg-white p-5">
        <LookinngForDriver
          setVehicleFound={setVehicleFound}
          selectedVehicleImage={selectedVehicleImage}
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          vehicleFee={vehicleFee}
        />
      </div>

      {/* Waiting for Driver Panel */}
      <div ref={waitingForDriverRef} className="fixed z-20 translate-y-full bottom-0 w-full bg-white p-5">
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
