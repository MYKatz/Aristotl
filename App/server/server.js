//server/server.js
var express = require('express');
var router = require('./routes/routes.js');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var dialogflow = require('./dialogflow.js');
var mongoose = require("mongoose");
var app = express();
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);
app.use(cors());


//Mongoose stuff
mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);
var Problem = require('./models/problem.js');

//dialogflow deets
// Email address	dialogflow-fhiitq@newagent-e0a57.iam.gserviceaccount.com
// Key ID   04573d62a9ad0cf52ac384f559dee4a5089ea55c
//console.log(dialogflow);
const df = new dialogflow("newagent-e0a57");
df.sendTextMessageToDialogFlow("Hey I need help w/ econ", "rand");
//console.log(l);

var currentSockets = {};
/* example socket object
socket : {
    gradeLevel : Integer,
    VADER: float from -1 to 1,
    problem: mongo id of problem that user created... also serves as the room id for sockets!
    uid: userid of okta user
}

*/


//websocket stuff
const io = require('socket.io')();

async function replyWithDialogFlow(socket, msg){
    var responses = await df.sendTextMessageToDialogFlow(msg, socket.id);
    //console.log(responses[0].queryResult.fulfillmentText);
    io.to(socket.id).emit("chat", responses[0].queryResult.fulfillmentText);
    if(responses[0].queryResult.action == "Initializeproblem.Initializeproblem-yes" && currentSockets[socket.id]){
        var newProblem = new Problem();
        newProblem.studentId = currentSockets[socket.id].uid;
        newProblem.isJoined = false;
        newProblem.isActive = true;
        newProblem.subject = responses[0].queryResult.outputContexts[0].parameters.fields.problem_subject.stringValue;
        newProblem.gradeLevel = currentSockets[socket.id].gradeLevel;

        newProblem.save(function(err, p){
            if(err){throw err}
            else{
                console.log("hello");
                currentSockets[socket.id].problem = p._id;
                io.to(socket.id).emit("chat", "Someone is coming soon to help you with " + responses[0].queryResult.outputContexts[0].parameters.fields.problem_subject.stringValue);
            }
        });
        //just testing right now... this should move the socket into a new namespace and room... and create a new problem object lol
    }
}

io.on("connection", function(socket){
    console.log("User connected");
    socket.on("chat", function(msg){
        //socket.broadcast.emit("chat", msg);
        //io.to(socket.id).emit("HELLO");
        replyWithDialogFlow(socket, msg);
        console.log(msg);
    })
    socket.on("draw", function(drawing){
        socket.broadcast.emit("draw", drawing);
    });
    socket.on("makeDetails", function(info){
        currentSockets[socket.id] = {
            VADER: 0., //compound vader score, implement later
            gradeLevel: info.gradeLevel,
            uid: info.sub
        }
        console.log(currentSockets);
    });

    socket.on("disconnect", function(){
        if(currentSockets[socket.id]){
            console.log("Flagging user's problem as inactive");
            Problem.findByIdAndUpdate(currentSockets[socket.id].problem, {isActive: false}, function(err, model){
                if(err){throw err}
                else{delete currentSockets[socket.id];}
            });
        }
        else{
            delete currentSockets[socket.id];
        }
    });
});

io.listen(8001); //listen on port 8001


module.exports=app;