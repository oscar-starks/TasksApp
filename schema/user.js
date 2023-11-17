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
        enum:['admin', 'user'],
        default:'user',
        required : true,
    },
},{timestamps:true});


const accountRecoverySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"users",        
    },
    otp : {
        type:String,
        required : true,
    },
    verified : {
        type:Boolean,
        required : true,
        default : false
    },
    used : {
        type:Boolean,
        required : true,
        default : false
    }

})

const recoverySchema = mongoose.model('RecoverySchema', accountRecoverySchema);
const userCollection = mongoose.model('users', userSchema);

module.exports = {
    userCollection,
    recoverySchema,
};