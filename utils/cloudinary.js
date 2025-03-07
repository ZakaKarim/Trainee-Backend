// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs"
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloudinary = async(localFilePath)=>{
        try {
            if(!localFilePath) return null;

            //upload on Cloudinary 
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type: "auto" // Automatically detect the file type
            })
            console.log("Full response on Cloudinary.....", response);
            // file has been uploaded successfull
           // console.log("file is uploaded on cloudinary ", response.url);
            fs.unlinkSync(localFilePath)
            return response;
            
        } catch (error) {
            //console.log("Error:",error)
            fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation got failed
            return null;
            
        }
    }
module.exports = {uploadOnCloudinary} 