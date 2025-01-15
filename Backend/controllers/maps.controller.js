const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const Locations = require('../models/maps.model');
const socket = require('socket.io'); // Assuming socket.io is initialized and connected
const mongoose = require('mongoose');

// Assuming this is part of your controller where ride confirmation happens
module.exports.confirmRide = async (req, res) => {
  const { rideId, captainId } = req.body;

  try {
    // Get the ride data from the database (e.g., based on rideId)
    const rideData = await Ride.findById(rideId);
    
    if (!rideData) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Send the confirmed ride data to the captains via Socket.IO
    io.emit('newRide', rideData);  // Emit the ride data to all connected captains

    res.status(200).json({ message: 'Ride confirmed', rideData });
  } catch (error) {
    console.error("Error confirming ride:", error);
    res.status(500).json({ message: "Error confirming ride", error: error.message });
  }
};


module.exports.saveLocation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, username, pickup, destination, distance, vehicle } = req.body;

    try {
        const locationData = await mapsService.saveLocation({
            userId,
            username,
            pickup,
            destination,
            distance,
            vehicle,
            // userLiveLocation,
        });

        res.status(201).json({
            message: 'Location saved successfully',
            data: locationData,
        });
    } catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ message: 'Failed to save location', error: error.message });
    }
};

module.exports.getLocationsByUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const locations = await mapsService.getLocationsByUser(userId);

        res.status(200).json({
            message: 'Locations fetched successfully',
            data: locations,
        });
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
    }
};

module.exports.getMapData = async (req, res) => {
    try {
        // Fetch all the map-related data from the database (e.g., locations, rides, etc.)
        const locations = await Locations.find();  // Replace with your model and query as needed
        
        // If no data is found, return a 404 response
        if (!locations || locations.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        // Send the fetched data as a response
        res.status(200).json({ data: locations });

    } catch (err) {
        // Catch any database errors and respond with a 500 status code
        console.error('Error fetching map data:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.getLatestRide = async (req, res) => {
    try {
        // Assuming that the latest ride for the captain is the most recent location entry.
        const latestRide = await Location.findOne().sort({ confirmedAt: -1 }).populate('userId', 'username');
        if (!latestRide) {
            return res.status(404).json({ message: 'No rides available' });
        }

        res.status(200).json({
            message: 'Latest ride fetched successfully',
            data: latestRide,
        });
    } catch (error) {
        console.error('Error fetching latest ride:', error);
        res.status(500).json({ message: 'Failed to fetch latest ride', error: error.message });
    }
};

module.exports.getAllRides = async (req, res) => {
    try {
        const rides = await Location.find().sort({ confirmedAt: -1 }); // Fetch all rides sorted by time
        res.status(200).json({
            message: 'Rides fetched successfully',
            data: rides,
        });
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ message: 'Failed to fetch rides', error: error.message });
    }
};
