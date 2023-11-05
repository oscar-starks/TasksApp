const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.DATABASE_URL);
const authMiddleWare = require('../middlewares/auth');


connect.then(()=> {
    console.log('connected to database');
}).catch(err => {

    console.log("error connecting to database", "reason: " + err.message);
});

app.listen(PORT, function() {
    console.log(`listening on port ${PORT}`);
});
app.use(express.json());

app.use('/auth', require('../routers/auth.js'));

app.use(authMiddleWare.verifyJWTMiddleware);
app.use('/tasks', require('../routers/tasks.js'));
