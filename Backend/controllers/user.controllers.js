const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const blacklistTokenModel = require('../models/blacklistingToken.model')
const jwtDecode = require('jwt-decode');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,  
        password: hashedPassword,
    });

    // Generate token
    const token = user.generateAuthToken();

    // Decode the token
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    console.log("Expiration Time:", new Date(decoded.exp * 1000)); // Convert `exp` to readable date
    console.log("Current Time:", new Date());

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