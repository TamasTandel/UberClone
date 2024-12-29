import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    const success = (pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition({ latitude, longitude, error: null });
    };

    const error = (err) => {
      setPosition({ latitude: null, longitude: null, error: err.message });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      setPosition((prev) => ({ ...prev, error: 'Geolocation is not supported' }));
    }
  }, []);

  return position;
};

export default useGeolocation;
