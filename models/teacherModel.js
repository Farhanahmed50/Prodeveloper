const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "Name is required"
        ]
    },
    email: {
        type: String,
        required: [
            true,
            "Email address is required"
        ],
        lowercase: true
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

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;