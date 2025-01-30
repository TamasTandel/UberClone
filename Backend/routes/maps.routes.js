const express = require('express');
const { body } = require('express-validator');
const mapsController = require('../controllers/maps.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authMapAccess } = require('../middlewares/auth.middleware');
const Location = require('../models/maps.model');
const jwt = require("jsonwebtoken");
const router = express.Router();

// Route to get map data with access control
router.get('/mapData', authMapAccess, mapsController.getMapData);

// Route to get locations by user, with authentication
router.get(
    '/user/:userId',
    authMiddleware.authUser,
    mapsController.getLocationsByUser
);

// Route to save location with validation and authentication
router.post(
    '/save',
    authMiddleware.authUser,
    [
        body('pickup.name').notEmpty().withMessage('Pickup name is required'),
        body('pickup.lat').isNumeric().withMessage('Pickup latitude is required'),
        body('pickup.lng').isNumeric().withMessage('Pickup longitude is required'),
        body('destination.name').notEmpty().withMessage('Destination name is required'),
        body('destination.lat').isNumeric().withMessage('Destination latitude is required'),
        body('destination.lng').isNumeric().withMessage('Destination longitude is required'),
        body('distance').isNumeric().withMessage('Distance is required'),
        // body('vehicle.name').notEmpty().withMessage('Vehicle name is required'),
        body('vehicle.fee').isNumeric().withMessage('Vehicle fee is required'),
        body('vehicle.estimatedTime').notEmpty().withMessage('Vehicle estimated time is required'),
        // body('userLiveLocation.lat').isNumeric().withMessage('User live location latitude is required'),
        // body('userLiveLocation.lng').isNumeric().withMessage('User live location longitude is required'),
    ],
    mapsController.saveLocation
);

// Route to get the latest ride for the captain
router.get('/latestRide', mapsController.getLatestRide);
router.get('/pendingRides', authMapAccess, mapsController.getPendingRides);

router.get('/getData', authMapAccess, mapsController.getMapData);
// router.get('/ride/:userId', authMiddleware.authUserOrCaptain, mapsControllers.getRideData);

router.get('/rides', mapsController.getAllRides);
router.put('/updateRideData', authMiddleware.authUserOrCaptain, mapsController.updateRideData);
router.get('/rideByCaptainName/:captainname', authMiddleware.authCaptain, mapsController.getRideByCaptainName);

module.exports = router;
