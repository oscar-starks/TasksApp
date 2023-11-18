const { check, validationResult } = require('express-validator');

const newUserValidator  = [
    check('email', 'must provide a valid email').isEmail().isLength({ min: 3}),
    check('fullName', 'length should be longer than 3 characters').isLength({ min: 3}),
    check('role', 'role should be provided').isLength({ min: 3}),
    check('password', "must provide a valid password ").isLength({ min: 8}),
]

const loginValidator  = [
    check('email', 'must provide a valid email').isEmail(),
    check('password', "must provide a password"),
]

const emailValidator = [
    check('email', 'must provide a valid email'),
]

const OTPEventValidator =[
    check('otp', 'must provide a four digit otp').isLength({min:4, max:4}),
    check("event_id", 'must provide a valid event id')
]

const newPasswordValidator = [
    check("event_id", 'must provide a valid event id'),
    check('password', 'password must be provided').isLength({min:5}),
]

module.exports = {
    newUserValidator, loginValidator, 
    emailValidator, OTPEventValidator,
    newPasswordValidator
}