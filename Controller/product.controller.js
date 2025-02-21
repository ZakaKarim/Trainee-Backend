const Product = require('./../Models/product.model.js')
const mongoose = require("mongoose");
//Get method to Get the all the Products
const getProduct = async(req,res)=>{
    try {
        // const data = await Product.find().populate('user','email name');
        const data = await Product.find();
        //checking if there is no Product is in the DataBase
        if(!data.length>0){
            res.status(400).json({Message:"No Product"});
            console.log("No Product find yet")
        }
        console.log("Product Data is Fetch From the Server......");
        res.status(200).json(data);
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }
    
}

//Post Method to create a Product
const registerProduct = async(req,res)=>{
    try {
        const data = req.body;//assuming data is coming in req.body

          //Creating a new Product document from the Mongoose Model 
          const newProduct = new Product(data);
        
           //Saving the Product in the database taking time process  using await
           const response = await newProduct.save();
           console.log("Product Data is Save in the DataBase.....");
           res.status(200).json(response);
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }
}

//Put Method to Update the Product 
const updateProduct = async(req,res)=>{
    try {
        const productId = req.params.id; //Extract the User id from the URL parameter
        const productData = req.body; //Extract the User Data from the req.body protion
    
         // Check if the Product exists
        const product = await Product.findById(productId);
        if(!product)
        {
            res.status(400).json({Message: "Product Not Found in the DataBase"});
            console.log("Product Not Found with this ID in the DataBase")
        };
    
        const updatedproduct = await Product.findByIdAndUpdate(productId,productData,{
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        });
        res.status(200).json(updatedproduct);
        console.log("Product Data is Updated.....")
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }

}
// Delete Method to Delete a Product
const deleteProduct = async(req,res)=>{
    try {
        const productId = req.params.id;
        
             // Check if the Product exists
            const product = await Product.findById(productId);
            if(!product){
                res.status(400).json({Message: "Product Not Found in the DataBase"});
                console.log("Product Not Found with this ID in the DataBase")
            }

            const response = await Product.findByIdAndDelete(productId);
            res.status(200).json({message: "Product is Deleted Successfully"});
            console.log("Product is deleted successfully");
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }
}
module.exports = {
    registerProduct,
    getProduct,
    updateProduct,
    deleteProduct
}