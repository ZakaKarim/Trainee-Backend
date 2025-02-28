const mongoose = require('mongoose');
const Product = require('../models/product.model.js');

// Controller function to fetch all products of a user using aggregation
const getProductsByUser = async(req,res)=>{
    const userId  = req.params.id; 
    //console.log(userId) // Extract the userId from the request parameters
    try {
        // Aggregation pipeline to fetch all products for a user
        const products  = await Product.aggregate([
               // Match products based on the userId (user reference in Product)
               {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)  // Match products that belong to the userId
                }
               },
               // Lookup to fetch the full details of the user for each product
               
               {
                $lookup:{
                    from: 'users', // Name of the users collection
                    localField: 'user',  // Field in the Product model that references User
                    foreignField: '_id',  // Field in the User model to match
                    as: 'userDetails'  // Alias for the matched user data
                }
               },
               // Unwind the userDetails array to access user data
            //    { 
            //     $unwind: "$userDetails" 
            //     },
            //     // Project the fields to return the data in the required structure
               {
                $project: {
                name: 1,  // Include the product name
                price: 1,
                user: 1,  // Include the product price
                'userDetails.name': 1  // Include the user's name (from userDetails)
                }
               },
            //     // Optional: Sort the products by price (ascending or descending)
            //     {
            //       $sort:{price:-1 }// Sort by price in ascending order (use -1 for descending)
            //     },

        ]);

        // If no products are found, return a 404 response
    if (!products || products.length === 0) {
        return res.status(404).json({ message: 'No products found for this user.' });
      }
        // Send the products as the response
    res.status(200).json( products );
    console.log("Product Aggregation is working ")
    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({ message: 'Server error' });
    };
}

module.exports ={ getProductsByUser};