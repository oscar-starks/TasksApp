const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const validators = require('../validators/auth');



router.post('/signup/',validators.newUserValidator, authController.registerUserController);
router.post('/login/',validators.loginValidator, authController.loginController);
router.post('/accountRecovery/',validators.emailValidator,authController.accountRecoveryController);
router.post('/verifyRecovery/',validators.OTPEventValidator,authController.confirmOTPController);
router.post('/new-password/',validators.newPasswordValidator, authController.newPasswordController);

module.exports = router;

