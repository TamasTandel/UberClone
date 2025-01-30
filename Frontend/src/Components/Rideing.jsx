import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rideing = ({ setRidingPanel }) => {
  const [rideStatus, setRideStatus] = useState('ongoing');
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    // Retrieve selectedRide data from localStorage
    const rideData = localStorage.getItem('selectedRide');
    if (rideData) {
      setSelectedRide(JSON.parse(rideData));
    }
  }, []);

  const completeRideHandler = async () => {
    try {
      await axios.post('http://localhost:4000/api/rides/complete', { rideId: selectedRide.id });
      await axios.put('http://localhost:4000/api/captains/status', 
        { status: 'inactive' }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setRideStatus('completed');
      alert('Ride completed successfully');
      setRidingPanel(false); // Close the riding panel after completing the ride
    } catch (error) {
      console.error('Error completing ride:', error.response?.data?.message || error.message);
      alert('Failed to complete ride');
    }
  };

  return (
    <div className="z-50">
      <h5
        className="p-1 text-center top-0 absolute text-gray-300 w-[90%] text-4xl"
        onClick={() => setRidingPanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-bold p-5">Ride Details</h3>
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
                <div className="text-sm text-gray-500">{selectedRide.pickup?.address || "Pickup location"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-2-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{selectedRide.destination?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{selectedRide.destination?.address || "Destination location"}</div>
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
      <button
        className="w-full bg-green-700 text-white font-semibold rounded-lg p-2 text-lg mt-5"
        onClick={completeRideHandler}
      >
        Complete Ride
      </button>
    </div>
  );
};

export default Rideing;
