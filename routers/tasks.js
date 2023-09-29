const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');
const authMiddleWare = require('../middlewares/auth');

router.get('/all/', authMiddleWare.verifyJWTMiddleware, authMiddleWare.verifyAdminMiddleware,tasksController.getTasksController);
router.post('/create/', authMiddleWare.verifyJWTMiddleware, tasksController.createTasksController);
router.get('/single/:id/', authMiddleWare.verifyJWTMiddleware, tasksController.getSingleTaskController);
router.put('/edit/:taskTitle/', authMiddleWare.verifyJWTMiddleware, tasksController.editSingleTaskController);
router.delete('/delete/:id/',  authMiddleWare.verifyJWTMiddleware,tasksController.deleteSingleTask);

module.exports = router;

