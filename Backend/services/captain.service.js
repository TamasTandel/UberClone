const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    fullname, captainname, mobile, email, password, profileImage, vehicle
}) => {
    if (!fullname || !captainname || !mobile || !email || !password || !vehicle) {
        throw new Error('All fields are required');
    }

    const captain = await captainModel.create({
        fullname,
        captainname,
        mobile,
        email,
        password,
        profileImage,
        vehicle
    });

    return captain;
};
