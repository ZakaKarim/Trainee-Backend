const express = require('express')
const router = express.Router();



// const {registerUser,getUser} = require('../Controller/user.controller.js');
const UserController = require('../controller/user.controller.js');

//Express Validator
const userValidation = require('../validators/userValidator.js');

//JwtAuth Middleware 
const {jwtAuthMiddleware} = require('../middleware/auth.middleware.js')

//Multer Middleware
const {upload} = require ("../middleware/multer.middleware.js")


// router.route('/').get(getUser)

//Register Route for User
router.route('/register').post(userValidation,UserController.registerUser) 


//Register Routen for User with Profile Picture 
router.route('/register-with-Profile').post(
    upload.fields([
        { 
            name: "profilePic",
            maxCount: 1
        }
    ]),
    UserController.registerUser)


//Login Route For User
router.route('/login').post(UserController.loginUser)

//Forget Password Generate OTP Route
router.route('/forgot-password').post(UserController.forgetPassword)

//Verifying OTP
router.route('/verify-otp').post(UserController.verifyOTP)

//Rest Password
router.route('/reset-password').post(UserController.resetPassword)


//Route to get all the Users using find()
//router.route('/').get(jwtAuthMiddleware,UserController.getUser)
router.route('/').get(UserController.getUser)


//Route to Fetch one user by a specific id using `findOne()`
router.route('/:id').get(UserController.getUserByName)



//Route to Find user by ID using `findById()`
router.route('/get-by-id/:id').get(UserController.getUserById)



//Put Route to update the use by using findByIdAndUpdate
router.route('/:id').put(UserController.updateUser)

//Put Toute to update  the user by using findOneAndUpdate
router.route('/get-by-id/:id').put(UserController.updateOneUser)




//Delete Route  by using findByIdAndDelete
router.route('/:id').delete(UserController.deleteUser)

//Delete Route by using findOneAndDelete
router.route('/get-by-id/:id').delete(UserController.deleteOneUser)

//Get a Single User Detail Route
//router.route('/:email').get(UserController.getSingleUser)

//Get Method to get all the User data from the Server
// router.get('/', async(req,res)=>{
//     try {

//         const data = await User.find()
//         console.log("Data is fetch from the Server");
//         res.status(200).json(data)
        
//     } catch (error) {
//         console.log("error", error)
//         res.status(500).json({error :" Internal Server Error"})
//     }
// })


 module.exports = router;