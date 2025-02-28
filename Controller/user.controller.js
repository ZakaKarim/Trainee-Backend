//Important point getting the User Model if you have separate Controller file and want to clean your App.js file or Routes file

const { validationResult } = require('express-validator');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {sendMain} = require('../utils/emailService.js');
const jwtAuthMiddleware = require('../middleware/auth.middleware.js')


//Controller to get a all the Users
const getUser = async(req,res)=>{
    try {
        // 1. Find all the users using `find()`
        const data = await User.find();
        console.log("Data is fetch from the Server");
        res.status(200).json(data)
        console.log(req.user)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({Message :" Internal Server Error"})
    }
}

//Controller to fetch a single User by its id usinf findOne
const getUserByName = async (req, res) => {
    try {
        //  Find one user by a specific id using `findOne()`
        const id = req.params.id;  // Assume the name is passed as a route parameter
        const user = await User.findOne({ _id: id });

        //Checking if the User exist in the DataBase
        if (!user) {
            return res.status(404).json({ Message: `User with name  and id ${id} not found` });
        }

        console.log(`User with id ${id} and name ${user.name} fetched`);
        res.status(200).json(user);  // Respond with the single user data

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
};

//Controller to Fetch or Find user by ID using `findById()`
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;  // Assume the ID is passed as a route parameter
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ Message: `User with ID ${userId} not found` });
        }

        console.log(`User with ID ${userId} fetched`);
        res.status(200).json(user);  // Respond with the user data

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
};


//Controller to Register a User
const  registerUser = async(req,res)=>{
    //Handle Validation Errors
    const error = validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(400).json({error: error.array()});
    }
    try {

        const data = req.body//assuming data is coming in req.body

        //Creating a new User document from the Mongoose Model 
        const newUser = new User(data);

        //Saving the user in the database taking time process  using await 
        const response = await  newUser.save();

        //if you want to send a jwt token at the time of user creationn 
        const token = response.generateAuthToken();
        //sendMain(response.email,"Welcome to our Ecommerce Project",`Hi ${response.name} Thanks you for registering! we wish you like this task`)

        //sendMain(response.email,response.name);
        //console.log("Data is  Saved in  the DataBase", response.email);

        // Send the welcome email after the user is created
        //await sendWelcomeEmail(response.email, response.username);


         // Send a response with user details and a success message
         
         res.status(200).json({message: "Register successfully", response, token});
        
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({error: "Internal Server Errror"})
    }
}

//Controller for Login the User
const loginUser = async(req,res)=>{
    try {
        // Step 1: Get user input
        const {name, password} = req.body;
        
        //checking if the user sending the information or not
        if(!name && !password){
            res.status(393).json({Message: "Username or email is required"})
        }
        // Step 2: Find user by username
        const user = await User.findOne({name});
        //console.log(name)
        if(!user){
            return res.status(401).json({ success: false, message: 'Invalid credentials User name is incorrect' });
        }

        // Step 3: Compare passwords using your model method
        //const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.comparePassword(password)
        if(!isPasswordValid){
            res.status(400).json({Message: "Password is incorrect password is incorrect"})
        }
       // console.log(password)
         //Step 4: Create JWT token
        //  const token = jwt.sign({
        //     id: user.id,
        //     name: user.name,
        //     email: user.email
        //  }, 
        //  process.env.JWT_SECRET, // Always use environment variables
        // {
        //     expiresIn: '2d'
        // }
        // );
        const token = user.generateAuthToken();
  
        
         // Step 5: Send response with token
          res.status(200).json({Message:'Login Successfully your new token is given below', token});
        
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({error: "Internal Server Errror"})
    }
}

//Controller to Update the User 
const updateUser = async(req,res)=>{
    try { 
        const userId = req.params.id; //Extract the User id from the URL parameter
        const userData = req.body; //Extract the User Data from the req.body protion

        // STEP 1: Find the user document
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found." });
        }

         const response  = await User.findByIdAndUpdate(userId, userData, {
                new: true, // Return the updated document
                runValidators: true, // Run Mongoose validation
                 
            });

            res.status(200).json(response)
            console.log("Data is Updated.... ");
        
    } catch (error) {
        console.log("Error Updating User", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//Controller to Update the User with findOneAndUpdate
const updateOneUser = async (req, res) => {
    try {
        const userId = req.params.id; // Extract the User ID from the URL parameter
        const userData = req.body; // Extract the User Data from the req.body

        // Use findOneAndUpdate to find the user and update
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },    // Filter to match user by _id
            userData,            // Data to update
            {
                new: true,        // Return the updated document
                runValidators: true,  // Run Mongoose validation
            }
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found.." });
        }

        // Send the updated user data as response
        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating user." });
    }
};


//Controller to Delete a User by findByIdAndDelete
const deleteUser = async(req,res)=>{
    try {
        const userId = req.params.id;     
        //Check if the User is Persent or not in the DataBase
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({Message: "User Not Found"});
            console.log("User with this id does not exist in the DataBase")
        }
        const response = await User.findByIdAndDelete(userId);
        console.log("User Deleted......");
        res.status(200).json({Message:"User Delete Successfully"})    
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
} 

//controller to delete a Single User using findOneAndDelete
const deleteOneUser = async(req,res)=>{
   try {
    const userId = req.params.id;

    //Checking if the user exist in the DataBase
    const user = await User.findById(userId);
    if(!user){
        res.status(404).json({Message: "User Not Found........"});
        console.log("User with this id does not exist in the DataBase")
    }

    const response = await User.findOneAndDelete({_id: userId})
    res.status(200).json({Message:" Single User Deleted Successfully"})
    console.log("User Deleted......");
   } catch (error) {
    console.log("Error:", error);
    res.status(500).json({Message: "Internal Server Error "})
   }

}






//Controller to get a Single User from the DataBase
// const getSingleUser = async(req,res)=>{
//     try {
//         const userEmail = req.params.email;
//         if(!userEmail){
//             res.status(404).json({Message: "User with this email Does not exist"})
//         }
//         const response = await User.findOne({ email: userEmail }); // Use findOne to get a single user
//         if (!response) {
//             return res.status(404).json({ error: "User  not found" });
//         }
//         console.log("SINGLE user is fetched");
//         res.status(200).json(response);
//     } catch (error) {
//         console.log("Error", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

module.exports = {
    getUser,
    getUserByName,
    getUserById,
    registerUser,
    loginUser,
    updateUser,
    updateOneUser,
    deleteUser,
    deleteOneUser
   
}



