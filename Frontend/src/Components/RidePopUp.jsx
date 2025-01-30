import React, { useState, useEffect } from "react";
import axios from "axios"; // For making HTTP requests
import { io } from "socket.io-client";
import MapComponent from "./MapComponent"; 

// Connect to the backend socket server
const socket = io("http://localhost:4000");

const RidePopUp = ({ setRidePopUpPanel, setConfirmRidePopUpPanel, onAccept }) => {
  const [rides, setRides] = useState([]); // State for storing all rides
  const [currentRideIndex, setCurrentRideIndex] = useState(0); // Index to track current ride

  useEffect(() => {
    const fetchPendingRides = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/maps/pendingRides", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Pending ride data:", response.data.data); // Log the fetched data
        setRides(response.data.data);
      } catch (error) {
        console.error("Error fetching pending rides:", error.message);
      }
    };

    fetchPendingRides();

    socket.on("newRide", (ride) => {
      if (ride.status === "pending") {
        setRides((prevRides) => [...prevRides, ride]);
      }
    });

    return () => {
      socket.off("newRide");
    };
  }, []);

  const fetchCaptainData = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        console.error("No token found in localStorage");
        return null;
      }

      const response = await axios.get("http://localhost:4000/api/captains/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      });
      console.log(response.data);
      return response.data; // Adjusted to match the expected data structure
    } catch (error) {
      console.error("Error fetching captain profile:", error.message);
      return null;
    }
  };

  const handleCaptainAccept = async (username) => {
    console.log("Updating status for username:", username); // Log username
    try {
      const response = await axios.put('http://localhost:4000/api/users/update-status', {
        username,
        status: 'Waiting', // Status changes to "Waiting"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating user status:', error.response?.data?.message || error.message);
    }
  };

  const handleCaptainStatusUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:4000/api/captains/status', {
        status: 'active', // Update captain status to "active"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating captain status:', error.response?.data?.message || error.message);
    }
  };

  const handleAccept = async () => {
    const currentRide = rides[currentRideIndex];
    try {
      const captainData = await fetchCaptainData();
      console.log("captaindata:", captainData);
      if (!captainData) {
        console.error("Failed to fetch captain data");
        return;
      }

      await axios.put(
        "http://localhost:4000/api/maps/updateRideData",
        {
          rideId: currentRide._id,
          status: "accepted",
          captainName: captainData.captainname,
          captainProfileImage: captainData.profileImage,
          plateNumber: captainData.vehicle.plate,
          capacity: captainData.vehicle.capacity,
          vehicleType: captainData.vehicle.vehicleType,
          color: captainData.vehicle.color,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      handleCaptainAccept(currentRide.username);
      handleCaptainStatusUpdate();
      localStorage.setItem("selectedRide", JSON.stringify(currentRide));

      onAccept(currentRide);
      setConfirmRidePopUpPanel(true);
      window.location.reload();
    } catch (error) {
      console.error("Error accepting ride:", error.message);
    }
  };

  const handleReject = async () => {
    const currentRide = rides[currentRideIndex];
    try {
      await axios.put(
        "http://localhost:4000/api/maps/updateRideData",
        { rideId: currentRide._id, status: "pending" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setCurrentRideIndex((prevIndex) => prevIndex + 1);
      if (currentRideIndex + 1 >= rides.length) {
        setRidePopUpPanel(false);
      }
    } catch (error) {
      console.error("Error rejecting ride:", error.message);
    }
  };

  if (rides.length === 0 || currentRideIndex >= rides.length) {
    return <div>No pending rides available</div>;
  }

  const currentRide = rides[currentRideIndex];
  
  return (
    <div className="bg-white z-50 p-5">
      <h5
        className="p-1 text-center top-0 absolute text-gray-300 w-[90%] text-4xl"
        onClick={() => setRidePopUpPanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-bold p-5">New Ride Request</h3>

      {rides.length > 0 && (
        <>
          <div className="flex w-full items-center justify-between bg-yellow-300 rounded-full p-2">
            <div className="flex items-center gap-4">
              <img
                className="h-10 w-10 object-cover rounded-full"
                src={rides[currentRideIndex]?.profileImage || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6"}
                alt=""
              />
              <h4 className="text-lg font-bold">{rides[currentRideIndex]?.username || "Unknown User"}</h4>
            </div>
            <h5 className="text-lg font-bold mr-3">{rides[currentRideIndex]?.distance || "N/A"} km</h5>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-user-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{rides[currentRideIndex]?.pickup?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{rides[currentRideIndex]?.pickup?.address || "Pickup location"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-2-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{rides[currentRideIndex]?.destination?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{rides[currentRideIndex]?.destination?.address || "Destination location"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2">
              <i className="ri-currency-line text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">${rides[currentRideIndex]?.vehicle?.fee || "0.00"}</h3>
                <div className="text-sm text-gray-500">Cash</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-2 mt-5">
        <button
          className="bg-red-500 text-white rounded-lg p-2 w-full"
          onClick={handleReject}
        >
          Reject
        </button>
        <button
          className="bg-green-500 text-white rounded-lg p-2 w-full"
          onClick={handleAccept}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
