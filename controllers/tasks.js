const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const schema  = require('../schema/tasks')

const getTasksController = async (req, res) => {
    const tasks = await schema.taskCollection.find();
    res.json({"message":"data fetched!", "data":tasks});
}

const createTasksController = async (req, res) =>{
    const newTask = await schema.taskCollection.create({
        taskTitle:req.body.taskTitle,
        taskBody:req.body.taskBody
    });

    res.json({"message":"new task created", "data":newTask})
}

const getSingleTaskController = async (req, res) => {
    const taskID = req.params.id;
    const task = await schema.taskCollection.findById(taskID);
    if(!task) {
        res.status(404).json({"message":"task not found"});

    }else{
        res.json({"message":"task found", "data":task});
    }

}

const editSingleTaskController = async (req, res) => {
    const task = await schema.taskCollection.find({"taskTitle":req.params.taskTitle});
    console.log(task.length);

    if(task.length === 0) {
        res.status(404).json({"message":"task not found"});

    }else{
        secondTask = task[0]
        secondTask.taskTitle = req.body.taskTitle
        secondTask.save()
        res.json({"message":"task updated"});
    }
}

module.exports = {
    getTasksController, createTasksController, getSingleTaskController, editSingleTaskController
}