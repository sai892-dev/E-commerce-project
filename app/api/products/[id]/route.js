import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}
