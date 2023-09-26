const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const connect = mongoose.connect(process.env.DATABASE_URL);

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
app.use('/tasks', require('../routers/tasks.js'));
