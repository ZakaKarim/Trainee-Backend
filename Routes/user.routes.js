const express = require('express')
const router = express.Router();



// const {registerUser,getUser} = require('../Controller/user.controller.js');
const UserController = require('../controller/user.controller.js');
const userValidation = require('../validators/userValidator.js');


// router.route('/').get(getUser)
//Register Route
router.route('/register').post(userValidation,UserController.registerUser) 

//Get Route
router.route('/').get(UserController.getUser)

//Put Route
router.route('/:id').put(UserController.updateUser)

//Delete Route
router.route('/:id').delete(UserController.deleteUser)

//Get a Single User Detail Route
router.route('/:email').get(UserController.getSingleUser)

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