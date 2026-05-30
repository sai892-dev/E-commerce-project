import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../models/Product"; // We will import Product to seed

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, mongod: null, uri: null };
}

async function seedDatabaseIfEmpty() {
  const count = await mongoose.models.Product.countDocuments();
  if (count < 10000) {
    console.log("Database has less than 10,000 products. Dropping and re-seeding massive catalog...");
    await mongoose.models.Product.deleteMany({});
    
    const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas', 'Puma', 'Biba', 'W', 'Philips', 'Dyson', 'Whirlpool', 'Titan', 'Fastrack', 'Boat', 'Noise'];
    const adjectives = ['Premium', 'Smart', 'Advanced', 'Classic', 'Pro', 'Max', 'Ultra', 'Handwoven', 'Designer', 'Next-Gen', 'Ultimate', 'Sleek', 'Compact', 'Heavy Duty'];
    const types = ['Smartphone', 'Headphones', 'Laptop', 'Smart TV', 'Sneakers', 'Watch', 'Saree', 'Kurta', 'Espresso Machine', 'Air Purifier', 'Mixer Grinder', 'Jeans', 'T-Shirt', 'Tablet', 'Earbuds'];
    const colors = ['Phantom Black', 'Alpine White', 'Crimson Red', 'Midnight Blue', 'Rose Gold', 'Titanium Silver', 'Maroon', 'Emerald Green', 'Charcoal'];
    
    // Some base realistic images to cycle through
    const images = [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", // Laptop
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500", // Phone
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500", // Headphones
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", // TV
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500", // Sneakers
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", // Watch
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", // Saree
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=500", // Kurta
      "https://images.unsplash.com/photo-1556910103-1c02745a872f?w=500", // Espresso
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500"  // Purifier
    ];

    const generateProduct = () => {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const image = images[Math.floor(Math.random() * images.length)];
      
      const price = Math.floor(Math.random() * 90000) + 999;
      const stock = Math.floor(Math.random() * 500) + 1;
      
      return {
        name: `${brand} ${adj} ${type} - ${color}`,
        description: `Experience the finest quality with the ${brand} ${adj} ${type}. Crafted for excellence and built to last. Color: ${color}.`,
        price,
        image,
        stock
      };
    };

    console.log("Generating 10,000 products...");
    let batch = [];
    for (let i = 0; i < 10000; i++) {
      batch.push(generateProduct());
      if (batch.length === 2000) {
        await mongoose.models.Product.insertMany(batch);
        console.log(`Inserted ${i + 1} products...`);
        batch = [];
      }
    }
    if (batch.length > 0) {
      await mongoose.models.Product.insertMany(batch);
    }
    console.log("Massive 10,000 product seeding completed successfully!");
  }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = (async () => {
      let uri = process.env.MONGODB_URI;
      
      if (!uri || uri.includes("localhost") || uri.includes("127.0.0.1")) {
        try {
          if (!cached.mongod) {
            console.log("Starting MongoDB Memory Server...");
            cached.mongod = await MongoMemoryServer.create();
            cached.uri = cached.mongod.getUri();
            console.log("Memory Server Started at", cached.uri);
          }
          uri = cached.uri;
        } catch (e) {
          console.error("Failed to start MongoMemoryServer", e);
        }
      }

      console.log("Connecting to MongoDB at:", uri);
      await mongoose.connect(uri, opts);
      
      // Auto-seed if it's the memory server or empty local DB
      await seedDatabaseIfEmpty();
      
      return mongoose;
    })().catch((error) => {
      console.error("MongoDB connection error:", error);
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
