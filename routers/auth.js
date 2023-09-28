const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


router.post('/signup/', authController.registerUserController);
router.post('/login/', authController.loginController);

module.exports = router;

