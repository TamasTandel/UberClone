const express = require('express');
const { body } = require('express-validator');
const mapsController = require('../controllers/maps.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authMapAccess } = require('../middlewares/auth.middleware');
const Location = require('../models/maps.model');

const router = express.Router();

router.get('/mapData', authMapAccess, mapsController.getMapData);

router.post(
    '/save',
    authMiddleware.authUser,
    [
        body('pickup.name').notEmpty().withMessage('Pickup name is required'),
        body('pickup.coordinates.lat').isNumeric().withMessage('Valid pickup latitude is required'),
        body('pickup.coordinates.lng').isNumeric().withMessage('Valid pickup longitude is required'),
        body('destination.name').notEmpty().withMessage('Destination name is required'),
        body('destination.coordinates.lat').isNumeric().withMessage('Valid destination latitude is required'),
        body('destination.coordinates.lng').isNumeric().withMessage('Valid destination longitude is required'),
    ],
    mapsController.saveLocation
);

router.get(
    '/user/:userId',
    authMiddleware.authUser,
    mapsController.getLocationsByUser
);

router.post('/saveLocations', async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body

        const { pickup, destination } = req.body;

        if (!pickup || !pickup.lat || !pickup.lng || !destination || !destination.lat || !destination.lng) {
            return res.status(400).json({ error: 'Invalid pickup or destination format.' });
        }

        const location = new Location({ pickup, destination });
        await location.save();

        res.status(200).json({ message: 'Locations saved successfully!', location });
    } catch (error) {
        console.error('Error saving location:', error.message); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
