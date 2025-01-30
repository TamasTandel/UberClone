const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancel'], default: 'pending' },
    username: { type: String, required: true },
    phone: { type: String, required: true },
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
        fee: { type: Number, required: true },
        estimatedTime: { type: String, required: true },
    },
    confirmedAt: { type: Date, default: Date.now }, // When the user confirmed the ride
    captain: {
        name: { type: String },
        profileImage: { type: String },
        plateNumber: { type: String },
        capacity: { type: Number },
        type: { type: String },
        color: { type: String },
    },
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
