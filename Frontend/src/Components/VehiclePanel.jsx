import React, { useState, useEffect } from "react";

const VehiclePanel = ({
  pickupLocation,
  destinationLocation,
  setVehiclePanel,
  setConfirmRidePanel,
  setSelectedVehicleImage,
  setFee,
  setTravelTime,
}) => {
  const [distance, setDistance] = useState(null);
  const [travelTimes, setTravelTimes] = useState({});
  const [loading, setLoading] = useState(true);

  const openRouteServiceApiKey = "5b3ce3597851110001cf62481c56779035fe43b8ab50db80f7032ba9";

  const fetchRouteDetails = async () => {
    if (!pickupLocation || !destinationLocation) return;

    const coordinates = [
      [pickupLocation.lng, pickupLocation.lat],
      [destinationLocation.lng, destinationLocation.lat],
    ];

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: openRouteServiceApiKey,
          },
          body: JSON.stringify({ coordinates }),
        }
      );

      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0].summary;
        setDistance(route.distance / 1000); // Convert meters to kilometers
        setTravelTimes({
          car: Math.ceil(route.duration / 60),
          auto: Math.ceil(route.duration / 60 * 1.2),
          bike: Math.ceil(route.duration / 60 * 0.8),
        });
      } else {
        console.error("Route not found");
      }
    } catch (error) {
      console.error("Error fetching route details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteDetails();
  }, [pickupLocation, destinationLocation]);

  const calculateFee = (distance, vehicle) => {
    let fee;
    if (vehicle === "Uber Moto") {
      fee = distance <= 1 ? 5 : 5 + (distance - 1) * 4;
    } else if (vehicle === "Uber Auto") {
      fee = distance <= 1 ? 7 : 7 + (distance - 1) * 5;
    } else {
      fee = distance <= 1 ? 8 : 8 + (distance - 1) * 6;
    }

    fee = Math.ceil(fee); // Round up to the nearest whole number
    return fee;
  };

  return (
    <div className="vehicle-panel-container">
      <h5
        className="p-1 text-center absolute top-0 text-gray-300 w-full text-4xl cursor-pointer"
        onClick={() => setVehiclePanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex justify-between p-5">
        <h3 className="text-2xl font-bold">Choose a Vehicle</h3>
        <h3 className="text-gray-900 text-xl font-bold">
          Distance:{" "}
          {loading
            ? "Loading..."
            : distance !== null
            ? `${distance.toFixed(2)} km`
            : "No route found"}
        </h3>
      </div>

      {[
        {
          name: "Uber Go",
          image:
            "https://mobile-content.uber.com/launch-experience/ride.png",
          capacity: 4,
          description: "Affordable, compact rides",
          type: "car",
        },
        {
          name: "Uber Moto",
          image:
            "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1649230978/assets/a2/553a18-2f77-4722-a4ba-f736f4cb405e/original/Uber_Moto_Orange_558x372_pixels_Desktop.png",
          capacity: 1,
          description: "Affordable Uber Moto rides",
          type: "bike",
        },
        {
          name: "Uber Auto",
          image:
            "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_768,w_1152/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
          capacity: 3,
          description: "Affordable Uber Auto rides",
          type: "auto",
        },
      ].map((vehicle, index) => (
        <div
          key={index}
          onClick={() => {
            const fee = calculateFee(distance, vehicle.name);
            setConfirmRidePanel(true);
            setVehiclePanel(false);
            setSelectedVehicleImage(vehicle.image);
            setTravelTime(travelTimes[vehicle.type]);
            setFee(fee); // Pass selected fee
          }}
          className="flex items-center w-full justify-center border-2 active:border-black rounded-xl p-1 my-2"
        >
          <img className="h-20 w-20" src={vehicle.image} alt={vehicle.name} />

          <div className="w-1/2">
            <h2 className="font-medium text-lg">
              {vehicle.name}{" "}
              <span>
                <i className="ri-user-3-fill"></i>
                {vehicle.capacity}
              </span>
            </h2>
            <h3 className="font-medium text-base">{index + 2} mins away</h3>
            <p className="font-normal text-xs text-gray-800">
              {vehicle.description}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {loading || distance === null
                ? "N/A"
                : `$${calculateFee(distance, vehicle.name).toFixed(2)}`}
            </h2>
            <p className="text-sm text-gray-600">
              {loading || !travelTimes[vehicle.type]
                ? "Calculating..."
                : `${travelTimes[vehicle.type]} min`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
