const xlsx = require("xlsx");
const fs = require("fs");
const mongoose = require('mongoose');
const Product = require ("../models/product.model.js")

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ Message: "No file uploaded." });
    }

    const filePath = req.file.path;
    console.log("File Path: ", filePath)

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    // Save each product to the database
    const savedProducts = [];
    for (const row of data) {
      // Trim keys to remove extra spaces (e.g., " name" -> "name")
      const trimmedRow = {};
      for (const key in row) {
        trimmedRow[key.trim()] = row[key];
      }

      // Check if required fields are present
      if (trimmedRow.name && trimmedRow.price && trimmedRow.description && trimmedRow.userID) {
        // Convert user ID string to ObjectId
        const userID = new mongoose.Types.ObjectId(trimmedRow.userID);
        // Create a new product
        const product = new Product({
          name: trimmedRow.name,
          price: trimmedRow.price,
          description: trimmedRow.description,
          user: userID, // Use the converted ObjectId
        });

        // Save the product to the database
        const savedProduct = await product.save();
        savedProducts.push(savedProduct);
      } else {
        console.warn('Skipping row due to missing or invalid fields:', trimmedRow);
      }
    }

     // Send a success response with the saved products
     res.status(200).json({ message: 'Data saved successfully',data, savedProducts });

    // Send the data as a response
    //res.status(200).json({ data });

    // Optionally, delete the file after reading
    fs.unlinkSync(filePath)


  } catch (error) {
    console.log("Error:", error)
    res.status(500).send('Error processing the file.');
  }
};

module.exports = { uploadExcel };
