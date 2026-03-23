const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUrl = process.env.MONGO_CONN;
    if (!mongoUrl) {
        throw new Error('MONGO_CONN is not defined in the environment.');
    }
    await mongoose.connect(mongoUrl);
    console.log('MongoDB Connected...');
};

module.exports = connectDB;
