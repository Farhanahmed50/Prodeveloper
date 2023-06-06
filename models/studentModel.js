const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [
            true,
            "First Name is required"
        ]
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [
            true,
            "Email address is required"
        ],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [
            true,
            "Password is required"
        ],
    },
    contact: {
        type: String,
        required: [
            true,
            "Contact Number is required"
        ]
    },
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],

},
    {
        timestamps: true
    }
)

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

module.exports = Student;