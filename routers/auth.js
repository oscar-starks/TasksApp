const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const validators = require('../validators/auth');



router.post('/signup/',validators.newUserValidator, authController.registerUserController);
router.post('/login/',validators.loginValidator, authController.loginController);

module.exports = router;

