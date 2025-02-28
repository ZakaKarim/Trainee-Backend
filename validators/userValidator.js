const { body } = require('express-validator'); // Import express-validator
// Create the validation rules for user registration

const userValidation = [
    body('name')
    .notEmpty().withMessage('Name is required')  // Must not be empty
    .isLength({min: 3}).withMessage("Name must be at least 3 characters long"),//Must have a three characters in it 
    body('email').isEmail().withMessage("Please enter a valid email address."),
    body('password').isLength({min: 3}).withMessage("Password must be at least of 3 Characters"),
];

module.exports = userValidation;  // Export validation rules