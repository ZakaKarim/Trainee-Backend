//Important point getting the User Model if you have separate Controller file and want to clean your App.js file or Routes file

const User = require('./../Models/user.model.js');
const bcrypt = require('bcrypt');


//Controller to get a all the Users
const getUser = async(req,res)=>{
    try {

        const data = await User.find().populate('product');
        console.log("Data is fetch from the Server");
        res.status(200).json(data)
        
    } catch (error) {
        console.log("error", error)
        res.status(500).json({Message :" Internal Server Error"})
    }
}


//Controller to Register a User
const  registerUser = async(req,res)=>{
    try {

        const data = req.body//assuming data is coming in req.body

        //Creating a new User document from the Mongoose Model 
        const newUser = new User(data);

        //Saving the user in the database taking time process  using await 
        const response = await newUser.save();
        console.log("Data is  Saved in  the DataBase");
        res.status(200).json(response);
        
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

         // Check if userId is provided
        if(!userId){
            res.status(400).json({Message : "User not found !! Error"});
            console.log("User  ID is required.")
        }
         // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found." });
        }
         // If the password is being updated, hash it
         if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10); // Hash the new password
        }
        // Update the user
        const updatedUser  = await User.findByIdAndUpdate(userId, userData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        });
        res.status(200).json(updatedUser)
        console.log("Data is Updated.... ");
        
    } catch (error) {
        console.log("Error Updating User", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//Controller to Delete a User 
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
        //console.log("User Deleted");
        res.status(200).json({Message:"User Delete Successfully"})    
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//Controller to get a Single User from the DataBase
const getSingleUser = async(req,res)=>{
    try {
        const userEmail = req.params.email;
        if(!userEmail){
            res.status(404).json({Message: "User with this email Does not exist"})
        }
        const response = await User.findOne({ email: userEmail }); // Use findOne to get a single user
        if (!response) {
            return res.status(404).json({ error: "User  not found" });
        }
        console.log("SINGLE user is fetched");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getUser,
    registerUser,
    updateUser,
    deleteUser,
    getSingleUser
}



