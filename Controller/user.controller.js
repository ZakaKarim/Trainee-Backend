//Important point getting the User Model if you have separate Controller file and want to clean your App.js file or Routes file

const { validationResult } = require('express-validator');
const User = require('../models/user.model.js');
const {sendMain,forgetMail} = require('../utils/emailService.js');
const generateOTP = require('otp-generator');
const jwtAuthMiddleware = require('../middleware/auth.middleware.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {uploadOnCloudinary} = require("../utils/cloudinary.js")


//Controller to get a all the Users
const getUser = async(req,res)=>{
    try {
        // 1. Find all the users using `find()`
        const data = await User.find();
        console.log("Data is fetch from the Server");
        res.status(200).json(data)
        //console.log(req.user)
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


//Controller to Register a User with profile pictures with .feild method
const  registerUser = async(req,res)=>{
    //Handle Validation Errors
    const error = validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(400).json({error: error.array()});
    }
    try {

        const data = req.body//assuming data is coming in req.body

          //checking if the profile picture is given in the req.files
          const loaclProfilePic = req.files?.profilePic[0]?.path;
           console.log("Req.files: ",req.files)

          const  loaclbirthCertifcate = req.files?.birthCertifcate[0]?.path;
  
          //check this condition if the profilePicv than check first before moving next is a required field in your model 
          //if(!loaclProfilePic){
          //    res.status(200).json({Messsage: "Profile Pic is required"})
         // }


        //Uplodaing Pictures on Cloudinary 
        const profilePic = await uploadOnCloudinary(loaclProfilePic)
        console.log("Profile Picture is:", profilePic)

        //Uploading birthCertifcate on Cloudinary

        const birthCertifcate = await uploadOnCloudinary(loaclbirthCertifcate)
        console.log("birthCertifcate Picture is:", birthCertifcate)

        //check this condition if the profilePic is not uploade  if its  a required field in your model 
        // if(!birthCertifcate){
        //     res.status(200).json({Messsage: "birthCertifcate Pic is required for cloudinary"})
        // }


        //Creating a new User document from the Mongoose Model 
        const newUser = new User({
            name: data.name,
            email: data.email,
            profilePic: profilePic?.url || "",
            birthCertifcate: birthCertifcate?.url || "",
            password: data.password

        });
      

        //Saving the user in the database taking time process  using await 
        const response = await  newUser.save();


        //if you want to send a jwt token at the time of user creationn 
        const token = response.generateAuthToken();

        //Agar sab kuch yah send karnai hai like html mainly
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

//Method to upload a Single File
const handleSingleUpload  = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const cloudResponse = await uploadOnCloudinary(req.file.path);
      return res.status(200).json({
        message: "File uploaded successfully",
        url: cloudResponse.secure_url
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: "Error in single file upload"
      });
    }
  };


//Method to upload a Array File upload
const handleArrayUpload = async( req,res)=>{
    try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No files uploaded" });
        }
    
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const cloudResponses = await Promise.all(uploadPromises);
        
        const results = cloudResponses.map(response => ({
          fieldName: response.original_filename,
          url: response.secure_url
        }));
        
        return res.status(200).json({
          message: "Files uploaded successfully",
          results
        });
      } catch (error) {
        console.log("Error:",error)
        return res.status(500).json({
            message: "Error in array uploading"
          });
    }
}


const handleAnyUpload = async(req,res)=>{
    try {
        if(!req.files || req.files.length === 0){
            res.status(404).json({message: "No file is upload ...."})
        }
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const cloudResponses = await Promise.all(uploadPromises);
    
    const results = cloudResponses.map(response => ({
      fieldName: response.original_filename,
      url: response.secure_url
    }));
    
    return res.status(200).json({
      message: "Files uploaded successfully",
      results
    });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Error in any upload"
          });
    }
}


