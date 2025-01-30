const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
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

router.put(
  '/update-status',
  authMiddleware.authUserOrCaptain, // Middleware to authenticate the user or captain
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('status')
      .notEmpty()
      .isIn(['Nothing', 'Looking', 'Waiting', 'Riding'])
      .withMessage('Invalid status'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await userControllers.updateUserStatus(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Profile route
router.get('/profile', authMiddleware.authUserOrCaptain, userControllers.getUserProfile);

// Logout route
router.get('/logout', authMiddleware.authUser, userControllers.logoutUser);

module.exports = router;
