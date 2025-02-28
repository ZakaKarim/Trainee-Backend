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

         // 2. Update the user document fields
        //  Object.keys(userData).forEach((key)=>{
        //       // Update the user document's field with the new value from `userData`
        //     user[key] = userData[key]
        //  });

         // 3. Save the document (triggers the `pre('save')` middleware)
            //const response = await user.save();

         
         // If the password is being updated, hash it
         if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10); // Hash the new password
        }
      
        // Update the user
        // if you just want to update one field in the dataBase so for that updating the entire resource is not a good option
        // so for that i am just using   { $set: { name: 'Updated User Name' } }
        // { $set: { name: "John Doe", age: 30 } } multipe fields update this  after when we are sending the user id 


        const updatedUser  = await User.findByIdAndUpdate(userId, userData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
             
        });
        res.status(200).json(updateUser)
        console.log("Data is Updated.... ");
        
    } catch (error) {
        console.log("Error Updating User", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}