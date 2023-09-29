const { check, validationResult } = require('express-validator');

const newTaskValidator  = [
    check('taskTitle', 'length should be longer than 3 characters').isLength({ min: 3}),
    check('taskBody', 'length should be longer than 3 characters').isLength({ min: 3}),
]

module.exports = {
    newTaskValidator
}