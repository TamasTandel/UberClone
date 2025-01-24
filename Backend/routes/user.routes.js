const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, check } = require('express-validator');
const userControllers = require('../controllers/user.controllers');
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

// Register route
router.post(
  '/register',
  upload.single('profileImage'), // This will handle the image upload
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname')
      .notEmpty()
      .isString()
      .withMessage('First name is required'),
    body('fullname.lastname')
      .optional()
      .isString()
      .withMessage('Last name must be a string'),
    body('username').notEmpty().withMessage('Username is required'),
    body('mobile')
      .isMobilePhone()
      .withMessage('Invalid mobile number'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  userControllers.registerUser
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  userControllers.loginUser
);

// Profile route
router.get('/profile', authMiddleware.authUser, userControllers.getUserProfile);

// Logout route
router.get('/logout', authMiddleware.authUser, userControllers.logoutUser);

module.exports = router;
