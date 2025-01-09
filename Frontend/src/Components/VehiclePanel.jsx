import React, { useState, useEffect } from "react";

const VehiclePanel = ({ 
  pickupLocation, 
  destinationLocation, 
  setVehiclePanel, 
  setConfirmRidePanel, 
  userToken 
}) => {
  const [distance, setDistance] = useState(null); // Distance state
  const [loading, setLoading] = useState(true); // Loading state

  // Function to calculate the fee based on distance
  const calculateFee = (distance) => {
    if (distance <= 1) return 8; // Fee for the first kilometer
    return 8 + (distance - 1) * 6; // Fee for subsequent kilometers
  };

  // Function to fetch saved distance from the backend
  const fetchSavedDistance = async () => {
    if (!userToken) return; // Ensure userToken is available
    try {
      setLoading(true); // Start loading process
      const response = await fetch(`/api/locations/${userToken}`); // Adjust the API route if necessary
      const data = await response.json();

      if (data.success) {
        setDistance(data.location.distance); // Set distance from the response
      } else {
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching saved distance:", error);
    } finally {
      setLoading(false); // End loading process
    }
  };

  // Fetch distance when the component mounts or userToken changes
  useEffect(() => {
    fetchSavedDistance();
  }, [userToken]);

  return (
    <div className="vehicle-panel-container">
      {/* Close Panel Icon */}
      <h5
        className="p-1 text-center absolute top-0 text-gray-300 w-full text-4xl cursor-pointer"
        onClick={() => setVehiclePanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      {/* Panel Title */}
      <h3 className="text-2xl font-bold p-5">Choose a Vehicle</h3>

      {/* Distance Display */}
      <p className="text-gray-700 text-lg mb-5">
        Distance: {loading ? "Loading..." : distance !== null ? `${distance.toFixed(2)} km` : "No distance found"}
      </p>

      {/* Vehicle Options */}
      {["Uber Go", "Uber Moto", "Uber Auto"].map((vehicle, index) => (
        <div
          key={index}
          onClick={() => {
            setConfirmRidePanel(true);
            setVehiclePanel(false);
          }}
          className="flex items-center w-full justify-center border-2 active:border-black rounded-xl p-1 my-2"
        >
          {/* Vehicle Image */}
          <img
            className="h-20 w-20" // Uniform height and width
            src={
              vehicle === "Uber Go"
                ? "https://mobile-content.uber.com/launch-experience/ride.png"
                : vehicle === "Uber Moto"
                ? "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1649230978/assets/a2/553a18-2f77-4722-a4ba-f736f4cb405e/original/Uber_Moto_Orange_558x372_pixels_Desktop.png"
                : "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_768,w_1152/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
            }
            alt={vehicle}
          />

          {/* Vehicle Details */}
          <div className="w-1/2">
            <h2 className="font-medium text-lg">
              {vehicle} <span><i className="ri-user-3-fill"></i>{vehicle === "Uber Go" ? 4 : vehicle === "Uber Moto" ? 1 : 3}</span>
            </h2>
            <h3 className="font-medium text-base">{index + 2} mins away</h3>
            <p className="font-normal text-xs text-gray-800">
              {vehicle === "Uber Go"
                ? "Affordable, compact rides"
                : vehicle === "Uber Moto"
                ? "Affordable Uber Moto rides"
                : "Affordable Uber Auto rides"}
            </p>
          </div>

          {/* Fee Display */}
          <h2 className="text-xl font-semibold">
            {loading || distance === null ? "N/A" : `$${calculateFee(distance).toFixed(2)}`}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
