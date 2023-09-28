const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');
const authMiddleWare = require('../middlewares/auth');

router.get('/all/', authMiddleWare, tasksController.getTasksController);
router.post('/create/', authMiddleWare, tasksController.createTasksController);
router.get('/single/:id/', authMiddleWare, tasksController.getSingleTaskController);
router.put('/edit/:taskTitle/', authMiddleWare, tasksController.editSingleTaskController);
router.delete('/delete/:id/',  authMiddleWare,tasksController.deleteSingleTask);

module.exports = router;

