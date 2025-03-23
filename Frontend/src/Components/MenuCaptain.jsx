import React from 'react';

const MenuCaptain = ({ onClose, allRides, fetchRideDetails }) => {
  console.log("allRides :", allRides);
  const rides = allRides.data; // Ensure allRides is defined and has at least one ride
  console.log("rides :", rides);

  const handleFetchRideDetails = () => {
    fetchRideDetails("captainname"); // Call the fetchRideDetails function with the appropriate captain name
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-5 overflow-y-auto w-full">
      <button
        onClick={onClose}
        className="text-4xl font-bold mb-5 top-3 right-3 fixed"
      >
        <i className="ri-close-fill"></i>
      </button>
      <button
        onClick={handleFetchRideDetails}
        className="text-xl font-bold mb-5"
      >
        All Rides
      </button>
      {rides && rides.length > 0 ? (
        rides.map((ride) => (
          <div key={ride._id} className="z-50 mb-5">
            {/* <h3 className="text-2xl font-bold p-5">Ride Details</h3> */}
            <div className="flex w-full items-center justify-between bg-yellow-300 rounded-full p-2">
              <div className="flex items-center gap-4">
                <img
                  className="h-10 w-10 object-cover rounded-full"
                  src={`${process.env.VITE_BASE_URL}/${ride.profileImage}`}
                  alt="Captain"
                />
                <h4 className="text-lg font-bold">
                  {ride.username || "Unknown User"}
                </h4>
              </div>
              <h5 className="text-lg font-bold mr-3">
                {ride.distance || "N/A"} km
              </h5>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-5 p-2 border-b-2">
                <i className="ri-map-pin-user-fill text-xl"></i>
                <div>
                  <h3 className="text-lg font-medium">
                    {ride.pickup?.name || "Not Provided"}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {ride.pickup?.address || "Pickup location"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5 p-2 border-b-2">
                <i className="ri-map-pin-2-fill text-xl"></i>
                <div>
                  <h3 className="text-lg font-medium">
                    {ride.destination?.name || "Not Provided"}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {ride.destination?.address || "Destination location"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5 p-2 border-b-2">
                <i className="ri-phone-line text-xl"></i>
                <div>
                  <h3 className="text-lg font-medium">{ride.phone || "N/A"}</h3>
                  <div className="text-sm text-gray-500">Phone</div>
                </div>
              </div>
              <div className="flex items-center gap-5 p-2 border-b-2">
                <i className="ri-calendar-check-line text-xl"></i>
                <div>
                  <h3 className="text-lg font-medium">
                    {new Date(ride.confirmedAt).toLocaleString() || "N/A"}
                  </h3>
                  <div className="text-sm text-gray-500">Confirmed At</div>
                </div>
              </div>
              <div className="flex items-center gap-5 p-2">
                <i className="ri-currency-line text-xl"></i>
                <div>
                  <h3 className="text-lg font-medium">
                    ${ride.vehicle?.fee || "0.00"}
                  </h3>
                  <div className="text-sm text-gray-500">Fee</div>
                </div>
              </div>
              <div className="flex items-center gap-5 p-2">
                <i className="ri-checkbox-circle-line text-xl"></i>
                <div>
                  <h3 className="text-lg font-medium">
                    {ride.status || "N/A"}
                  </h3>
                  <div className="text-sm text-gray-500">Status</div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No rides available.</p>
      )}
    </div>
  );
};

export default MenuCaptain;
