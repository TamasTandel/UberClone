import React from 'react';

const Menu = ({ onClose, allRides }) => {
  console.log("allRides :", allRides);

  if (!allRides || !allRides.data || allRides.data.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-5 overflow-y-auto">
        <button onClick={onClose} className="text-4xl font-bold mb-5 top-3 right-3 fixed">
          <i className="ri-close-fill"></i>
        </button>
        <h2 className="text-2xl font-bold mb-5">All Rides</h2>
        <p>No rides available.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 p-5 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-4xl font-bold mb-5 top-3 right-3 fixed"
      >
        <i className="ri-close-fill"></i>
      </button>
      <h2 className="text-2xl font-bold mb-5">All Rides</h2>
      {allRides.data.map((ride) => (
        <div key={ride._id} className="z-50 mb-5">
          <div className="flex w-full items-center justify-between bg-yellow-300 rounded-full p-2">
            <div className="flex items-center gap-4">
              <img
                className="h-10 w-10 object-cover rounded-full"
                src={`${process.env.VITE_BASE_URL}/${ride.captain.profileImage}`}
                alt="Captain"
              />
              <h4 className="text-lg font-bold">
                {ride.captain.name || "Unknown User"}
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
              <i className="ri-car-line text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">
                  {ride.captain.type || "N/A"}
                </h3>
                <div className="text-sm text-gray-500">Vehicle Type</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-car-line text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">
                  {ride.captain.plateNumber || "N/A"}
                </h3>
                <div className="text-sm text-gray-500">
                  Vehicle Plate Number
                </div>
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
                <h3 className="text-lg font-medium">{ride.status || "N/A"}</h3>
                <div className="text-sm text-gray-500">Status</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
