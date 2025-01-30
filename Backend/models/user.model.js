const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
        },
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensures usernames are unique
    },
    email: {
        type: String,
        required: true,
        minlength: [5, 'Email must be at least 5 characters long'],
        unique: true, // Ensures emails are unique
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    mobile: {
        type: String,
        required: true,
        unique: true, // Ensures mobile numbers are unique
    },
    profileImage: {
        type: String, // URL or path to the uploaded image
    },
    status: {
        type: String,
        enum: [ 'Nothing', 'Looking', 'Waiting', 'Riding'], // Restricted to these statuses
        default: 'Nothing', // Default status
    },
    socketId: {
        type: String,
    },
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
