import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      .catch((error) => console.error('Error fetching suggestions:', error));
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

  const handleSuggestionClick = (type, suggestion) => {
    if (type === 'pickup') {
      setPickupInput(suggestion.name);
      setPickupState({ lat: suggestion.lat, lng: suggestion.lng });
      setPickup({ lat: suggestion.lat, lng: suggestion.lng });
      console.log('Selected Pickup Location:', suggestion);
      setPickupSuggestions([]);
    } else if (type === 'destination') {
      setDestinationInput(suggestion.name);
      setDestinationState({ lat: suggestion.lat, lng: suggestion.lng });
      setDestination({ lat: suggestion.lat, lng: suggestion.lng });
      console.log('Selected Destination Location:', suggestion);
      setDestinationSuggestions([]);
    }
  };

  const handleSaveLocations = async () => {
    if (!pickup || !destination) {
      setMessage('Please select both pickup and destination locations.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/maps/saveLocations', {
        pickup,
        destination,
      });
      setMessage('Locations saved successfully!');
      console.log('Locations saved:', response.data);
    } catch (error) {
      setMessage('Error saving locations.');
      console.error('Error saving locations:', error.response?.data || error.message);
    }
  };

  // Automatically save locations when both are selected
  useEffect(() => {
    if (pickup && destination) {
      handleSaveLocations();
    }
  }, [pickup, destination]); // Trigger whenever pickup or destination changes

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="relative">
        <input
          type="text"
          value={pickupInput}
          onChange={handlePickupChange}
          placeholder="Enter pickup location"
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        {pickupSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto">
            {pickupSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick('pickup', suggestion)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          value={destinationInput}
          onChange={handleDestinationChange}
          placeholder="Enter destination location"
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        {destinationSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto">
            {destinationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick('destination', suggestion)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {message && <p className="text-center text-red-500 mt-2">{message}</p>}
    </div>
  );
};

export default LocationSearchPanel;
