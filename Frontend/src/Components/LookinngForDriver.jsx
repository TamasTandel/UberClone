import React from "react";

const LookinngForDriver = ({
  setVehicleFound,
  selectedVehicleImage,
  pickupLocation,
  destinationLocation,
  vehicleFee,
  travelTime,
}) => {
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
        <img className="h-30" src={selectedVehicleImage} alt="Vehicle" />
        <div className="w-full">
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-map-pin-user-fill text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <div className="text-sm">{pickupLocation?.name || "Pickup Address"}</div>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-map-pin-2-fill text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <div className="text-sm">{destinationLocation?.name || "Destination Address"}</div>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2 border-b-2">
            <i className="ri-time-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">
                Travel Time: {travelTime ? `${travelTime} mins` : "Calculating..."}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-5 m-2 p-2">
            <i className="ri-currency-line text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">Cash</h3>
              <div className="text-lg">${vehicleFee || "not found"}</div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setVehicleFound(true)}
          className="w-full mt-5 bg-green-700 text-white font-semibold rounded-lg p-2 text-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default LookinngForDriver;
