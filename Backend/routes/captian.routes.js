const captainController = require('../controllers/captain.controllers');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');

// Multer setup to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder to save the image
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/register',
    upload.single('profileImage'), // This will handle the image upload
    [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
    body('captainname').isLength({ min: 3 }).withMessage('Captain name must be at least 3 characters'),
    body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type')
], captainController.registerCaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], captainController.loginCaptain);

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

router.put('/status', authMiddleware.authCaptain, captainController.updateCaptainStatus);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;
