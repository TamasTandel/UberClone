const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters']
        }
    },
    captainname: {
        type: String,
        required: true,
        minlength: [3, 'Captain name must be at least 3 characters']
    },
    mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits']
    },
    email: {
        type: String,
        required: true,
        minlength: [5, 'Email must be at least 5 characters'],
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profileImage: {
        type: String, // Store the file path or URL of the captain's image
        required: false
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'rideing'],
        default: 'inactive'
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color name must be at least 3 characters']
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters']
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1 passenger']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'auto', 'motorcycle']
        }
    },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model('captain', captainSchema);

module.exports = captainModel;
