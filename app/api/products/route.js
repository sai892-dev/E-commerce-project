import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await connectToDatabase();
    // Parse URL for basic search support
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }
    
    // Limit to 100 to avoid crashing when DB has 10,000+ items
    const products = await Product.find(query).limit(100).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();
    
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
