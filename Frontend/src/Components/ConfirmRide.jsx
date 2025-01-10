import React, { useState, useEffect } from "react";

const ConfirmRide = ({
  setConfirmRidePanel,
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
              <h3 className="text-lg font-medium">${vehicleFee || "N/A"}</h3>
              <div className="text-sm text-gray-500">Cash</div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setVehicleFound(true);
            setConfirmRidePanel(false);
          }}
          className="w-full mt-5 bg-black text-white p-4 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
