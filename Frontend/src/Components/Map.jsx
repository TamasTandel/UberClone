import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline"; // For decoding polyline data

// Custom icon for live location (blue dot)
const blueDotIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M17.0839 15.812C19.6827 13.0691 19.6379 8.73845 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.36205 8.73845 4.31734 13.0691 6.91612 15.812C7.97763 14.1228 9.8577 13 12 13C14.1423 13 16.0224 14.1228 17.0839 15.812ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12Z'%3E%3C/path%3E%3C/svg%3E", // Blue dot image URL
  iconSize: [20, 20], // Size of the icon
  iconAnchor: [10, 10], // Anchor point of the icon
});

// Fix for Leaflet marker icons (fallback to default marker)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
});

const Map = () => {
  const mapRef = useRef(null); // Reference to the Leaflet map
  const [travelMode, setTravelMode] = useState("driving-car");
  const [routeDetails, setRouteDetails] = useState({ distance: "", duration: "" });
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [endCoords, setEndCoords] = useState(null); // Coordinates for the end point
  const [endMarker, setEndMarker] = useState(null); // Marker for the end point
  const [userLocation, setUserLocation] = useState(null);
  const liveLocationMarkerRef = useRef(null); // Reference for the live location marker

  useEffect(() => {
    // Initialize the Leaflet map
    const map = L.map("map", {
      center: [0, 0], // Default center
      zoom: 12, // Default zoom level
      zoomControl: true, // Allow zoom controls
    });
    mapRef.current = map;

    // Add a base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Created By TAMAS",
    }).addTo(map);

    // Get and display user's live location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords = [latitude, longitude];
          setUserLocation(userCoords); // Update state with user's location

          if (liveLocationMarkerRef.current) {
            // Update live location marker position
            liveLocationMarkerRef.current.setLatLng(userCoords);
          } else {
            // Create a new live location marker if it doesn't exist
            const liveMarker = L.marker(userCoords, {
              icon: blueDotIcon, // Use the custom blue dot icon
              title: "Your Live Location",
            })
              .addTo(map)
              .openPopup(); // Ensure popup opens immediately

            liveLocationMarkerRef.current = liveMarker;
          }

          // Center the map on the user's location without resetting zoom
          if (!map.getBounds().contains(userCoords)) {
            map.setView(userCoords, map.getZoom()); // Keep current zoom level
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Add click handler to allow marking end location
    map.on("click", (event) => {
      const { lat, lng } = event.latlng;

      // If there's an existing end marker, remove it
      if (endMarker) {
        map.removeLayer(endMarker); // Remove the existing marker
      }

      // Set new end location and place a marker
      const newEndCoords = [lat, lng];
      setEndCoords(newEndCoords);

      const marker = L.marker(newEndCoords, { title: "End Location" })
        .addTo(map)
        .bindPopup("End Location")
        .openPopup();

      setEndMarker(marker); // Store the marker reference
    });

    return () => {
      map.remove(); // Cleanup on component unmount
    };
  }, [endMarker]); // Only rerun if the end marker changes

  const handleTravelModeChange = (e) => {
    setTravelMode(e.target.value);
  };

  const calculateRoute = () => {
    if (!userLocation || !endCoords) {
      alert("Please set both start (your live location) and end locations.");
      return;
    }

    const apiKey = "5b3ce3597851110001cf62481c56779035fe43b8ab50db80f7032ba9";
    const url = `https://api.openrouteservice.org/v2/directions/${travelMode}?api_key=${apiKey}&start=${userLocation.join(",")}&end=${endCoords.join(",")}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { features } = data;
        if (features && features.length) {
          const geometry = features[0].geometry;
          const decodedPath = polyline.decode(geometry.coordinates);
          L.polyline(decodedPath, { color: "blue" }).addTo(mapRef.current);

          const { distance, duration } = features[0].properties.summary;
          setRouteDetails({ distance: `${(distance / 1000).toFixed(2)} km`, duration: `${(duration / 60).toFixed(2)} mins` });
          setShowRouteDetails(true);
        }
      })
      .catch((error) => console.error("Error fetching route data:", error));
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-[60px] bg-white p-2 z-10">
        <h1></h1>
      </div>

      <div
        id="map"
        className="absolute top-[60px] left-0 right-0 bottom-0"
        style={{ height: 'calc(100vh - 210px)' }}
      ></div>

      {showRouteDetails && (
        <div className="absolute top-5 right-5 bg-white p-3 rounded-lg z-20">
          <h4>Route Details</h4>
          <p>Distance: {routeDetails.distance}</p>
          <p>Duration: {routeDetails.duration}</p>
        </div>
      )}

      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-20 bg-white p-3 rounded-lg flex items-center">
        <label htmlFor="mode" className="mr-2">
          Travel Mode:
        </label>
        <select
          id="mode"
          value={travelMode}
          onChange={handleTravelModeChange}
          className="mr-2"
        >
          <option value="driving-car">Driving</option>
          <option value="cycling-regular">Cycling</option>
          <option value="foot-walking">Walking</option>
        </select>
        <button onClick={calculateRoute}>Calculate Route</button>
      </div>
    </div>
  );
};

export default Map;
