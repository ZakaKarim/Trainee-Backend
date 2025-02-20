const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: true,
      lowercase: true,
    },
    price: {
      type: Number,
      require: true,
      lowercase: true,
    },
    // Reference to products this user owns
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Name of the user model
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
