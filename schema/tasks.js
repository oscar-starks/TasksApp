const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    taskTitle: {
        type:String,
        required : true,
    },
    taskBody: {
        type:String,
        required : true,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"users",
        
    }
},{timestamps:true});

const taskCollection = mongoose.model('tasks', taskSchema);

module.exports = {
    taskCollection
};