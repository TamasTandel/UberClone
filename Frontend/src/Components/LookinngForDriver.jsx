import React, { useState, useEffect } from "react";
import axios from "axios";

const LookingForDriver = ({ setVehicleFound }) => {
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    const storedRideData = localStorage.getItem("rideData");
    if (storedRideData) {
      setRideData(JSON.parse(storedRideData));
    }
  }, []);

  const updateRideStatus = async (userId, status) => {
    try {
      const response = await axios.put(
        "https://uber-clone-roan-xi.vercel.app/api/maps/updateStatus",
        { userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(`Ride status updated to '${status}':`, response.data);
      } else {
        alert("Failed to update ride status.");
      }
    } catch (error) {
      console.error("Error updating ride status:", error);
      alert(`An error occurred while updating the ride status: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateUserStatus = async (status) => {
    try {
      const response = await axios.put(
        "https://uber-clone-roan-xi.vercel.app/api/users/update-status",
        { username: rideData.username, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(`User status updated to '${status}':`, response.data);
      } else {
        alert("Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert(`An error occurred while updating the user status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancel = () => {
    updateRideStatus(rideData.userId, "cancel");
    updateUserStatus("Nothing");
    setVehicleFound(false);
    window.location.reload();
  };

  if (!rideData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="z-50">
      <h5
        className="p-1 text-center absolute top-0 text-gray-300 w-[90%] text-4xl"
        onClick={() => setVehicleFound(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-bold p-5">Looking for driver</h3>
      <div className="flex flex-col gap-2 justify-between items-center">
        <img className="h-30" src={rideData.vehicle.image} alt="Vehicle" />
        <div className="w-full">
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-map-pin-user-fill text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <div className="text-sm">{rideData.pickup.name || "Pickup Address"}</div>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-map-pin-2-fill text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <div className="text-sm">{rideData.destination.name || "Destination Address"}</div>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-time-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                Travel Time: {rideData.vehicle.estimatedTime ? `${rideData.vehicle.estimatedTime} mins` : "Calculating..."}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2">
            <i className="ri-currency-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">Cash</h3>
              <div className="text-lg">${rideData.vehicle.fee || "not found"}</div>
            </div>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="w-full mt-5 bg-red-700 text-white font-semibold rounded-lg p-2 text-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;
