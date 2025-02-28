const { validationResult } = require('express-validator');
const Product = require('../models/product.model.js')
const mongoose = require("mongoose");
//Get method to Get the all the Products
const getProduct = async(req,res)=>{
    try {
        // const data = await Product.find().populate('user','email name');
        const data = await Product.find();
        //checking if there is no Product is in the DataBase
        if(!data.length>0){
            res.status(400).json({Message:"No Product Find yet"});
            console.log("No Product find yet")
        }
        console.log("All Products Data is Fetch From the Server......"); 
        res.status(200).json(data);
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }
    
}

//Controller to get a Single Product using findOne()
const singleProduct = async(req,res)=>{
   try {
    const productId = req.params.id;
    const product = await Product.findOne({_id: productId});

    //Checking if the User exist in the DataBase
    if(!product){
        res.status(404).json({Message: `Product not found with this ProductID:${productId}`});
    }
    //Sending response back to Postman
    res.status(200).json(product)
    console.log("Product Find By findOne Method.....")
   } catch (error) {
    console.log("Error:",error);
    res.status(500).json({Message: "Internal Server error"})
   }
}

// Controller to get a Single Product by findById()

const singleProductById = async(req,res)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        // Checking if the product is exist in the DB OR NOT
        if(!product){
            res.status(404).json({Message: `Product not found with this ProductID:${productId}`})
        }
        res.status(200).json(product);
        console.log("Product is Fetch by findById Method....");
    } catch (error) {
        console.log("Error:",error);
        res.status(500).json({Message: "Internal Server error"})
    }
}


//Post Method to create a Product
const registerProduct = async(req,res)=>{
    //Handle Validation Errors
    const error = validationResult(req);
    if(!error.isEmpty())
        {
            return res.status(400).json({error: error.array()});
        }
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

//Put Method to Update the Product using findByIdAndUpdate()
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
        console.log("Product Data is Updated....by using findByIdAndUpdate")
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }

}

//Put Method to Update a Product using findOneAndUpdate

const updateSingleProduct = async(req,res)=>{
    try {
        const productId = req.params.id;
        const productData = req.body;
        const product = await Product.findOne({_id: productId});

                //Checking if the product exist in the dataBase Before Updating it 
      if(!product){
        res.status(404).json({Message: `Product not found with this ID:${productId}....`})
        console.log("Product not Found With this Id")
      }

      const updatedproduct = await Product.findOneAndUpdate({_id: productId},productData,{
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation
      });
      res.status(200).json(updatedproduct);
     console.log('Product Data is Updated....by using findOneAndUpdate')
      } catch (error) {
        console.log("Error:", error);
        res.status(500).json({Message: "Internal SERVER Error"})
    }
}



// Delete Method to Delete a Product by using findByIdAndDelete
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
            console.log("Product is deleted successfully using findById");
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }
}

// Delete Method to Delete a Product by using findOneAndDelete
const deleteOneProduct = async(req,res)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findOne({_id: productId});
        //checking if the product is in the database before we delete it 
        if(!product){
            res.status(404).json({Message: `Product not found with this ID:${productId}....`})
            console.log("Product Not Found with this ID in the DataBase")
        }

        const response = await Product.findOneAndDelete({_id: productId})
        res.status(200).json({message: "Product is Deleted Successfully"});
        console.log("Product is deleted successfully using findOneAndDelete");
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({Message: "Internal Server Error"})
    }
}
module.exports = {
    registerProduct,
    getProduct,
    singleProduct,
    singleProductById,
    updateProduct,
    updateSingleProduct,
    deleteProduct,
    deleteOneProduct
}