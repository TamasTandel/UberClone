const locationModel = require('../models/maps.model');

module.exports.saveLocation = async ({ userId, pickup, destination }) => {
    if (!userId || !pickup || !destination) {
        throw new Error('All fields are required');
    }

    const location = await locationModel.create({
        userId,
        pickup,
        destination,
    });

    return location;
};

module.exports.getLocationsByUser = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const locations = await locationModel.find({ userId });
    return locations;
};
