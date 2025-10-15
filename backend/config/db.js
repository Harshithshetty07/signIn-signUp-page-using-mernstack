
const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signin-signup-page', {

    });

}

module.exports = connectDB;