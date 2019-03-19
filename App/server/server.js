//server/server.js
var express = require('express');
var router = require('./routes/routes.js')
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var dialogflow = require('./dialogflow.js');
var app = express();
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);
app.use(cors());

//dialogflow deets
// Email address	dialogflow-fhiitq@newagent-e0a57.iam.gserviceaccount.com
// Key ID   04573d62a9ad0cf52ac384f559dee4a5089ea55c
//console.log(dialogflow);
const df = new dialogflow("newagent-e0a57");
df.sendTextMessageToDialogFlow("Hey I need help w/ econ", "rand");
//console.log(l);



//websocket stuff
const io = require('socket.io')();

async function replyWithDialogFlow(socket, msg){
    var responses = await df.sendTextMessageToDialogFlow(msg, socket.id);
    //console.log(responses[0].queryResult.fulfillmentText);
    console.log(socket.id);
    io.to(socket.id).emit("chat", responses[0].queryResult.fulfillmentText);
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
});

io.listen(8001); //listen on port 8001


module.exports=app;