import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../Components/CaptainDetails';
import RidePopUp from '../Components/RidePopUp';
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp';
import MapComponent from '../Components/MapComponent';
import gsap from 'gsap';
import { io } from 'socket.io-client';

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [captainDetails, setCaptainDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null); // Initialize with null or default value.

  const captainDetailsRef = useRef(null);
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    // Listen for ride requests
    socket.on("rideRequest", (rideData) => {
      console.log("New Ride Request Received:", rideData);
      setRideRequests((prevRequests) => [...prevRequests, rideData]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, { transform:'translateY(0%)', duration: 0.5 });
    } else {
      gsap.to(ridePopUpPanelRef.current, {transform: 'translateY(100%)', duration: 0.5 });
    }
  }, [ridePopUpPanel]);

  useEffect(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(0)', duration: 0.5 });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(100%)', duration: 0.5 });
    }
  }, [confirmRidePopUpPanel]);

  useEffect(() => {
    if (captainDetails) {
      gsap.to(captainDetailsRef.current, { transform: 'translateY(0)', duration: 0.5 });
    } else {
      gsap.to(captainDetailsRef.current, { transform: 'translateY(100%)', duration: 0.5 });
    }
  }, [captainDetails]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
  };

  const handleAcceptRide = (ride) => {
    setSelectedRide(ride);  // Set the selected ride details
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);  // Show the Confirm Ride Popup
  };

  return (
    <div className="h-screen relative">
      {/* Header */}
      <div className="fixed bg-white flex justify-between w-full z-10">
        <img
          className="w-28"
          src="https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400"
          alt=""
        />
        <Link className="flex h-10 w-10 m-4 bg-white items-center justify-center rounded-full text-2xl font-semibold" to={'/home'}>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map Component (Fullscreen) */}
      <div className="absolute top-[10vh] left-0 w-full h-full z-0">
        <MapComponent users={users} handleSelectUser={handleSelectUser} />
      </div>

      {/* Ride Pop Up */}
      <div ref={ridePopUpPanelRef} className="fixed w-full z-50 bottom-0 translate-y-full px-3 pt-12 overflow-y-auto bg-white">
        <RidePopUp
          selectedUser={selectedUser}
          rideRequests={rideRequests}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setSelectedRide={setSelectedRide}
          onAccept={handleAcceptRide}  // Pass the handler for accepting the ride
        />
      </div>

      {/* Confirm Ride Pop Up */}
      <div ref={confirmRidePopUpPanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white">
        <ConfirmRidePopUp selectedUser={selectedUser} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel} selectedRide={selectedRide} />
      </div>

      {/* Render Ride Requests */}
      <div className="absolute top-16 right-0 p-4 shadow-lg rounded-lg max-h-[400px] overflow-y-auto">
        {rideRequests.map((request, index) => (
          <div key={index} className="mb-4 p-2 border rounded-lg">
            <h3 className="font-semibold">Ride Request from {request.username}</h3>
            <p>Pickup: {request.pickup.name}</p>
            <p>Destination: {request.destination.name}</p>
            <p>Distance: {request.distance} km</p>
            <p>Fee: ${request.vehicle.fee}</p>
          </div>
        ))}
      </div>

      {/* Bottom Panel */}
      <div className="h-[20vh] bottom-0 absolute w-full px-6 bg-yellow-400 flex items-center justify-center text-center">
        <button
          className="w-full flex text-xl bg-green-700 text-white items-center justify-center p-2 rounded-lg font-semibold"
          onClick={() => { setRidePopUpPanel(true); }}
        >
          Choose Your Ride
        </button>
      </div>
    </div>
  );
};

export default CaptainHome;
