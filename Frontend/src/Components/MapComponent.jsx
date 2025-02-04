import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ pickup, destination , users, handleSelectUser, selectedLocation}) => {
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

    // Retrieve ride data from local storage
    const rideData = JSON.parse(localStorage.getItem('rideData'));
    if (rideData) {
      // Set pickup and destination locations from ride data
      addPickupMarker(rideData.pickup);
      addDestinationMarker(rideData.destination);
      fetchAndDisplayRoute(rideData.pickup, rideData.destination);
    }

    // Retrieve selected ride data from local storage
    const selectedRide = JSON.parse(localStorage.getItem('selectedRide'));
    if (selectedRide) {
      // Set pickup and destination locations from selected ride data
      addPickupMarker(selectedRide.pickup);
      addDestinationMarker(selectedRide.destination);
      fetchAndDisplayRoute(selectedRide.pickup, selectedRide.destination);
    }
  }, []);

  useEffect(() => {
    // Add markers for pickup and destination
    if (pickup && pickup.lat && pickup.lng) {
      addPickupMarker(pickup);
    }

    if (destination && destination.lat && destination.lng) {
      addDestinationMarker(destination);
    }

    // Fetch and display the route if both pickup and destination are set
    if (pickup && destination && pickup.lat && pickup.lng && destination.lat && destination.lng) {
      fetchAndDisplayRoute(pickup, destination);
    }
  }, [pickup, destination]); // Re-run effect if pickup or destination changes

  useEffect(() => {
    if (selectedLocation) {
      // Update the map to center on the selected location when the location is passed
      const map = L.map('map').setView([selectedLocation[1], selectedLocation[0]], 13); // lat, lng

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Create a marker for the selected location
      L.marker([selectedLocation[1], selectedLocation[0]]).addTo(map)
        .bindPopup('Selected Pickup Location')
        .openPopup();
    }
  }, [selectedLocation]);
  
  const fetchAndDisplayRoute = async (pickup, destination) => {
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

  const addPickupMarker = (pickup) => {
    if (pickup && pickup.lat && pickup.lng) {
      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], {
          icon: L.icon({
            iconUrl: 'https://cdn.gogeticon.net/files/3181885/64x64/1d7ae2d77f2d8c931ca3d4b77e2f63aa.png', // Pickup marker icon
            iconSize: [25, 25],
          }),
        }).addTo(mapRef.current);
      } else {
        pickupMarkerRef.current.setLatLng([pickup.lat, pickup.lng]);
      }
    }
  };

  const addDestinationMarker = (destination) => {
    if (destination && destination.lat && destination.lng) {
      if (!destinationMarkerRef.current) {
        destinationMarkerRef.current = L.marker([destination.lat, destination.lng], {
          icon: L.icon({
            iconUrl: 'https://cdn.gogeticon.net/files/3181885/64x64/1d7ae2d77f2d8c931ca3d4b77e2f63aa.png', // Destination marker icon
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

  return <div id="map" className="h-[90vh] w-full"></div>;
};

export default MapComponent;
