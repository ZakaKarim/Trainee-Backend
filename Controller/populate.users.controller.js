const Product = require('../Models/product.model.js');
const User = require("../Models/user.model.js");

// Controller to get all products and populate user information who created that

const getProductWithUser = async(req,res)=>{
    try {
            // Get all products and populate the user field with actual user data
            const products = await Product.find().populate('user');

            for(let product of products){
                product.user.password = ""
            }

            // Send response with products that include user data
            res.status(200).json(products);
            console.log("Fecth All Product with User Populated")

    } catch (error) {
        console.log("Error", error);
        res.status(500).json({Message: "Server error, could not fetch products"});
    }
}

// Controller to get products by a specific user ID
const getProudctWithUserId = async(req,res)=>{
    try {
        const userID = req.params.id; // Get userId from request parameters 
        
        // Find all products that match the userId in the 'user' field
        let products = await Product.find({user:userID});

        
        // If no products found, return a message
        if(products.length==0){
            res.status(400).json({Message: "No products found for this User."});
            console.log("No products found for this User.");
        }
        
        // Send response with the products
        res.status(200).json(products);
        console.log(products);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({Message: "Server error, could not fetch products"});
    }
}
// const getProudctWithUserId = async(req,res)=>{
//     try {
//         const userID = req.params.id; // Get userId from request parameters 
        
//         // Find all products that match the userId in the 'user' field
//         let products = await Product.find({user:userID});

//        //const product = await Product.updateOne({_id: userID }, {$set:{ name:"Iphone"}})

//         // If no products found, return a message
//         if(products.length==0){
//             res.status(400).json({Message: "No products found for this User."});
//             console.log("No products found for this User.");
//         }

//         // Now, update the user data through the Product model

//         const {name, email} = req.body;
//         // Assuming the name and email are passed in the request body for updating the user data

//         // Find the user by ID
//         const user = await User.findById(userID);
//         if(!user){
//             return res.status(404).json({ Message: "User not found." });
//         }

//         // Update the user's name and email (only if they are provided in the request body)
//         if(name) user.name = name;
//         if(email) user.email = email;

//         await user.save();


//         res.status(200).json({
//             Message: "User updated successfully, and products fetched.",
//             User: user,
//             Products: products,
//           });

//         // // Send response with the products
//         // res.status(200).json(products);
//         // console.log(products);
//     } catch (error) {
//         console.log("Error", error);
//         res.status(500).json({Message: "Server error, could not fetch products"});
//     }
// }
module.exports = {
    getProductWithUser,
    getProudctWithUserId
};