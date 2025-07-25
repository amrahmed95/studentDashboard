require('dotenv').config();

const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

if (!mongoURI) {
    console.error("MONGO_URI is not defined in the environment variables.");
    process.exit(1);
}

async function connectToDB() {
    // Establish the connection
    mongoose.connect(mongoURI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error.message);

            // Handle specific error conditions
            if (error.name === 'MongoNetworkError') {
                console.error('Network error occurred. Check your MongoDB server.');
            } else if (error.name === 'MongooseServerSelectionError') {
                console.error('Server selection error. Ensure MongoDB is running and accessible.');
            } else {
                // Handle other types of errors
                console.error('An unexpected error occurred:', error);
            }
        });

    // Handling connection events
    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });

    db.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });

    // Gracefully close the connection when the application exits
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose connection is disconnected due to application termination');
            process.exit(0);
        });
    });
}

module.exports = {
    connectToDB,
    port
};
