const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blacklistingToken.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the folder where images will be stored
  },
  filename: (req, file, cb) =>{
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

const upload = multer({ storage, fileFilter });

module.exports.upload = upload.single("profileImage"); // Middleware for single image upload

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, captainname, mobile, email, password, vehicle } = req.body;
        
    const profileImagePath = req.file ? req.file.path : null;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        fullname,
        captainname,
        mobile,
        email,
        password: hashedPassword,
        profileImage: profileImagePath,
        vehicle
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req,res,next)=>{
    res.status(200).json(req.captain);
}

module.exports.updateCaptainStatus = async (req, res, next) => {
    const { status } = req.body;

    if (!['active', 'inactive', 'riding'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
    const captain = await captainModel.findByIdAndUpdate(
        req.captain._id,
        { status },
        { new: true }
    );
    res.status(200).json({ message: 'Status updated successfully', captain });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
};
