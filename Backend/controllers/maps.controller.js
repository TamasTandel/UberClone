const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const Location = require('../models/maps.model'); // Use Location consistently
const User = require('../models/user.model'); // Import the User model
const socket = require('socket.io'); // Assuming socket.io is initialized and connected
const mongoose = require('mongoose');

module.exports.confirmRide = async (req, res) => {
  const { rideId, captainId, captainName, captainProfileImage, plateNumber, capacity, vehicleType, color } = req.body;

  try {
    const rideData = await Location.findById(rideId); // Use Location here
    
    if (!rideData) {
      return res.status(404).json({ message: "Ride not found" });
    }

    rideData.captain = {
      name: captainName,
      profileImage: captainProfileImage,
      plateNumber,
      capacity,
      type: vehicleType,
      color,
    };

    await rideData.save();

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

    const { userId, username, phone, pickup, destination, distance, vehicle } = req.body;

    try {
        const locationData = await mapsService.saveLocation({
            userId,
            username,
            phone,
            pickup,
            destination,
            distance,
            vehicle,
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
        const locations = await Location.find(); // Use Location here
        if (!locations || locations.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }
        res.status(200).json({ data: locations });
    } catch (err) {
        console.error('Error fetching map data:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.getLatestRide = async (req, res) => {
    try {
        const { username } = req.query; // Assuming username is passed as a query parameter
        const rides = await Location.find({ username }).sort({ confirmedAt: -1 }); // Find all rides by username and sort by confirmedAt

        if (!rides || rides.length === 0) {
            return res.status(404).json({ message: 'No rides available for this username' });
        }

        res.status(200).json({
            message: 'Rides fetched successfully',
            data: rides,
        });
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ message: 'Failed to fetch rides', error: error.message });
    }
};

module.exports.getAllRides = async (req, res) => {
    try {
        const rides = await Location.find().sort({ confirmedAt: -1 }); // Use Location here
        res.status(200).json({
            message: 'Rides fetched successfully',
            data: rides,
        });
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ message: 'Failed to fetch rides', error: error.message });
    }
};

module.exports.getPendingRides = async (req, res) => {
    try {
        const rides = await Location.find({ status: 'pending' }).sort({ confirmedAt: -1 }); // Use Location here
        if (!rides || rides.length === 0) {
            return res.status(404).json({ message: 'No pending rides available' });
        }
        res.status(200).json({
            message: 'Pending rides fetched successfully',
            data: rides,
        });
    } catch (error) {
        console.error('Error fetching pending rides:', error);
        res.status(500).json({ message: 'Failed to fetch pending rides', error: error.message });
    }
};

module.exports.updateRideData = async (req, res) => {
  const { rideId, status, captainName, captainProfileImage, plateNumber, capacity, vehicleType, color } = req.body;

  if (!['pending', 'accepted', 'completed', 'cancel'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const ride = await Location.findById(rideId); // Use Location here

    if (!ride) {
      console.error(`Ride not found for rideId: ${rideId}`);
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.status = status;
    if (status === 'accepted') {
      ride.captain = {
        name: captainName,
        profileImage: captainProfileImage,
        plateNumber,
        capacity,
        type: vehicleType,
        color,
      };
    }
    await ride.save();

    res.status(200).json({ message: 'Ride data updated successfully', ride });
  } catch (error) {
    console.error('Error updating ride data:', error);
    res.status(500).json({ message: 'Failed to update ride data', error: error.message });
  }
};

module.exports.getRideByCaptainName = async (req, res) => {
  const { captainname } = req.params;

  try {
    const rides = await Location.find({ 'captain.name': captainname, status: 'accepted' }).populate('userId', 'username');
    if (!rides || rides.length === 0) {
      return res.status(404).json({ message: 'No rides found for this captain' });
    }

    res.status(200).json({
      message: 'Rides fetched successfully',
      data: rides,
    });
  } catch (error) {
    console.error('Error fetching rides by captain name:', error);
    res.status(500).json({ message: 'Failed to fetch rides', error: error.message });
  }
};
