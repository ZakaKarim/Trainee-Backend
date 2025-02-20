const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    // Reference to products this user owns
    product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
},{
    timestamps: true
}
);

UserSchema.pre("save", async function(next){
    
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)// yah phel await lagnai bhool gaya that thats why error aya raha tha 
    //mujh bar bar kaf time laga theek karnai ma 
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
const User = mongoose.model('User', UserSchema);

module.exports = User;
