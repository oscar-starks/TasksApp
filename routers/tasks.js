const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');
const authMiddleWare = require('../middlewares/auth');
const validators = require('../validators/task');


router.get('/all/', authMiddleWare.verifyJWTMiddleware, authMiddleWare.verifyAdminMiddleware,tasksController.getTasksController);
router.post('/create/', authMiddleWare.verifyJWTMiddleware, validators.newTaskValidator, tasksController.createTasksController);
router.get('/single/:id/', authMiddleWare.verifyJWTMiddleware, tasksController.getSingleTaskController);
router.put('/edit/:id/', authMiddleWare.verifyJWTMiddleware, validators.editTaskValidator,tasksController.editSingleTaskController);
router.delete('/delete/:id/',  authMiddleWare.verifyJWTMiddleware,tasksController.deleteSingleTask);

module.exports = router;

