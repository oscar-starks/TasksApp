const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const schema  = require('../schema/tasks')
// const connect = mongoose.connect(process.env.DATABASE_URL);

const getTasksController = async (req, res) => {
    res.json({"message": "this is the tasks controller"})
}

const createTasksController = async (req, res) =>{
    await schema.taskCollection.create({
        

    });
}

module.exports = {
    getTasksController
}