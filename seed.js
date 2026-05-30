const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    stock: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const seedProducts = [
  {
    name: "Quantum Noise-Cancelling Headphones",
    description: "Experience absolute silence with our next-generation quantum active noise-cancellation technology. Sculpted for comfort and designed for audiophiles.",
    price: 399.99,
    image: "/category_electronics_1780147527463.png",
    stock: 50,
  },
  {
    name: "Neon Smart Interface Glass",
    description: "Control your entire digital ecosystem with a single touch. The Neon Interface features a transparent OLED display with tactile feedback.",
    price: 899.00,
    image: "/category_electronics_1780147527463.png",
    stock: 25,
  },
  {
    name: "Obsidian Chronograph Watch",
    description: "Forged from a single block of dark titanium, the Obsidian Chronograph represents the pinnacle of modern horology and timeless elegance.",
    price: 1250.00,
    image: "/category_fashion_1780147544728.png",
    stock: 15,
  },
  {
    name: "Midnight Designer Aviators",
    description: "UV400 polarized lenses set in a feather-light carbon fiber frame. See the world differently while making an unforgettable statement.",
    price: 245.50,
    image: "/category_fashion_1780147544728.png",
    stock: 100,
  },
  {
    name: "Luminous Minimalist Lamp",
    description: "A sculptural lighting fixture that doubles as modern art. Features adjustable color temperature and smart home integration.",
    price: 185.00,
    image: "/category_home_1780147568123.png",
    stock: 40,
  },
  {
    name: "Onyx Marble Centerpiece Vase",
    description: "Hand-carved from rare black onyx marble. The perfect statement piece for any luxury living space or executive office.",
    price: 320.00,
    image: "/category_home_1780147568123.png",
    stock: 8,
  }
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce-store";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    // Insert new products
    await Product.insertMany(seedProducts);
    console.log("Successfully seeded premium products!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
