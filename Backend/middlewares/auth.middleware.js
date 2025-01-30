const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistingToken.model');
const captainModel = require('../models/captain.model');
const userModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;

// Auth Middleware for Users
module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to the request object
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token' });
        }
        console.error('AuthUser Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Auth Middleware for Captains
module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        req.captain = captain; // Attach captain to the request object
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token' });
        }
        console.error('AuthCaptain Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Auth Middleware for Map Access (Optional, extensible for additional map-related checks)
module.exports.authMapAccess = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

    try {
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findById(decoded._id) || await captainModel.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ message: 'User or Captain not found' });
        }

        // Optional: Check for specific permissions or roles (e.g., access to maps)
        if (user.role && user.role !== 'mapUser') {
            return res.status(403).json({ message: 'Access denied to map features' });
        }

        req.user = user;
        req.user = decoded;
        next();
    } catch (err) {
        console.error('AuthMapAccess Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.authUserOrCaptain = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findById(decoded._id);
    let captain = await captainModel.findById(decoded._id);

    if (!user && !captain) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user || captain;
    req.role = user ? 'user' : 'captain';
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
