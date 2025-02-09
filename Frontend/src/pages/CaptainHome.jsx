import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../Components/CaptainDetails';
import RidePopUp from '../Components/RidePopUp';
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp';
import MapComponent from '../Components/MapComponent';
import gsap from 'gsap';
import { io } from 'socket.io-client';
import axios from 'axios';
import ErrorBoundary from '../Components/ErrorBoundary';
import CaptainRideing from '../Components/CaptainRideing';
import MenuCaptain from '../Components/MenuCaptain';

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [captainDetails, setCaptainDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [captainStatus, setCaptainStatus] = useState(null);
  const [showRideing, setShowRideing] = useState(false);
  const [captainName, setCaptainName] = useState("");
  const [rideData, setRideData] = useState(null);
  const [showMenuPanel, setShowMenuPanel] = useState(false); // New state for menu panel
  const [allRides, setAllRides] = useState([]); // New state for all rides

  const captainDetailsRef = useRef(null);
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);
  const rideingRef = useRef(null);
  const menuPanelRef = useRef(null);

  const fetchCaptainProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return null;
      }

      const response = await axios.get("https://uber-clone-roan-xi.vercel.app/api/captains/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response.data :", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching captain profile:", error.message);
      return null;
    }
  };

  const fetchRideDetails = async (captainname) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      console.log('Fetching ride details for captainname:', captainname);

      const response = await axios.get(`https://uber-clone-roan-xi.vercel.app/api/maps/latestRide?captain.name=${captainname}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCaptainDetails(response.data);
      setAllRides(response.data);
      setSelectedRide(response.data.data[0]); // Store the first ride details in state
      localStorage.setItem('selectedRide', JSON.stringify(response.data.data[0])); // Store the first ride details in localStorage
      console.log('Ride Details:', response.data);
    } catch (error) {
      console.error("Error fetching ride details:", error.response ? error.response.data : error.message);
    }
  };

  const fetchCaptainStatus = async () => {
    const profileData = await fetchCaptainProfile();
    if (profileData) {
      setCaptainStatus(profileData.status);
      setCaptainName(profileData.captainname);
      if (profileData.status === 'riding') {
        fetchRideDetails(profileData.captainname);
      }
    }
  };

  useEffect(() => {
    fetchCaptainStatus();

    const socket = io("https://uber-clone-roan-xi.vercel.app");

    socket.on("rideRequest", (rideData) => {
      console.log("New Ride Request Received:", rideData);
      setRideRequests((prevRequests) => [...prevRequests, rideData]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, { transform: 'translateY(0%)', duration: 0.5, opacity: 1 });
    } else {
      gsap.to(ridePopUpPanelRef.current, { transform: 'translateY(500px)', duration: 0.5, opacity: 0 });
    }
  }, [ridePopUpPanel]);

  useEffect(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(0)', duration: 0.5, opacity: 1 });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(100%)', duration: 0.5, opacity: 0 });
    }
  }, [confirmRidePopUpPanel]);

  useEffect(() => {
    if (showRideing) {
      gsap.to(rideingRef.current, { transform: 'translateY(0)', duration: 0.5, opacity: 1 });
    } else {
      gsap.to(rideingRef.current, { transform: 'translateY(200%)', duration: 0.5, opacity: 0 });
    }
  }, [showRideing]);

  useEffect(() => {
    if (captainStatus === 'inactive') {
      setRidePopUpPanel(true);
      setConfirmRidePopUpPanel(false);
      setShowRideing(false);
    } else if (captainStatus === 'active') {
      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(true);
      setShowRideing(false);
    } else if (captainStatus === 'riding') {
      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(false);
      setShowRideing(true);
    }
  }, [captainStatus]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
  };

  const handleAcceptRide = (ride) => {
    setSelectedRide(ride);
    setSelectedLocation(ride.pickup.coordinates);
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
  };

  useEffect(() => {
    if (showMenuPanel) {
      gsap.to(menuPanelRef.current, { transform: 'translateY(0)', duration: 0.5, opacity: 1 });
      fetchRideDetails(captainName); // Fetch ride details when the menu is opened
    } else {
      gsap.to(menuPanelRef.current, { transform: 'translateY(200%)', duration: 0.5, opacity: 0 });
    }
  }, [showMenuPanel]);

  return (
    <div className="h-screen relative">
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

      <div className="absolute top-[10vh] left-0 w-full h-full z-0">
        <MapComponent users={users} handleSelectUser={handleSelectUser} selectedLocation={selectedLocation} />
      </div>

      <div ref={ridePopUpPanelRef} className="fixed w-full z-50 bottom-0 translate-y-full px-3 pt-12 overflow-y-auto bg-white">
        <RidePopUp
          selectedUser={selectedUser}
          rideRequests={rideRequests}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setSelectedRide={setSelectedRide}
          onAccept={handleAcceptRide}
        />
      </div>
      <div ref={ridePopUpPanelRef} className="fixed w-full z-50 bottom-0 translate-y-full px-3 pt-12 overflow-y-auto bg-white">
        <RidePopUp
          selectedUser={selectedUser}
          rideRequests={rideRequests}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setSelectedRide={setSelectedRide}
          onAccept={handleAcceptRide}
        />
      </div>
      <div ref={confirmRidePopUpPanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white">
        <ConfirmRidePopUp 
          selectedUser={selectedUser} 
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} 
          setRidePopUpPanel={setRidePopUpPanel} 
          selectedRide={selectedRide} 
          captainName={captainName}
          rideData={rideData}
        />
      </div>
      
      <div ref={rideingRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white">
        <ErrorBoundary>
          <CaptainRideing setRidingPanel={setShowRideing} selectedRide={selectedRide} />
        </ErrorBoundary>
      </div>
      {showMenuPanel && (
        <MenuCaptain 
          onClose={() => setShowMenuPanel(false)} 
          allRides={allRides} 
          fetchRideDetails={fetchRideDetails} // Pass the fetchRideDetails function as a prop
        />
      )}
    </div>
  );
};

export default CaptainHome;
