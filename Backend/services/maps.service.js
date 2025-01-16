const locationModel = require('../models/maps.model');

module.exports.getLocationsByUser = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const locations = await locationModel.find({ userId });
    return locations;
};

module.exports.saveLocation = async ({
    userId,
    username,
    pickup,
    destination,
    distance,
    vehicle,
    status,
    // userLiveLocation,
}) => {
    if (!userId || !username || !pickup || !destination || !distance || !vehicle ) {
        throw new Error('All fields are required');
    }

    const location = await locationModel.create({
        userId,
        username,
        pickup,
        destination,
        distance,
        vehicle,
        status,
        // userLiveLocation,
    });

    return location;
};
