import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ConfirmRidePopUp = ({ selectedRide, setConfirmRidePopUpPanel }) => {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    console.log("Selected Ride: ", selectedRide);
  }, [selectedRide]);

  const submitHandler = (e) => {
    e.preventDefault();
    // OTP validation can be added here if needed
  };

  return (
    <div className="z-50">
      <h5
        className="p-1 text-center top-0 absolute text-gray-300 w-[90%] text-4xl"
        onClick={() => setConfirmRidePopUpPanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-bold p-5">Confirm this ride to start</h3>
      {selectedRide && (
        <>
          <div className="flex w-full items-center justify-between bg-yellow-300 rounded-full p-2">
            <div className="flex items-center gap-4">
              <img
                className="h-10 w-10 object-cover rounded-full"
                src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6"
                alt=""
              />
              <h4 className="text-lg font-bold">{selectedRide.username || "Unknown User"}</h4>
            </div>
            <h5 className="text-lg font-bold mr-3">{selectedRide.distance || "N/A"} km</h5>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-user-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{selectedRide.pickup?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{selectedRide.pickup?.address || "Unknown Address"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-2-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{selectedRide.destination?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{selectedRide.destination?.address || "Unknown Address"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2">
              <i className="ri-currency-line text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">${selectedRide.vehicle?.fee || "0.00"}</h3>
                <div className="text-sm text-gray-500">Cash</div>
              </div>
            </div>
          </div>
        </>
      )}

      <form className="w-full p-4" onSubmit={submitHandler}>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="bg-gray-200 text-lg w-full px-6 rounded-lg py-2 mt-2"
          type="number"
          placeholder="Enter OTP"
        />
        <div className="flex w-full gap-2 mt-5">
          <button
            onClick={() => setConfirmRidePopUpPanel(false)}
            className="w-full bg-red-600 text-white font-semibold rounded-lg p-2 text-lg"
          >
            Cancel
          </button>
          <Link
            to="/captain-riding"
            className="w-full flex items-center justify-center bg-green-700 text-white font-semibold rounded-lg p-2 text-lg"
          >
            Confirm
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;
