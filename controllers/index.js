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

io.use((socket, next) => {
    const token = socket.request.headers.token;

    const {user,error} = authMiddleWare.socketAuthMiddleware(token);
    
    console.log(RES)

    console.log(error)
    console.log(error != null)

    if (error != null) {
        err = new Error("not authorized")
        next(err);
        socket.disconnect()
    //    return socket.emit("error", "authentication failed");

    }
    else{
        socket.headers.user = user;
        next();

     }

   
});


// setting up the socket
io.on('connection',(socket, next) => {
    console.log(socket.id);

    const token = socket.request.headers.token;
    console.log(token)


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


// io.use((socket, next) => {
//     const token = socket.request.headers.auth;
  
//     const {error, user} = ioAuthController(token);
  
//     if(error) return socket.emit("error", "an error occurred while trying to authenticate");
  
//     socket.request.userDetails = user;
  
//     next();
  
//   });
  
//   io.on("connection", async (socket) => {
  
//     const socketId = socket.id;
//     // const userDetails = socket.request.userDetails;
  
//     // const user = await connectedUsersCollection.create({
//     //   user: userDetails.userId,
//     //   socketId
//     // });
//     // const onlineUser = await userCollection.findById(userDetails.userId);

//   socket.broadcast.emit("user-online", `${socketId} is online`);

//   socket.on("disconnect", async (reason) => {});


// //   socket.on("users", async ({}, callback) => {
// //     const users = await userCollection.find({_id: {$ne: userDetails.userId}});
// //     callback(users);
//   });
 
  

 


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
  



