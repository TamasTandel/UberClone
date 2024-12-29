import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

const MapComponent = ({ pickup, destination, updateLocation }) => {
  const mapRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const liveLocationMarkerRef = useRef(null);
  const routeControlRef = useRef(null);

  const [isPickupSelected, setIsPickupSelected] = useState(null);

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      if (!isPickupSelected) {
        setPickup({ lat, lng });
        setIsPickupSelected(true);
      } else {
        setDestination({ lat, lng });
        setIsPickupSelected(false); // Reset the flag after selecting destination
      }
    };

  useEffect(() => {
    // Initialize the map
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [0, 0],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'created by TAMAS',
      }).addTo(mapRef.current);

      // Add live location marker
      trackLiveLocation();

      // Handle map clicks
      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        updateLocation({ lat, lng });
      });
    }

    // Update markers for pickup and destination
    updateMarker(pickup, 'pickup');
    updateMarker(destination, 'destination');

    // Draw route if both locations are set
    if (pickup && destination) {
      drawRoute(pickup, destination);
    }

    return () => {
      if (routeControlRef.current) {
        mapRef.current.removeControl(routeControlRef.current);
      }
    };
  }, [pickup, destination]);

  useEffect(() => {
  if (pickup && destination) {
    const bounds = new L.LatLngBounds([pickup, destination]);
    mapRef.current.fitBounds(bounds); // Adjust map view to fit both locations
  }
}, [pickup, destination]);


  const trackLiveLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!liveLocationMarkerRef.current) {
          liveLocationMarkerRef.current = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
              iconSize: [25, 25],
            }),
          }).addTo(mapRef.current);
          mapRef.current.setView([latitude, longitude], 13);
        } else {
          liveLocationMarkerRef.current.setLatLng([latitude, longitude]);
        }
      },
      (error) => {
        console.error('Error fetching live location:', error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  const updateMarker = (location, type) => {
    if (!location) return;

    const markerRef = type === 'pickup' ? pickupMarkerRef : destinationMarkerRef;

    if (markerRef.current) {
      markerRef.current.setLatLng([location.lat, location.lng]);
    } else {
      markerRef.current = L.marker([location.lat, location.lng], {
        icon: L.icon({
          iconUrl: type === 'pickup'
            ? 'https://cdn-icons-png.flaticon.com/512/854/854866.png'
            : 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [25, 25],
        }),
      }).addTo(mapRef.current);
    }
  };

  const drawRoute = (pickup, destination) => {
    const apiKey = '5b3ce3597851110001cf62481c56779035fe43b8ab50db80f7032ba9';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickup.lng},${pickup.lat}&end=${destination.lng},${destination.lat}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (routeControlRef.current) {
          mapRef.current.removeControl(routeControlRef.current);
        }

        const route = data.features[0].geometry.coordinates.map((coord) => coord.reverse());
        routeControlRef.current = L.polyline(route, { color: 'blue', weight: 5 }).addTo(mapRef.current);

        // Fit map bounds to route
        const bounds = new L.LatLngBounds(route);
        mapRef.current.fitBounds(bounds);
      })
      .catch((error) => console.error('Error fetching route:', error));
  };

  return <div id="map" className="h-full z-10"></div>;
};

export default MapComponent;
