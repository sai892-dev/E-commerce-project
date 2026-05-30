# LuxeStore - Advanced E-Commerce Platform

Welcome to **LuxeStore**, a massive, high-performance e-commerce platform built with modern web technologies. This project is designed to emulate the scale, speed, and premium feel of industry giants like Flipkart and Amazon, while introducing highly innovative, first-of-their-kind features.

## 🚀 Key Features

*   **Massive Scale Database**: A fully functional MongoDB database populated with **10,000 synthetically generated, highly realistic products**. The platform efficiently handles massive data loads using advanced query limits and pagination.
*   **AI Virtual Shopkeeper (Smart Bargaining)**: A highly unique feature rarely seen in modern e-commerce. Users can click the "AI BARGAIN 🤖" button on any product page to open a chat and haggle the price with a virtual shopkeeper! Successfully negotiated deals update the cart price dynamically.
*   **Visual Image Search Scanner**: A Google Lens-inspired feature. Users can click the Camera icon in the main search bar to simulate snapping a photo of an item, triggering a visual search analysis to find similar products in the store.
*   **Premium Indian E-commerce UI**: 
    *   Category-wise product rows on the home page.
    *   Sleek Flipkart-inspired color scheme (Blue and Orange).
    *   Flawless product image rendering using `mix-blend-mode: multiply`.
    *   Interactive Slide-out Sidebar Dashboard showing the user's cart summary, default delivery address, and quick links.
    *   A prominent 24/7 Toll-Free Helpline banner.
*   **Global State Management**: Fully functioning Cart Context allowing users to add, remove, and track their cart total seamlessly across the site.
*   **Responsive & Fast**: Built with Next.js App Router for blazing-fast server-side rendering and optimized client-side interactions.

## 🛠️ Technology Stack

*   **Frontend**: Next.js 16 (App Router), React, Vanilla CSS (No Tailwind, custom crafted for maximum control).
*   **Backend**: Next.js API Routes.
*   **Database**: MongoDB (utilizing `mongodb-memory-server` for a seamless, zero-config local development experience. No local MongoDB installation required!).
*   **Authentication**: NextAuth.js (configured for secure credential login and admin routing).

## ⚙️ How to Run Locally

Follow these simple steps to run the project on your local machine.

### 1. Install Dependencies
Open a terminal in the project directory and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. View the Application
Open your web browser and navigate to:
```
http://localhost:3000
```
*Note: Upon the first API request, the system will automatically drop and re-seed the database with 10,000 realistic products. This process takes approximately 3-5 seconds in the background. Check your terminal for the "Seeding completed" message!*

## 📁 Project Structure

*   `/app`: Contains all Next.js App Router pages (Home, Products, Cart, Checkout, Auth).
*   `/app/api`: Serverless API routes for fetching products, authenticating, and processing orders.
*   `/components`: Reusable React components (`Navbar`, `Sidebar`, `CartContext`, etc.).
*   `/lib/db.js`: Contains the critical MongoDB connection logic and the massive 10,000 product generator algorithm.
*   `/models`: Mongoose schemas for `Product`, `User`, and `Order`.
*   `/public`: Static assets.

---
*Developed for Project Submission.*
