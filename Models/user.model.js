const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true, 
    },
    password: {
        type: String,
        required: true,
        trim: true, 
        // select: false, //agar ya karta hai to password kis be model ma nahi jay gay 
    },
    profilePic: { 
        type: String, // Cloudinary URL 
    }, 
    birthCertifcate:{
        type: String,
    },

    // Reference to products this user owns
    // product:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product"
    // }]
    // resetPasswordOTP:{
    //     String,
    // },
    // resetPasswordExpires:{
    //     Date,
    // },
    resetPasswordOTP: String,
    resetPasswordExpires: Date
},{
    timestamps: true
}
);
//Hash the Password Before the User Save in  the DB
UserSchema.pre("save", async function(next){
     // Check if the password field is not modified
     if(!this.isModified("password")) return next();

     this.password = await bcrypt.hash(this.password, 10)
     next()
})

//Comparing the Password at the time of login
UserSchema.methods.comparePassword = async function(enteredPassword){
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

// Method to generate JWT Token
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign(
      { userId: this._id,
        username: this.name,
        email: this.email
       },
      process.env.JWT_SECRET,
      { expiresIn: '1d'}
    );
  };
  

// Hash password before updating user
// UserSchema.pre("findOneAndUpdate", async function(next){
//  const update = this.getUpdate(); // Get the update object
//  // Check if the password is being modified in the update query
//  if (update.password) {
//     // If the password is updated, hash it
//     update.password = await bcrypt.hash(update.password, 10);
//   }

//   // Proceed to the next middleware
//   next();
// })

const User = mongoose.model('User', UserSchema);

module.exports = User;
