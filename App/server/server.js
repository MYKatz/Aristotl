//server/server.js
var express = require('express');
var router = require('./routes/routes.js');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var dialogflow = require('./dialogflow.js');
var okta = require('@okta/okta-sdk-nodejs');
var mongoose = require("mongoose");
var vader = require('vader-sentiment');
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


// Okta stuff
const oktaClient = new okta.Client({
    orgUrl: "https://dev-994297.okta.com/",
    token: "00jjwA-cffmIKzA_M50v-0Ke-R2hHNmMKJhXEoJyN3",
    requestExecutor: new okta.DefaultRequestExecutor()
});


//dialogflow deets
// Email address	dialogflow-fhiitq@newagent-e0a57.iam.gserviceaccount.com
// Key ID   04573d62a9ad0cf52ac384f559dee4a5089ea55c
const df = new dialogflow("newagent-e0a57");
df.sendTextMessageToDialogFlow("Hey I need help w/ econ", "rand");

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
        newProblem.isActive = false;
        newProblem.isOpen = true;
        newProblem.subject = responses[0].queryResult.outputContexts[0].parameters.fields.problem_subject.stringValue.toLowerCase();
        newProblem.gradeLevel = currentSockets[socket.id].gradeLevel;
        newProblem.userbio = currentSockets[socket.id].bio;
        newProblem.messages = [];
        if(currentSockets[socket.id].VADER < -.05){
            newProblem.studentSentiment = "negative";
        }
        else if(currentSockets[socket.id].VADER > .05){
            newProblem.studentSentiment = "positive";
        }
        else{
            newProblem.studentSentiment = "neutral";
        }

        newProblem.save(function(err, p){
            if(err){throw err}
            else{
                currentSockets[socket.id].problem = p._id;
                oktaClient.getUser(currentSockets[socket.id].uid)
                .then(user => {
                    if(user.profile.credits > 0){
                        user.profile.credits -= 1;
                        user.update()
                        .then(() => {
                            io.to(socket.id).emit("chat", "A credit has been deducted from your account. You will be redirected to your private room shortly");
                            io.to(socket.id).emit("redirect", p._id);
                        });
                    }
                    else{
                        io.to(socket.id).emit("chat", "Wait! You don't have enough credits!");
                    }
                })
            }
        });
        //just testing right now... this should move the socket into a new namespace and room... and create a new problem object lol
    }
}

io.on("connection", function(socket){
    socket.on("chat", function(msg){
        var sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(msg).compound; //vader sentiment compount score.. negative<-.05<neutral<.05<positive
        if(currentSockets[socket.id].VADER == 0.){
            //initialize vader score
            currentSockets[socket.id].VADER = sentiment;
        }
        else{
            //compute exponentially weighted moving average with beta = .8 (5 items)
            currentSockets[socket.id].VADER = (0.8) * currentSockets[socket.id].VADER + (1 - 0.8) * sentiment
        }
        console.log(currentSockets[socket.id].VADER);
        replyWithDialogFlow(socket, msg);
    })
    socket.on("draw", function(drawing){
        socket.broadcast.emit("draw", drawing);
    });
    socket.on("makeDetails", function(info){
        currentSockets[socket.id] = {
            VADER: 0., //compound vader score, implement later
            gradeLevel: info.gradeLevel,
            uid: info.sub,
            bio: info.bio
        }
    });

    socket.on("disconnect", function(){
        if(currentSockets[socket.id]){
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

var priv = io.of('/private')

privatesockets = {}

priv.on('connection', function(socket){

    //custom variables per socket
    var room = "";
    var isStudent = null;

    socket.on('makeDetails', function(info){
        //activate room when student joins
        Problem.findById(info.room, function(err, p){
            if(p){
                if(!info.data.isTutor){
                    p.isActive = true;
                    p.save(function(err, doc){
                        if(err){throw err;}
                        else{
                            //success!
                            socket.join(info.room);
                            room = info.room;
                            isStudent = true;
                            priv.to(socket.id).emit("messages", doc.messages);
                            priv.to(socket.id).emit("draw", doc.whiteboard || " ");
                        }
                    });
                }

                else{
                    p.isJoined = true;
                    p.save(function(err, doc){
                        if(err){throw err;}
                        else{
                            socket.join(info.room);
                            room = info.room;
                            isStudent = false;
                            msges = doc.messages.map(function(curr){
                                curr.id = (curr.id + 1) % 2;
                                return curr;
                            });
                            priv.to(socket.id).emit("messages", msges);
                            priv.to(socket.id).emit("draw", doc.whiteboard || " ");
                        }
                    });
                }
            }
            else{
                //handle invalid room?
            }
        });
    });

    socket.on("chat", function(msg){
        socket.to(room).emit('chat', msg);
        Problem.findById(room, function(err, p){
            if(p){
                var id = isStudent ? 0 : 1;
                p.messages.push({id: id, message: msg});
                p.save();
            }
        });
    });

    socket.on("draw", function(drawing){
        socket.to(room).emit('draw', drawing);
        Problem.findById(room, function(err, p){
            if(p){
                p.whiteboard = drawing;
                p.save();
            }
        });
    });

    socket.on("close", function(m){
        if(isStudent){
            Problem.findById(room, function(err, p){
                if(p){
                    p.isOpen = false;
                    p.save();
                }
            });
        }
    });

    socket.on("disconnect", function(){
        Problem.findById(room, function(err, p){
            if(p){
                if(isStudent){
                    p.isActive = false;
                    p.save(function(err, doc){
                        if(err){throw err}
                    })
                }
                else{
                    //tutor leaves, assume that student still wants it open :)
                    p.isJoined = false;
                    p.save(function(err, doc){
                        if(err){throw err;}
                    });
                }
            }
            else{
                //invalid room, nothing necessary
            }
        });
    });

});

io.listen(8001); //listen on port 8001


module.exports=app;