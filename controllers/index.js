const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.DATABASE_URL);
const authMiddleWare = require('../middlewares/auth');


const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer(app);
const io = new Server(httpServer);


const cors = require("cors");
const logger = require('morgan');

connect.then(()=> {
    console.log('connected to database');
}).catch(err => {

    console.log("error connecting to database", "reason: " + err.message);
});

io.use(async function(socket, next) {
    const token = socket.request.headers.token;
    const {user_details,error} = await authMiddleWare.socketAuthMiddleware(token);

    if (error != null) {
        err = new Error("authorization failed");
        next(err);
       return socket.emit("error", "authentication failed");

    }
    else{
        socket.request.headers.user = user_details;
        next();

     }
   
});


// setting up the socket
io.on('connection',(socket, next) => {

    socket.on("disconnect", () => {
      console.log("User disconnected")
    });

    socket.on("message", (message) => {
        console.log(message);
        io.emit("message", "chicken kitchen")

        // socket.broadcast.emit("message", "chicken kitchen")

        // socket.emit emits the message to the user that is connected or the user that sends the data
        // while io.emit sends the message to everyone that's connected
        // the socket.broadcast.emit sends the message to everyone except the sender
        
    });


});

// this specifies the allowed domains
app.use(cors({
    origin: process.env.ALLOWED_DOMAINS
}));

// this makes the server to be accessible to all origins
// app.use(cors())

app.use(logger(":method :url :status response-time =>  :response-time ms from [==:user-agent==]"));
app.use(express.json());

app.use('/auth', require('../routers/auth.js'));

app.use(authMiddleWare.verifyJWTMiddleware); 
app.use('/tasks', require('../routers/tasks.js'));


httpServer.listen(PORT, function() {
    console.log(`listening on port ${PORT}`);
});
  



