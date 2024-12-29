import React, { useEffect, useState } from "react";
import ConfirmRidePopUp from "./ConfirmRidePopUp";

const RideDetail = () => {
  const [rideDetails, setRideDetails] = useState(null);

  // Fetch ride details (simulating an API call)
  useEffect(() => {
    const fetchRideDetails = async () => {
      // Simulating a delay (e.g., an API call)
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Ride to the Airport", distance: "10km" }), 2000)
      );
      setRideDetails(data);
    };

    fetchRideDetails();
  }, []);

  return (
    <div>
      <ConfirmRidePopUp rideDetails={rideDetails} />
    </div>
  );
};

export default RideDetail;
