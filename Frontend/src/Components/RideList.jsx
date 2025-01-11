import React from 'react';

const RideList = ({ users, handleSelectUser }) => {
  return (
    <div className="ride-list-container">
      {users.map((user, index) => (
        <div 
          key={index} 
          className="ride-item p-4 mb-4 bg-gray-100 rounded-lg shadow-md cursor-pointer"
          onClick={() => handleSelectUser(user)}
        >
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-sm">Pickup: {user.location.lat}, {user.location.lng}</p>
          <p className="text-sm">Destination: {user.destination.lat}, {user.destination.lng}</p>
          <p className="text-sm">Distance: {user.distance} km</p>
          <p className="text-sm">Fee: ${user.fee}</p>
        </div>
      ))}
    </div>
  );
};

export default RideList;
