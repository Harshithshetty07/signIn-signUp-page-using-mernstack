const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
}, {
    timestamps: true
});

// REMOVE the pre-save hook because we're hashing in the controller
// This was causing double hashing!

module.exports = mongoose.model('User', UserSchema);