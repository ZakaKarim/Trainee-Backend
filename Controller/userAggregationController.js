const mongoose = require('mongoose');
const Product = require('../models/product.model.js');
const User = require('../models/user.model.js');
//const User = require('../models/user.model.js');

// Controller to fetch products by user using aggregation pipeline
const getUserProducts = async(req,res)=>{
    const  userId  = req.params.id; // Extract userId from the URL parameters
   //console.log(userId);//checking if the user id is coming or not 
        try {
            const userProducts = await User.aggregate([
                {
                    // Match the user by their ID
                    $match:{_id: new mongoose.Types.ObjectId(userId)}
                },
                {
                     // Lookup products associated with the user
                    $lookup: {
                        from: "products", // The collection to join with
                        localField: "_id", // The field from the User collection
                        foreignField:"user", // The field from the Product collection that references the user
                        as: "productDetails"  // The name of the new array field to store the joined products
                    }
                },
                 // Unwind the productDetails array to access individual product data
               { 
                $unwind: "$productDetails" 
                },
                {
                     // Project the fields to include in the final output
                    $project: {
                    name: 1,  // Include the user name
                    email: 1, // Include the user's email
                    productDetails: { name: 1, _id:1, price:1 },// Include product name id and price of the product
                    createdAt: "$productDetails.createdAt"// Include product creation date
                    }
                   },
                    // Sort by product creation date (ascending order)
                    { 
                        $sort: {"productDetails.createdAt": 1 }
                        //$sort: {"productDetails.createdAt": 1 }//in case you want to sort base on price 
                    },
            ]);
               // Send the user products as the response
                res.status(200).json( userProducts );
                //console.log("check working..... ")

    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports = {getUserProducts};