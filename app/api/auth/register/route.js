import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user'
    });

    return NextResponse.json({ message: "User registered successfully", userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
  }
}
