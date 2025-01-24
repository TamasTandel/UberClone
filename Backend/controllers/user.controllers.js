const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const blacklistTokenModel = require('../models/blacklistingToken.model')
const jwtDecode = require('jwt-decode');

const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, username, email, password, mobile } = req.body;

    const profileImagePath = req.file ? req.file.path : null;

    const isEmailExists = await userModel.findOne({ email });
    const isUsernameExists = await userModel.findOne({ username });
    const isMobileExists = await userModel.findOne({ mobile });

    if (isEmailExists || isUsernameExists || isMobileExists) {
        return res.status(400).json({
            message: isEmailExists ? 'Email already exists' : isUsernameExists ? 'Username already exists' : 'Mobile number already exists',
        });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        username,
        email,
        password: hashedPassword,
        mobile,
        profileImage: profileImagePath, // Save the path in the database
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
};


module.exports.loginUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message: 'invalide email or password'});
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message: 'invalide email or password'});
    }

    const token = user.generateAuthToken();

    const jwtDecode = require('jwt-decode');
    const decoded = jwtDecode(token);
    console.log('Token:', token);
    console.log("Decoded Token:", decoded);
    console.log("Expiration Time:", new Date(decoded.exp * 1000));
    console.log("Current Time:", new Date());
    
    res.cookie('token',token);

    res.status(200).json({token,user});
}

module.exports.getUserProfile = async (req,res,next)=>{
    res.status(200).json(req.user);
}

module.exports.logoutUser = async(req,res,next)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.slit(' ')[1];

    await blacklistTokenModel.create({token});

    res.status(200).json({message:'logged out user'});
}