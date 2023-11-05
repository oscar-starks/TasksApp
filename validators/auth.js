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

module.exports = {
    newUserValidator, loginValidator, emailValidator
}