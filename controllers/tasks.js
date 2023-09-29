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
    const task = await schema.taskCollection.find({_id:taskID, user: req.user.id})
    .then((task) => {
          res.json({"message":'Item retrieved successfully', "data":task});
      })
      .catch((error) => {
        res.status(400).json({"message":'No matching item found'});
      });

}

const editSingleTaskController = async (req, res) => {
    const taskID = req.params.id;
    const task = await schema.taskCollection.find({_id:taskID, user: req.user.id})

    .then((task) =>{
        secondTask = task[0]
        secondTask.taskBody = req.body.taskBody
        secondTask.save()
        res.json({"message":"task updated"});
    })
    .catch((err) =>{
        res.status(404).json({"message":"task not found"});
    });
 
}

const deleteSingleTask = async (req, res) => {
    const taskID = req.params.id;
    const task = await schema.taskCollection.findOneAndDelete({_id:taskID, user: req.user.id})
    .then((task) => {
        if (task) {
          res.json({"message":'Item deleted successfully', "data":task});
        } else {
          res.status(400).json({"message":'No matching item found'});

        }
      })
      .catch((error) => {
        res.status(400).json({'message':error.message})
      });
}

module.exports = {
    getTasksController, createTasksController, getSingleTaskController, editSingleTaskController, deleteSingleTask
}