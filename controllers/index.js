const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.DATABASE_URL);
const authMiddleWare = require('../middlewares/auth');

const socketio_initialize = require("../socket.io/base").initialize
const { createServer } = require("http");
const httpServer = createServer(app);
const cors = require("cors");
const logger = require('morgan');


connect.then(()=> {
    console.log('connected to database');
}).catch(err => {
    
    console.log("error connecting to database", "reason: " + err.message);
});

// this specifies the allowed domains
app.use(cors({
    origin: process.env.ALLOWED_DOMAINS
}));


socketio_initialize(httpServer)

app.use(logger(":method :url :status response-time =>  :response-time ms from [==:user-agent==]"));
app.use(express.json());

app.use('/auth', require('../routers/auth.js'));

app.use(authMiddleWare.verifyJWTMiddleware); 
app.use('/tasks', require('../routers/tasks.js'));


httpServer.listen(PORT, function() {
    console.log(`listening on port ${PORT}`);
});
  



