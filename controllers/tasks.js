const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const schema  = require('../schema/tasks')

const getTasksController = async (req, res) => {
    const tasks = await schema.taskCollection.find();
    res.json({"message":"data fetched!", "data":tasks});
}

const createTasksController = async (req, res) =>{
    console.log(req.body.taskTitle, "-------------------------------------------")
    const newTask = await schema.taskCollection.create({
        taskTitle:req.body.taskTitle,
        taskBody:req.body.taskBody
    });

    res.json({"message":"new task created", "data":newTask})
}

module.exports = {
    getTasksController, createTasksController
}