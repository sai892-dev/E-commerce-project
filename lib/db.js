import mongoose from "mongoose";
import Product from "../models/Product"; // We will import Product to seed

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, mongod: null, uri: null };
}

async function seedDatabaseIfEmpty() {
  const count = await mongoose.models.Product.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} products. Skipping seed.`);
    return;
  }
  
  console.log("Database is empty. Seeding catalog...");
  
  const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas', 'Puma', 'Biba', 'W', 'Philips', 'Dyson', 'Whirlpool', 'Titan', 'Fastrack', 'Boat', 'Noise'];
  const adjectives = ['Premium', 'Smart', 'Advanced', 'Classic', 'Pro', 'Max', 'Ultra', 'Handwoven', 'Designer', 'Next-Gen', 'Ultimate', 'Sleek', 'Compact', 'Heavy Duty'];
  
  const categories = {
    'Electronics': { types: ['Smartphone', 'Headphones', 'Laptop', 'Smart TV', 'Tablet', 'Earbuds'] },
    'Fashion': { types: ['Sneakers', 'Watch', 'Jeans', 'T-Shirt'] },
    'Ethnic': { types: ['Saree', 'Kurta', 'Lehenga'] },
    'Appliances': { types: ['Espresso Machine', 'Air Purifier', 'Mixer Grinder'] }
  };

  const imageMap = {
    'Smartphone': [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
      "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500"
    ],
    'Headphones': [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    ],
    'Laptop': [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
    ],
    'Smart TV': [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500"
    ],
    'Tablet': [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=500"
    ],
    'Earbuds': [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500"
    ],
    'Sneakers': [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    ],
    'Watch': [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500"
    ],
    'Jeans': [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
      "https://images.unsplash.com/photo-1602293589930-45c59d5e8099?w=500"
    ],
    'T-Shirt': [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500"
    ],
    'Saree': [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
      "https://images.unsplash.com/photo-1583391733959-1f510f27c3db?w=500"
    ],
    'Kurta': [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=500",
      "https://images.unsplash.com/photo-1605809703648-52fb5daeeec3?w=500"
    ],
    'Lehenga': [
      "https://images.unsplash.com/photo-1615886753866-79396abc446e?w=500",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
    ],
    'Espresso Machine': [
      "https://images.unsplash.com/photo-1556910103-1c02745a872f?w=500",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500"
    ],
    'Air Purifier': [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500",
      "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=500"
    ],
    'Mixer Grinder': [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500"
    ]
  };

  const colors = ['Phantom Black', 'Alpine White', 'Crimson Red', 'Midnight Blue', 'Rose Gold', 'Titanium Silver', 'Maroon', 'Emerald Green', 'Charcoal'];

  const generateProduct = () => {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    // Pick a random category
    const catKeys = Object.keys(categories);
    const catKey = catKeys[Math.floor(Math.random() * catKeys.length)];
    const categoryInfo = categories[catKey];
    
    // Pick a specific type
    const type = categoryInfo.types[Math.floor(Math.random() * categoryInfo.types.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // GUARANTEE: Pick an image STRICTLY mapped to this exact product type
    const image = imageMap[type][Math.floor(Math.random() * imageMap[type].length)];
    
    const price = Math.floor(Math.random() * 90000) + 999;
    const stock = Math.floor(Math.random() * 500) + 1;
    
    return {
      name: `${brand} ${adj} ${type} - ${color}`,
      description: `Experience the finest quality with the ${brand} ${adj} ${type}. Crafted for excellence and built to last. Color: ${color}.`,
      price,
      image,
      stock,
      category: catKey.toLowerCase(),
      amazonLink: `https://www.amazon.in/s?k=${encodeURIComponent(brand + " " + type)}`,
      flipkartLink: `https://www.flipkart.com/search?q=${encodeURIComponent(brand + " " + type)}`
    };
  };

  let batch = [];
  for (let i = 0; i < 200; i++) {
    batch.push(generateProduct());
  }
  await mongoose.models.Product.insertMany(batch);
  console.log("Product seeding completed!");
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
            const { MongoMemoryServer } = await import("mongodb-memory-server");
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
