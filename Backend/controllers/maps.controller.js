const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.saveLocation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination } = req.body;

    try {
        const locationData = await mapsService.saveLocation({
            userId,
            pickup,
            destination,
        });

        res.status(201).json({
            message: 'Location saved successfully',
            data: locationData,
        });
    } catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ message: 'Failed to save location', error });
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
        res.status(500).json({ message: 'Failed to fetch locations', error });
    }
};

module.exports.getMapData = (req, res) => {
    res.status(200).json({ message: 'Map data accessed successfully' });
};

module.exports.saveLocations = async (req, res) => {
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    return res.status(400).json({ message: 'Pickup and destination locations are required' });
  }

  try {
    // Create a new Location document
    const newLocation = new Location({
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      destination_lat: destination.lat,
      destination_lng: destination.lng,
    });

    // Save the location to the database
    await newLocation.save();

    res.status(201).json({ message: 'Locations saved successfully' });
  } catch (error) {
    console.error('Error saving locations:', error);
    res.status(500).json({ message: 'Error saving locations', error });
  }
};
