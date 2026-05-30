import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: 0,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x300.png?text=No+Image",
    },
    stock: {
      type: Number,
      required: [true, "Please provide product stock quantity"],
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
