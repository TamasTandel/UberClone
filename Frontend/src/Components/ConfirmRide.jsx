import React, { useState, useEffect } from "react";
import axios from "axios";

const ConfirmRide = ({
  setConfirmRidePanel,
  setVehicleFound,
  selectedVehicleImage,
  pickupLocation,
  destinationLocation,
  vehicleFee,
  travelTime,
  username,
  userLiveLocation,
  selectedVehicleName,
  routeDistance,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fullname: { firstname: "", lastname: "" },
    userId: "",
  });
  
useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          console.error("No token found in localStorage");
          setUserProfile({
            fullname: { firstname: "Guest", lastname: "" },
            userId: "unknown",
          });
          return;
        }

        const response = await axios.get("http://localhost:4000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        setUserProfile({
          fullname: response.data.fullname,
          userId: response.data._id,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          fullname: { firstname: "Guest", lastname: "" },
          userId: "unknown",
        });
      }
    };

    fetchUserProfile();
  }, []); 

  const handleConfirm = async () => {
    // Check if required fields are missing
    if (!pickupLocation || !destinationLocation) {
      alert("Please ensure both pickup and destination locations are available!");
      return;
    }

    // if (!selectedVehicleName) {
    //   alert("Please select a vehicle!");
    //   return;
    // }

    if (vehicleFee === null || vehicleFee === undefined) {
      alert("Vehicle fee has not been calculated!");
      return;
    }

    if (!travelTime) {
      alert("Travel time is not available!");
      return;
    }

    setIsSubmitting(true);

    // Data to send to the backend
    const rideData = {
      userId: userProfile.userId, // Use the fetched userId
      username: `${userProfile.fullname.firstname} ${userProfile.fullname.lastname}`,
      pickup: {
        name: pickupLocation.name,
        lat: pickupLocation.lat,
        lng: pickupLocation.lng,
      },
      destination: {
        name: destinationLocation.name,
        lat: destinationLocation.lat,
        lng: destinationLocation.lng,
      },
      distance: routeDistance,
      vehicle: {
        // name: selectedVehicleName,
        fee: vehicleFee,
        estimatedTime: travelTime,
      },
      // userLiveLocation: {
      //   lat: userLiveLocation?.lat || 0,
      //   lng: userLiveLocation?.lng || 0,
      // },
    };

    console.log("Ride Data: ", rideData);

    try {
      // Send data to backend
      const response = await axios.post(
        "http://localhost:4000/api/maps/save",
        rideData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Ride confirmed and data saved successfully!");
        setVehicleFound(true);
        setConfirmRidePanel(false);
      } else {
        alert("Failed to save ride details. Please try again.");
      }
    } catch (error) {
      console.error("Error saving ride details:", error);
      alert("An error occurred while saving the ride details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="z-50">
      <h5
        className="p-1 text-center absolute top-0 text-gray-300 w-[90%] text-4xl"
        onClick={() => setConfirmRidePanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-bold p-5">Confirm Your Vehicle</h3>
      <div className="flex flex-col gap-2 justify-between items-center">
        <img className="h-20" src={selectedVehicleImage} alt="Selected Vehicle" />
        <div className="w-full">
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-map-pin-user-fill text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                {pickupLocation?.name || "Pickup Address"}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-map-pin-2-fill text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                {destinationLocation?.name || "Destination Address"}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-user-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                {`Rider: ${userProfile.fullname.firstname} ${userProfile.fullname.lastname}`}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-time-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                Travel Time: {travelTime ? `${travelTime} min` : "Calculating..."}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2">
            <i className="ri-currency-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                {vehicleFee === null || vehicleFee === undefined
                  ? "Fee not set"
                  : `$${vehicleFee}`}
              </h3>
              <div className="text-sm text-gray-500">Cash</div>
            </div>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          className={`w-full mt-5 bg-black text-white p-4 rounded-lg ${
            isSubmitting ? "opacity-50" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
