const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, required: true },
    pickup: {
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    destination: {
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    distance: { type: Number, required: true }, // In kilometers
    vehicle: {
        // name: { type: String },
        fee: { type: Number, required: true },
        estimatedTime: { type: String, required: true },
    },
    // userLiveLocation: {
    //     lat: { type: Number, required: true },
    //     lng: { type: Number, required: true },
    // },
    confirmedAt: { type: Date, default: Date.now }, // When the user confirmed the ride
    
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
