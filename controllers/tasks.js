const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const schema  = require('../schema/tasks');     
const {validationResult } = require('express-validator');

const getTasksController = async (req, res) => {
    const tasks = await schema.taskCollection.find();
    res.json({"message":"data fetched!", "data":tasks});
}

const createTasksController = async (req, res) =>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newTask = await schema.taskCollection.create({
        taskTitle:req.body.taskTitle,
        taskBody:req.body.taskBody,
        user:req.user.id,
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

    if(task.length === 0) {
        res.status(404).json({"message":"task not found"});

    }else{
        secondTask = task[0]
        secondTask.taskTitle = req.body.taskTitle
        secondTask.save()
        res.json({"message":"task updated"});
    }
}

const deleteSingleTask = async (req, res) => {
    const task = await schema.taskCollection.findByIdAndDelete(req.params.id)
    .then((deletedItem) => {
        if (deletedItem) {
          res.json({"message":'Item deleted successfully', "data":deletedItem});
        } else {
          res.status(400).json({"message":'No matching item found.:', "data":deletedItem});

        }
      })
      .catch((error) => {
        res.status(400).json({'message':error.message})
      });

}

module.exports = {
    getTasksController, createTasksController, getSingleTaskController, editSingleTaskController, deleteSingleTask
}