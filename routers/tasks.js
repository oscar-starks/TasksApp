const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');

router.get('/all/', tasksController.getTasksController);

module.exports = router;

