import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import LocationSearchPanel from '../Components/LocationSearchPanel';
import VehiclePanel from '../Components/VehiclePanel';
import ConfirmRide from '../Components/ConfirmRide';
import WaitingForDriver from '../Components/WaitingForDriver';
import LookinngForDriver from '../Components/LookinngForDriver';
import MapComponent from '../Components/MapComponent';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../Components/ErrorBoundary';
import Rideing from '../Components/Rideing';
import Menu from '../Components/Menu'; // Import the Menu component

const Home = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [routeDistance, setRouteDistance] = useState(null);
  const [route, setRoute] = useState(null);
  const [isLocationsSelected, setIsLocationsSelected] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleImage, setSelectedVehicleImage] = useState(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState("");
  const [vehicleFee, setVehicleFee] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [captainDetails, setCaptainDetails] = useState(null);
  const [userStatus, setUserStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideing, setShowRideing] = useState(false);
  const [showMenuPanel, setShowMenuPanel] = useState(false); // New state for menu panel
  const [allRides, setAllRides] = useState([]); // New state for all rides

  const mapRef = useRef(null);
  const locationPanelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const rideingRef = useRef(null);
  const menuPanelRef = useRef(null); // New ref for menu panel

  useEffect(() => {
    if (pickup && destination) {
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

  const clearLocalStorage = () => {
    localStorage.removeItem('selectedRide');
    localStorage.removeItem('rideData');
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await axios.get("http://localhost:4000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserStatus(response.data.status);
        console.log("response.data", response.data);
        console.log("response.data.status", response.data.status);

        const username = response.data.username;
        localStorage.setItem("username", username);

        if (response.data.status === "Nothing") {
          clearLocalStorage();
          setIsLocationsSelected(true);
        } else if (response.data.status === "Looking") {
          setVehicleFound(true);
        } else if (response.data.status === "Waiting") {
          setWaitingForDriver(true);
          fetchRideDetails(username);
        } else if (response.data.status === "Riding") {
          setShowRideing(true);
          fetchRideDetails(username);
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    const fetchRideDetails = async (username) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        console.log('Fetching ride details for username:', username);

        const response = await axios.get(`http://localhost:4000/api/maps/latestRide?username=${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCaptainDetails(response.data);
        setAllRides(response.data);
        setSelectedRide(response.data.data[0]);
        localStorage.setItem('selectedRide', JSON.stringify(response.data.data[0]));
        console.log('Ride Details:', response.data);
      } catch (error) {
        console.error("Error fetching ride details:", error.response ? error.response.data : error.message);
      }
    };

    fetchUserStatus();
  }, []);

  useEffect(() => {
    if (isLocationsSelected && locationPanelRef.current) {
      gsap.to(locationPanelRef.current, {
        translateY: '0%',
        opacity: 1,
        duration: 0.5,
      });
    } else if (locationPanelRef.current) {
      gsap.to(locationPanelRef.current, {
        translateY: '100%',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [isLocationsSelected]);

  useEffect(() => {
    if (vehiclePanel && vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else if (vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(200%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [vehiclePanel]);

  useEffect(() => {
    if (confirmRidePanel && confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else if (confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(200%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [confirmRidePanel]);

  useEffect(() => {
    if (vehicleFound && vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else if (vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(200%)',
        zIndex:'0',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [vehicleFound]);

  useEffect(() => {
    if (waitingForDriver && waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5,
      });
    } else if (waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(200%)',
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [waitingForDriver]);

  useEffect(() => {
    if (showRideing) {
      gsap.to(rideingRef.current, { transform: 'translateY(0)', duration: 0.5, opacity: 1 });
    } else {
      gsap.to(rideingRef.current, { transform: 'translateY(200%)', duration: 0.5, opacity: 0 });
    }
  }, [showRideing]);

  useEffect(() => {
    if (showMenuPanel) {
      gsap.to(menuPanelRef.current, { transform: 'translateY(0)', duration: 0.5, opacity: 1 });
    } else {
      gsap.to(menuPanelRef.current, { transform: 'translateY(200%)', duration: 0.5, opacity: 0 });
    }
  }, [showMenuPanel]);

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="fixed bg-white flex justify-between w-full z-10">
        <img
          className="w-28"
          src="https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400"
          alt=""
        />
        <button
          className="flex h-10 w-10 m-4 bg-white items-center justify-center rounded-full text-2xl font-semibold"
          onClick={() => setShowMenuPanel(true)} // Change to menu icon and add onClick handler
        >
          <i className="ri-menu-line"></i>
        </button>
      </div>
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

      {userStatus === "Nothing" && (
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
      )}
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
          setTravelTime={setTravelTime} 
          setRouteDistance={setRouteDistance}
          setSelectedVehicleName={setSelectedVehicleName}
        />
      </div>
      <div ref={confirmRidePanelRef} className="fixed z-20 bottom-0 translate-y-full w-full bg-white p-5">
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          selectedVehicleImage={selectedVehicleImage}
          selectedVehicleName={selectedVehicleName} 
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          vehicleFee={vehicleFee}
          travelTime={travelTime}
          routeDistance={routeDistance}
        />
      </div>
      {userStatus === "Looking" && (
        <div ref={vehicleFoundRef} className="fixed z-30 bottom-0 translate-y-full w-full bg-white p-5">
          <LookinngForDriver
            setVehicleFound={setVehicleFound}
            selectedVehicleImage={selectedVehicleImage}
            pickupLocation={pickupLocation}
            destinationLocation={destinationLocation}
            vehicleFee={vehicleFee}
            travelTime={travelTime}
          />
        </div>
      )}

      {userStatus === "Waiting" && (
        <div ref={waitingForDriverRef} className="fixed z-20 translate-y-full bottom-0 w-full bg-white p-5">
          <WaitingForDriver captainDetails={captainDetails} />
        </div>
      )}
      
      {userStatus === "Riding" && (
        <div ref={rideingRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white">
          <ErrorBoundary>
            <Rideing setRidingPanel={setShowRideing} selectedRide={selectedRide} />
          </ErrorBoundary>
        </div>
      )}

      {showMenuPanel && (
        <Menu onClose={() => setShowMenuPanel(false)} allRides={allRides} />
      )}
    </div>
  );
};

export default Home;
