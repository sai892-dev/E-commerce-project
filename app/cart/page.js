"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    if (!session) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ marginTop: "1rem", marginBottom: "2rem" }}>Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem" }}>Shopping Cart</h1>
      
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div>
          {cart.map((item) => (
            <div key={item.product} className="card flex items-center justify-between" style={{ marginBottom: "1rem", padding: "1rem" }}>
              <div className="flex items-center gap-4">
                <div style={{ width: "80px", height: "80px", backgroundColor: "#e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{item.name}</h3>
                  <p style={{ margin: 0 }}>Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p style={{ fontWeight: "600", fontSize: "1.2rem", color: "#212121" }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <button 
                  onClick={() => removeFromCart(item.product)}
                  style={{ color: "#2874f0", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", color: "#878787", textTransform: "uppercase" }}>Price Details</h2>
            <div className="flex justify-between" style={{ marginBottom: "1rem" }}>
              <span>Price ({cart.length} items)</span>
              <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: "1rem" }}>
              <span>Delivery Charges</span>
              <span style={{ color: "#388e3c" }}>FREE</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px dashed #e0e0e0", margin: "1rem 0" }} />
            <div className="flex justify-between" style={{ marginBottom: "2rem", fontWeight: "500", fontSize: "1.25rem", color: "#212121" }}>
              <span>Total Amount</span>
              <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: "100%", padding: "1rem" }}>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
