var mongoose = require("mongoose");

var problemSchema = mongoose.Schema({
    studentId : String, //okta uids
    tutorId: String,
    isJoined: Boolean, //is joined by tutor
    isActive: Boolean,
    subject: String,
    gradeLevel: Number
});

module.exports = mongoose.model("Problem", problemSchema);