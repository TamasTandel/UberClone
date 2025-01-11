const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

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

module.exports.getMapData = (req, res) => {
    res.status(200).json({ message: 'Map data accessed successfully' });
};
