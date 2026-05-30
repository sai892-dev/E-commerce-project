"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router, mounted]);

  if (!mounted || cart.length === 0) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: item.product,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: getCartTotal(),
          shippingAddress: { address, city, postalCode, country }
        })
      });

      if (res.ok) {
        clearCart();
        router.push("/profile"); // Redirect to profile/orders page
      } else {
        const data = await res.json();
        setError(data.message || "Failed to place order");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Checkout</h1>
      
      <div className="card">
        <h2 style={{ marginBottom: "1.5rem" }}>Shipping Details</h2>
        
        {error && <div style={{ color: "red", marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fee2e2", borderRadius: "8px" }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Address</label>
            <input type="text" className="input" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <div className="flex gap-4">
            <div className="input-group" style={{ flex: 1 }}>
              <label>City</label>
              <input type="text" className="input" value={city} onChange={e => setCity(e.target.value)} required />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Postal Code</label>
              <input type="text" className="input" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label>Country</label>
            <input type="text" className="input" value={country} onChange={e => setCountry(e.target.value)} required />
          </div>
          
          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--card-border)" }}>
            <div className="flex justify-between" style={{ marginBottom: "1.5rem", fontWeight: "500", fontSize: "1.25rem" }}>
              <span>Total Payable:</span>
              <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "1rem" }} disabled={loading}>
              {loading ? "Processing..." : "PLACE ORDER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
