var mongoose = require("mongoose");

var problemSchema = mongoose.Schema({
    studentId : String, //okta uids
    tutorId: String,
    isJoined: Boolean, //is joined by tutor
    isActive: Boolean, //is joined by student
    isOpen: Boolean, //whether problem is marked as open or closed
    subject: String,
    gradeLevel: Number,
    userbio: String,
    studentSentiment: String,
    messages: Array,
    whiteboard: String,
    GRIDid: String
});

module.exports = mongoose.model("Problem", problemSchema);