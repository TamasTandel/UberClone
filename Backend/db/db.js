const mongoose = require('mongoose');

function connectToDb() {
    const mongoURI = process.env.MONGODB_URI || process.env.DB_CONNECT;

    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log('Error connecting to MongoDB:', err));
}

module.exports = connectToDb;
