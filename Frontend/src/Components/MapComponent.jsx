import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapComponent = ({ pickup, destination }) => {
  const mapRef = useRef(null);
  const liveLocationMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const routeLayerRef = useRef(null); // Ref for the route layer

  const openRouteServiceApiKey = '5b3ce3597851110001cf62481c56779035fe43b8ab50db80f7032ba9';

  useEffect(() => {
    // Initialize the map
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [0, 0], // Default center
        zoom: 13, // Default zoom level
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Track live location on map initialization
      trackLiveLocation();
    }
  }, []);

  useEffect(() => {
    // Add markers for pickup and destination
    if (pickup && pickup.lat && pickup.lng) {
      addPickupMarker();
    }

    if (destination && destination.lat && destination.lng) {
      addDestinationMarker();
    }

    // Fetch and display the route if both pickup and destination are set
    if (pickup && destination && pickup.lat && pickup.lng && destination.lat && destination.lng) {
      fetchAndDisplayRoute();
    }
  }, [pickup, destination]); // Re-run effect if pickup or destination changes

  const fetchAndDisplayRoute = async () => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${openRouteServiceApiKey}&start=${pickup.lng},${pickup.lat}&end=${destination.lng},${destination.lat}`
      );

      const coordinates = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

      // Remove any existing route layer before adding a new one
      if (routeLayerRef.current) {
        mapRef.current.removeLayer(routeLayerRef.current);
      }

      // Add the new route layer
      routeLayerRef.current = L.polyline(coordinates, { color: 'blue', weight: 4 }).addTo(mapRef.current);

      // Fit the map bounds to the route
      mapRef.current.fitBounds(routeLayerRef.current.getBounds());
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const addPickupMarker = () => {
    if (pickup && pickup.lat && pickup.lng) {
      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], {
          icon: L.icon({
            iconUrl: 'https://imgs.search.brave.com/q46mmMlMuUjLVAQ5Sms89zZh_ebyQ9lF46Ey_t3hv6I/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Z29nZXRpY29uLm5l/dC9maWxlcy8zMTIx/Mjg3LzY0eDY0L2Nj/NDk5NDI3YjNlNDM2/MTg2ZjhhYmUzM2Nm/YWYzYjc4LnBuZw', // Pickup marker icon
            iconSize: [25, 25],
          }),
        }).addTo(mapRef.current);
      } else {
        pickupMarkerRef.current.setLatLng([pickup.lat, pickup.lng]);
      }
    }
  };

  const addDestinationMarker = () => {
    if (destination && destination.lat && destination.lng) {
      if (!destinationMarkerRef.current) {
        destinationMarkerRef.current = L.marker([destination.lat, destination.lng], {
          icon: L.icon({
            iconUrl: 'https://imgs.search.brave.com/q46mmMlMuUjLVAQ5Sms89zZh_ebyQ9lF46Ey_t3hv6I/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Z29nZXRpY29uLm5l/dC9maWxlcy8zMTIx/Mjg3LzY0eDY0L2Nj/NDk5NDI3YjNlNDM2/MTg2ZjhhYmUzM2Nm/YWYzYjc4LnBuZw', // Destination marker icon
            iconSize: [25, 25],
          }),
        }).addTo(mapRef.current);
      } else {
        destinationMarkerRef.current.setLatLng([destination.lat, destination.lng]);
      }
    }
  };

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
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Custom live location marker icon
              iconSize: [25, 25],
            }),
          }).addTo(mapRef.current);

          // Center the map on the user's location
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

  return <div id="map" className="h-[70vh] w-full"></div>;
};

export default MapComponent;
