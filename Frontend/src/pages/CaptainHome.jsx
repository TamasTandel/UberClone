import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../Components/CaptainDetails';
import RidePopUp from '../Components/RidePopUp';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp';
import MapComponent from '../Components/MapComponent';  // Ensure the map component is working

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [captainDetails, setCaptainDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);  // For storing selected user details
  const [users, setUsers] = useState([]);  // Store all users' locations

  const captainDetailsRef = useRef(null);
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  // Example of fetching users' data
  useEffect(() => {
    // This should come from an API that provides user data and locations
    const fetchUsers = async () => {
      const userData = [
        { id: 1, name: 'John Doe', distance: 2.5, location: { lat: 20.5937, lng: 78.9629 }, destination: { lat: 19.0760, lng: 72.8777 } },
        { id: 2, name: 'Jane Smith', distance: 5.3, location: { lat: 28.7041, lng: 77.1025 }, destination: { lat: 27.1751, lng: 78.0421 } },
      ];
      setUsers(userData);
    };

    fetchUsers();
  }, []);

  useGSAP(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(ridePopUpPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [ridePopUpPanel]);

  useGSAP(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [confirmRidePopUpPanel]);

  // GSAP animation for captainDetails
  useGSAP(() => {
    if (captainDetails) {
      gsap.to(captainDetailsRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(captainDetailsRef.current, { transform: 'translateY(100%)' });
    }
  }, [captainDetails]);

  const handleSelectUser = (user) => {
    setSelectedUser(user); // Set the selected user for ride details
    setRidePopUpPanel(false);  // Close the ride popup
    setConfirmRidePopUpPanel(true);  // Open confirm ride popup
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
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <MapComponent users={users} handleSelectUser={handleSelectUser} />
      </div>

      {/* Ride Pop Up */}
      <div ref={ridePopUpPanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white">
        <RidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel} />
      </div>

      {/* Confirm Ride Pop Up */}
      
  {/* <ConfirmRidePopUp rideDetails={rideDetails} /> */}
      <div ref={confirmRidePopUpPanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white">
        <ConfirmRidePopUp selectedUser={selectedUser} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel} />
      </div>



      {/* Bottom Panel */}
      <div className="h-[150px] bottom-0 absolute w-full px-6 bg-yellow-400 flex items-center justify- text-center">      
        <button
          className="w-full flex text-xl bg-green-700 text-white items-center justify-center p-2 rounded-lg font-semibold"
          onClick={() => {
            setRidePopUpPanel(true);
          }}
        >
          Choose Your Rideing
        </button>
      </div>
    </div>
  );
};

export default CaptainHome;