import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, totalAmount, shippingAddress } = body;
    
    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json({ message: "Missing order details" }, { status: 400 });
    }

    await connectToDatabase();
    
    const order = await Order.create({
      user: session.user.id,
      items,
      totalAmount,
      shippingAddress,
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    let orders;
    if (session.user.role === "admin") {
      orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email");
    } else {
      orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
