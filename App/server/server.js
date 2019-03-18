//server/server.js
var express = require('express');
var router = require('./routes/routes.js')
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);
app.use(cors());



//websocket stuff
const io = require('socket.io')();

io.on("connection", function(socket){
    console.log("User connected");
    socket.on("chat", function(msg){
        socket.broadcast.emit("chat", msg);
        console.log(msg);
    })
    socket.on("draw", function(drawing){
        socket.broadcast.emit("draw", drawing);
    });
});

io.listen(8001); //listen on port 8001


module.exports=app;