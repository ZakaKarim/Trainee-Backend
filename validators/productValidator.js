const { body } = require('express-validator'); // Import express-validator

const User = require('../models/user.model.js')
// Create the validation rules for Product registration

const productValidation = [
    // Validation for 'name' field
    body('name')
    .notEmpty().withMessage('Product name is required')  // Must not be empty
    .isLength({min: 3}).withMessage("Product name must be at least 3 characters long"),

     // Validation for 'price' field
    body('price')
    .notEmpty().withMessage('Price is required')
    .isDecimal().withMessage('Price must be a valid decimal number')  // Must be a valid decimal number
    .isFloat({ min: 0.01 }).withMessage('Price must be a valid number greater than 0.01.')
    .isFloat({ max: 10000000 }).withMessage('Price must not exceed $10,000.'),
    
  // Validation for 'user_id' field (referencing the user table)
    body('user')
    .notEmpty().withMessage('User ID is required')  // User ID is required
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId')  // If MongoDB, check for valid ObjectId
    .custom(async (userId) => {
        // You can also validate if the user_id exists in the user table.
        // Example for MongoDB, using a User model to check if the user exists:
        const userExists = await User.findById(userId);  // Assuming you have a User model
        if (!userExists) {
          throw new Error('User not found in the DataBase');
        }
        return true;
      }),
];

module.exports = productValidation;