const handleFieldsUpload = async(req,res)=>{
    try {
        // Step 1: Check if files exist
        if(!req.files){
            res.status(404).json({Message: "No file is uploaded"})
        }
        // Step 2: Upload avatar (if exists)
        let avatarUrl = null;
        if(req.files.avatar){
            const avatarResponse = await uploadOnCloudinary(req.files.avatar[0].path)
             avatarUrl = avatarResponse.secure_url
        }

        // Step 3: Upload documents (if exist)
        let documentUrls = [];
        if(req.files.documents){
            const documentPromise  = req.files.documents.map(file =>
                uploadOnCloudinary(file.path)
            );

            const documnetResponse = await Promise.all(documentPromise);
            documentUrls = documnetResponse.map(res=> ({
                fieldName: res.original_filename,
                url: res.secure_url
            }))
            //send response
            return res.status(200).json({
                "message": "Files uploaded successfully",
                avatar: avatarUrl,
                documents: documentUrls
            })
        }
        
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Error in fields upload"
        })
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
        const user = await User.findOne({name:name});
        //console.log(name)
        if(!user){
            return res.status(401).json({ success: false, message: 'Invalid credentials User name is incorrect' });
        }

        // Step 3: Compare passwords using your model method
        //const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.comparePassword(password)
        if(isPasswordValid){
           return  res.status(400).json({Message: "Password is incorrect"})
        }
        console.log(isPasswordValid)
        
        // const validPassword = await bcrypt.compare(password, user.password);
        // if (validPassword) return res.status(401).json({ error: 'Invalid credentials password not right' });
        // console.log(validPassword)


        const token = user.generateAuthToken();
  
        
         // Step 5: Send response with token
          res.status(200).json({Message:'Login Successfully your new token is given below', token, user: {
            name: user.name,
            email: user.email
          }});
        
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({error: "Internal Server Errror"})
    }
}

//Step-1
//Controller to Forget Password - Generate Email OTP
const forgetPassword = async(req,res)=>{
    try {

        const {email} = req.body; //Extract the User email from the req.body protion

        //check if the User exist in our system or not 
        const user = await User.findOne({email:email});
        console.log(email)
        if(!user)
        {
            res.status(404).json({Mesaage: "User with this email does not exist in our system!! Enter the correct email"});
        }
        console.log(user)
        //  Generate OTP (6-digit, 10min expiry)
        const otp = generateOTP.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
        const otpExpiry = Date.now() + 800000; // 13 minutes
        console.log(otp)
        console.log(otpExpiry)

        // 3. Save OTP to user
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = otpExpiry;

        const response = await user.save();

        // 4. Send email

        await forgetMail(response.email, response.name, response.resetPasswordOTP, response.resetPasswordExpires)

        //res.json({ message: "OTP sent to email" });
         // Send a response with user details and a success message
         
         res.status(200).json({message: "OTP sent to email", response:{
            email:response.email
         }});

    } catch (error) {
        console.log("Error:",error);
        res.status(500).json({Message: "Internal Server Error!! "})
    }
}

//Step-2
//Controller to verifyOTP 
const verifyOTP = async(req,res)=>{
    try {
        const { email, otp } = req.body;

        // 1. Find user and check the opt expires data
        const user = await User.findOne({email,resetPasswordExpires: {$gt: Date.now()}});

        //checking the user 
        if(!user){
            res.status(404).json({Message: "User does not found"})
        }
        //checking the OTP Expries data 
        if(!user.resetPasswordOTP == otp){
            res.status(404).json({Message: "OTP is not found in that DataBase"})
        }

         // 2. Generate temporary token (valid for 15min)
         const tempToken = jwt.sign(
        {  userId: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '15m'}
        );

        // 3. Clear OTP (optional, or wait until password update)
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ Message: "Verify Otp Successfully",token: tempToken });    
        
    } catch (error) {
        console.log("Error:",error);
        res.status(500).json({Message: "Internal Server Error!! Error cause during Verifing OTP"})
    }
}

//Step -3 
//Controller to Update the Password
const resetPassword = async(req,res)=>{
    try {
        const {newPassword} = req.body;

        const token = req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            res.status(404).json({Message: "Unauthorized Token"})
        }

        //Verify token 
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        //find the user by its id 
        const user = await User.findById(decoded.userId)

        if (!user) return res.status(404).json({ message: "User not found" });

        //Hash the Password 
        const hashPassword = await bcrypt.hash(newPassword,10)
        user.password = hashPassword;

        const response = await user.save()

        res.status(200).json({Message: "Password Reest Successfully...", response})

    } catch (error) {
        console.log("Error:",error);
        res.status(500).json({Message: "Internal Server Error!! Error cause when changing the password"})
    }
}


//Controller to Update the User 
// Not recommand to change the password 
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
    handleSingleUpload,
    handleArrayUpload ,
    handleAnyUpload,
    handleFieldsUpload,
    forgetPassword,
    verifyOTP,
    resetPassword,
    loginUser,
    updateUser,
    updateOneUser,
    deleteUser,
    deleteOneUser
   
}
