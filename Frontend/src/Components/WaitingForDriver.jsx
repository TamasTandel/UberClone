import React from 'react'

const WaitingForDriver = ({ captainDetails }) => {
  return (
    <div>
      <div>
        <h5
          className="p-1 text-center absolute top-0 text-gray-300 w-[90%] text-4xl"
          onClick={() => {
            console.log('Closing panel');
          }}
        >
          <i className="ri-arrow-down-wide-line"></i>
        </h5>
        <h3 className="text-2xl font-bold p-5">Waiting for Driver</h3>
        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="flex justify-between w-full items-center">
            <img
              className="h-20"
              src={captainDetails?.image || "https://via.placeholder.com/100"}
              alt="Captain"
            />
            <div className="text-right">
              <h2 className="font-bold text-lg">{captainDetails?.name || "Driver Name"}</h2>
              <h4 className="font-bold text-xl">{captainDetails?.vehicleNumber || "GJ 00 XX 0000"}</h4>
              <p className="text-sm text-gray-700">{captainDetails?.vehicleModel || "Vehicle Model"}</p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center gap-5 m-2 p-2 border-b-2">
              <i className="ri-map-pin-user-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{captainDetails?.pickupLocation}</h3>
                <div className="text-sm text-gray-500">Pickup Address</div>
              </div>
            </div>
            <div className="flex items-center gap-5 m-2 p-2 border-b-2">
              <i className="ri-map-pin-2-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{captainDetails?.destinationLocation}</h3>
                <div className="text-sm text-gray-500">Destination Address</div>
              </div>
            </div>
            <div className="flex items-center gap-5 m-2 p-2">
              <i className="ri-currency-line text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">${captainDetails?.fee || "0.00"}</h3>
                <div className="text-sm text-gray-500">Payment Type: Cash</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
