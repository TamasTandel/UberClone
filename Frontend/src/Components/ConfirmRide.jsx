import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

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
    mobile: "", // Add mobile to userProfile state
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          console.error("No token found in localStorage");
          setUserProfile({
            username: username,
            userId: "unknown",
            mobile: "", // Set default mobile
            profileImage: "profileImage",
          });
          return;
        }

        const response = await axios.get(
          `${process.env.VITE_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in headers
            },
          }
        );

        setUserProfile({
          username: response.data.username,
          userId: response.data._id,
          mobile: response.data.mobile, // Store mobile number
          profileImage: response.data.profileImage,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          username: username,
          userId: "unknown",
          mobile: "", // Set default mobile
          profileImage: "profileImage",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleConfirm = async () => {
    if (!pickupLocation || !destinationLocation) {
      alert(
        "Please ensure both pickup and destination locations are available!"
      );
      return;
    }

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
      userId: userProfile.userId,
      username: userProfile.username,
      phone: userProfile.mobile, // Include mobile number
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
      profileImage: userProfile.profileImage,
      distance: routeDistance,
      vehicle: {
        fee: vehicleFee,
        estimatedTime: travelTime,
        image: selectedVehicleImage,
      },
    };
    console.log("rideData :", rideData);
    try {
      const response = await axios.post(
        `${process.env.VITE_BASE_URL}/api/maps/save`,
        rideData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Ride confirmed and data saved successfully!");
        localStorage.setItem("rideData", JSON.stringify(rideData));
        const statusUpdateResponse = await axios.put(
          `${process.env.VITE_BASE_URL}/api/users/update-status`,
          { username: userProfile.username, status: "Looking" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (statusUpdateResponse.status === 200) {
          console.log(
            "User status updated to 'Looking':",
            statusUpdateResponse.data
          );
          setVehicleFound(true);
          setConfirmRidePanel(false);
          window.location.reload();
        } else {
          alert("Failed to update user status.");
        }
      } else {
        alert("Failed to save ride details. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        `An error occurred while confirming the ride: ${
          error.response?.data?.message || error.message
        }`
      );
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
        <img
          className="h-20"
          src={selectedVehicleImage}
          alt="Selected Vehicle"
        />
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
                {`Rider: ${userProfile.username}`}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-time-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                Travel Time:{" "}
                {travelTime ? `${travelTime} min` : "Calculating..."}
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
