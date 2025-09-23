
const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/signin-signup-page', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

}

module.exports = connectDB;