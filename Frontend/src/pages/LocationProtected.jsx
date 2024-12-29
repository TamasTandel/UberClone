import React, { useState } from 'react';
import MapComponent from '../Components/MapComponent';
import LocationSearchPanel from '../Components/LocationSearchPanel';

const LocationProtected = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  const updateLocation = (location) => {
    if (!pickup) {
      setPickup(location);
    } else {
      setDestination(location);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <LocationSearchPanel setPickup={setPickup} setDestination={setDestination} />
      <MapComponent pickup={pickup} destination={destination} updateLocation={updateLocation} />
    </div>
  );
};

export default LocationProtected;
