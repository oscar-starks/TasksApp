const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required : true,
    },
    email: {
        type:String,
        required : true,
    },
    password: {
        type:String,
        required : true,
    },
    role: {
        type:String,
        required : true,
    },
},{timestamps:true});

const userCollection = mongoose.model('users', userSchema);

module.exports = {
    userCollection
};