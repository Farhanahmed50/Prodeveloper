const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [
            true,
            "Username is required"
        ],
    },
    email: {
        type: String,
        required: [
            true,
            "Email is required"
        ],
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [
            true,
            "Password is required"
        ],
    },
    isAdmin: {
        type: Boolean,
        required: [
            true,
            "User or Admin ?"
        ],
    }
},
    {
        timestamps: true
    }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;