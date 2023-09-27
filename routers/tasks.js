const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');

router.get('/all/', tasksController.getTasksController);
router.post('/create/', tasksController.createTasksController);
router.get('/single/:id/', tasksController.getSingleTaskController);
router.put('/edit/:taskTitle/', tasksController.editSingleTaskController);
router.delete('/delete/:id/', tasksController.deleteSingleTask);

module.exports = router;

