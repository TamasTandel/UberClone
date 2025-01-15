import React, { useState, useEffect } from "react";
import axios from "axios"; // For making HTTP requests
import { io } from "socket.io-client";

// Connect to the backend socket server
const socket = io("http://localhost:4000");

const RidePopUp = ({ setRidePopUpPanel, setConfirmRidePopUpPanel, onAccept }) => {
  const [rides, setRides] = useState([]); // State for storing all rides
  const [currentRideIndex, setCurrentRideIndex] = useState(0); // Index to track current ride

  // Fetch pending rides and listen for new rides
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/maps/getData", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Fetched map data:", response.data.data); // Log the fetched data
        setRides(response.data.data); // Populate rides state with fetched data
      } catch (error) {
        console.error("Error fetching map data:", error.message);
      }
    };

    fetchRides();

    socket.on("newRide", (ride) => {
      setRides((prevRides) => [...prevRides, ride]);
    });

    return () => {
      socket.off("newRide");
    };
  }, []);

  const handleAccept = () => {
    const currentRide = rides[currentRideIndex];
    onAccept(currentRide);
    setConfirmRidePopUpPanel(true);
  };

  const handleReject = () => {
    setCurrentRideIndex(currentRideIndex + 1); // Go to the next ride
    if (currentRideIndex + 1 >= rides.length) {
      setRidePopUpPanel(false); // Close popup if no more rides
    }
  };

  return (
    <div className=" bg-white z-50 p-5">
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
                src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6"
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
                <div className="text-sm text-gray-500">{rides[currentRideIndex]?.pickup?.address || "Unknown Address"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-2-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{rides[currentRideIndex]?.destination?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{rides[currentRideIndex]?.destination?.address || "Unknown Address"}</div>
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
