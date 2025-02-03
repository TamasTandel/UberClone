// import React from 'react';

// const RideDetail = ({ allRides }) => {
//   return (
//     <div className="p-5">
//       <h2 className="text-2xl font-bold mb-5">Ride Details</h2>
//       {allRides.length > 0 ? (
//         allRides.map((ride, index) => (
//           <div key={ride._id} className="mb-5 p-4 border rounded-lg shadow-md">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-4">
//                 <img
//                   className="h-10 w-10 object-cover rounded-full"
//                   src={`http://localhost:4000/${ride.captain.profileImage}`}
//                   alt="Captain"
//                 />
//                 <h4 className="text-lg font-bold">{ride.username || "Unknown User"}</h4>
//               </div>
//               <h5 className="text-lg font-bold">{ride.distance || "N/A"} km</h5>
//             </div>
//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-5 p-2 border-b-2">
//                 <i className="ri-map-pin-user-fill text-xl"></i>
//                 <div>
//                   <h3 className="text-lg font-medium">{ride.pickup?.name || "Not Provided"}</h3>
//                   <div className="text-sm text-gray-500">{ride.pickup?.address || "Pickup location"}</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-5 p-2 border-b-2">
//                 <i className="ri-map-pin-2-fill text-xl"></i>
//                 <div>
//                   <h3 className="text-lg font-medium">{ride.destination?.name || "Not Provided"}</h3>
//                   <div className="text-sm text-gray-500">{ride.destination?.address || "Destination location"}</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-5 p-2">
//                 <i className="ri-currency-line text-xl"></i>
//                 <div>
//                   <h3 className="text-lg font-medium">${ride.vehicle?.fee || "0.00"}</h3>
//                   <div className="text-sm text-gray-500">Cash</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No rides available</p>
//       )}
//     </div>
//   );
// };

// export default RideDetail;
