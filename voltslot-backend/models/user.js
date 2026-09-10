const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Account Credentials 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    // Onboarding Details 
    fullName: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    evModel: {
        type: String,
        default: ""
    },
    plugType: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);