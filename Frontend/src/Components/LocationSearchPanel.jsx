import React, { useState, useEffect } from 'react';

const LocationSearchPanel = ({ setPickup, setDestination }) => {
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [message, setMessage] = useState(''); // For feedback messages
  const [pickup, setPickupState] = useState(null); // Store selected pickup location
  const [destination, setDestinationState] = useState(null); // Store selected destination location

  const fetchSuggestions = (query, callback) => {
    if (!query) {
      callback([]);
      return;
    }

    const apiKey = '5b3ce3597851110001cf62481c56779035fe43b8ab50db80f7032ba9';
    const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${query}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const places = data.features.map((feature) => ({
          name: feature.properties.label,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
        }));
        callback(places);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
        setMessage('Failed to load suggestions');
      });
  };

  const handlePickupChange = (event) => {
    const query = event.target.value;
    setPickupInput(query);
    fetchSuggestions(query, setPickupSuggestions);
  };

  const handleDestinationChange = (event) => {
    const query = event.target.value;
    setDestinationInput(query);
    fetchSuggestions(query, setDestinationSuggestions);
  };

  const handlePickupSelect = (location) => {
    setPickupState(location);
    setPickup(location); // Update parent state for pickup
    setPickupInput(location.name);
    setPickupSuggestions([]); // Clear suggestions
  };

  const handleDestinationSelect = (location) => {
    setDestinationState(location);
    setDestination(location); // Update parent state for destination
    setDestinationInput(location.name);
    setDestinationSuggestions([]); // Clear suggestions
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-md shadow-lg w-full">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-900 font-semibold">Pickup Location</label>
        <input
          type="text"
          value={pickupInput}
          onChange={handlePickupChange}
          placeholder="Enter Pickup Location"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {pickupSuggestions.length > 0 && (
          <div className="bg-white border rounded-md shadow-md mt-2 max-h-48 overflow-y-auto">
            {pickupSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handlePickupSelect(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-600 font-semibold">Destination Location</label>
        <input
          type="text"
          value={destinationInput}
          onChange={handleDestinationChange}
          placeholder="Enter Destination Location"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {destinationSuggestions.length > 0 && (
          <div className="bg-white border rounded-md shadow-md mt-2 max-h-48 overflow-y-auto">
            {destinationSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleDestinationSelect(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {message && <p className="text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default LocationSearchPanel;
