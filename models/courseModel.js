const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "Course Name is required"
        ]
    },
    duration: {
        type: String,
        required: [
            true,
            "Duration is required"
        ]
    },
    fees: {
        type: Number,
        required: [
            true,
            "Fees is required"
        ]
    },
    shortName: {
        type: String
    },

},
    {
        timestamps: true
    }
)

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

module.exports = Course;