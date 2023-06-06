const mongoose = require('mongoose');

const QualificationSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: [
            true,
            "Degree is required"
        ],
    },
    year: {
        type: Number
    },
    institute: {
        type: String,
        required: [
            true,
            "Institute is required"
        ],
    }
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [
            true,
            "Username is required"
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
    DOB: {
        type: Date,
    },
    registrationDate: {
        type: Date,
        default : Date.now()
    },
    hobbies: {
        type: [String],
    },
    lastQualification: {
        type: [QualificationSchema]
    },
    address: {
        type:{
            street: String,
            houseNo: String,
        },
    }
},
    {
        timestamps: true
    }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;