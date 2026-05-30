"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

export default function Sidebar({ isOpen, onClose }) {
  const { data: session } = useSession();
  const { getCartCount, getCartTotal } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", zIndex: 99,
            transition: "opacity 0.3s"
          }}
        />
      )}
      
      {/* Sidebar Content */}
      <div style={{
        position: "fixed", top: 0, left: isOpen ? 0 : "-350px", bottom: 0,
        width: "300px", backgroundColor: "#fff", zIndex: 100,
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        transition: "left 0.3s ease-in-out",
        display: "flex", flexDirection: "column",
        overflowY: "auto"
      }}>
        {/* Header (Flipkart blue style) */}
        <div style={{ backgroundColor: "#2874f0", color: "#fff", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#fff", color: "#2874f0", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>{session ? `Hello, ${session.user.name}` : "Hello, Sign in"}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>
          
          {/* Quick Stats */}
          <div style={{ backgroundColor: "#f1f3f6", padding: "1rem", borderRadius: "4px" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#878787" }}>YOUR CART</h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 500 }}>{getCartCount()} Items</span>
              <span style={{ fontWeight: "bold", color: "#2874f0" }}>₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <Link href="/cart" onClick={onClose} style={{ display: "block", marginTop: "1rem", textAlign: "center", color: "#2874f0", fontWeight: 500, textDecoration: "none", fontSize: "0.9rem" }}>
              VIEW CART
            </Link>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e0e0e0" }} />

          {/* Delivery Address Details */}
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#878787", display: "flex", justifyContent: "space-between" }}>
              DEFAULT DELIVERY ADDRESS
              <span style={{ color: "#2874f0", cursor: "pointer", fontSize: "0.8rem" }}>EDIT</span>
            </h4>
            {session ? (
              <div style={{ fontSize: "0.9rem", color: "#212121", lineHeight: 1.6 }}>
                <p style={{ fontWeight: 500 }}>{session.user.name}</p>
                <p>123, Cyber Hub, Phase 2</p>
                <p>Gurugram, Haryana - 122002</p>
                <p style={{ marginTop: "0.5rem" }}>Ph: +91 9876543210</p>
              </div>
            ) : (
              <p style={{ fontSize: "0.9rem", color: "#212121" }}>Please login to view your saved addresses.</p>
            )}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e0e0e0" }} />

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/products" onClick={onClose} style={{ color: "#212121", fontWeight: 500, display: "flex", alignItems: "center", gap: "1rem" }}>
              🛍️ Shop All Products
            </Link>
            {session && (
              <>
                <Link href="/profile" onClick={onClose} style={{ color: "#212121", fontWeight: 500, display: "flex", alignItems: "center", gap: "1rem" }}>
                  📦 My Orders
                </Link>
                {session.user.role === 'admin' && (
                  <Link href="/admin" onClick={onClose} style={{ color: "#212121", fontWeight: 500, display: "flex", alignItems: "center", gap: "1rem" }}>
                    ⚙️ Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "1.5rem", borderTop: "1px solid #e0e0e0" }}>
          {session ? (
            <button onClick={() => { signOut(); onClose(); }} className="btn btn-outline" style={{ width: "100%", color: "#d32f2f", borderColor: "#d32f2f" }}>
              Log Out
            </button>
          ) : (
            <Link href="/login" onClick={onClose} className="btn btn-primary" style={{ width: "100%", textAlign: "center", display: "block" }}>
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
