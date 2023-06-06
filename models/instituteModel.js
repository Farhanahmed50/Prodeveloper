const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "Institute Name is required"
        ]
    },
    address: {
        type: String,
        required: [
            true,
            "Address is required"
        ]
    },
    shortName: {
        type: String
    },
    tel: {
        type: String,
        required: [
            true,
            "Phone Number is required"
        ]
    },

},
    {
        timestamps: true
    }
)

const Institute = mongoose.models.Institute || mongoose.model('Institute', InstituteSchema);

module.exports = Institute;