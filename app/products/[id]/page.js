"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function ProductDetail({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  // Bargain System State
  const [isBargaining, setIsBargaining] = useState(false);
  const [offer, setOffer] = useState("");
  const [bargainChat, setBargainChat] = useState([]);
  const [negotiatedPrice, setNegotiatedPrice] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleBargain = (e) => {
    e.preventDefault();
    const userOffer = parseInt(offer);
    if (!userOffer || isNaN(userOffer)) return;

    const basePrice = product.price;
    const ratio = userOffer / basePrice;
    
    let newChat = [...bargainChat, { sender: "user", text: `I offer ₹${userOffer.toLocaleString('en-IN')}` }];
    
    if (attempts >= 3) {
      newChat.push({ sender: "seller", text: "I can't negotiate anymore. This is my final price.", isFinal: true });
    } else if (ratio >= 0.95) {
      newChat.push({ sender: "seller", text: "Deal! I accept your offer. It's yours!", success: true });
      setNegotiatedPrice(userOffer);
    } else if (ratio >= 0.80) {
      const counterOffer = Math.floor(basePrice * (0.85 + (Math.random() * 0.1)));
      newChat.push({ sender: "seller", text: `That's a bit low. How about ₹${counterOffer.toLocaleString('en-IN')}?` });
    } else {
      newChat.push({ sender: "seller", text: "Are you joking? I would be taking a loss! Please make a serious offer." });
    }

    setBargainChat(newChat);
    setOffer("");
    setAttempts(attempts + 1);
  };

  const handleAddToCart = () => {
    // If they bargained, use the new price
    const productToAdd = { ...product };
    if (negotiatedPrice) {
      productToAdd.price = negotiatedPrice;
      productToAdd.name = productToAdd.name + " (Bargained Deal!)";
      productToAdd._id = productToAdd._id + "_bargain";
    }
    addToCart(productToAdd);
    router.push("/cart");
  };

  if (loading) return <div className="container" style={{ padding: "4rem", textAlign: "center" }}>Loading details...</div>;
  if (!product) return <div className="container" style={{ padding: "4rem", textAlign: "center" }}>Product not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: "2rem 1rem" }}>
      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: "3rem", padding: "3rem" }}>
        
        {/* Product Image */}
        <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "2rem" }}>
          <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "500px", objectFit: "contain" }} />
        </div>
        
        {/* Product Info */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#212121" }}>{product.name}</h1>
          <p style={{ fontSize: "1.2rem", color: "#878787", marginBottom: "2rem" }}>{product.description}</p>
          
          <div style={{ marginBottom: "2rem" }}>
            {negotiatedPrice ? (
              <div>
                <span style={{ fontSize: "1.2rem", textDecoration: "line-through", color: "#878787", marginRight: "1rem" }}>₹{product.price.toLocaleString('en-IN')}</span>
                <span style={{ fontSize: "2.5rem", fontWeight: "700", color: "#388e3c" }}>₹{negotiatedPrice.toLocaleString('en-IN')}</span>
                <p style={{ color: "#388e3c", fontWeight: 500 }}>Successfully Negotiated! 🤝</p>
              </div>
            ) : (
              <span style={{ fontSize: "2.5rem", fontWeight: "700", color: "#212121" }}>₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          <div className="flex gap-4" style={{ marginBottom: "2rem" }}>
            <button onClick={handleAddToCart} className="btn btn-secondary" style={{ padding: "1rem 2rem", fontSize: "1.1rem", flex: 1 }}>
              {negotiatedPrice ? "ADD TO CART (DEAL PRICE)" : "ADD TO CART"}
            </button>
            {!negotiatedPrice && (
              <button onClick={() => setIsBargaining(!isBargaining)} className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "1.1rem", flex: 1, backgroundColor: "#6366f1" }}>
                AI BARGAIN 🤖
              </button>
            )}
          </div>

          {/* Bargaining UI */}
          {isBargaining && !negotiatedPrice && (
            <div style={{ backgroundColor: "#f1f3f6", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
              <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🤖</span> Smart Virtual Shopkeeper
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#878787", marginBottom: "1rem" }}>
                Welcome to the digital bazaar! Try to haggle for a better price. But don't lowball me too much!
              </p>
              
              <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {bargainChat.map((msg, idx) => (
                  <div key={idx} style={{ 
                    padding: "0.75rem", 
                    borderRadius: "8px",
                    maxWidth: "80%",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.sender === "user" ? "#2874f0" : "#fff",
                    color: msg.sender === "user" ? "#fff" : "#212121",
                    border: msg.sender === "seller" ? "1px solid #e0e0e0" : "none"
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>

              {attempts < 4 && !bargainChat.some(msg => msg.success) && (
                <form onSubmit={handleBargain} className="flex gap-2">
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontWeight: 500 }}>₹</span>
                    <input 
                      type="number" 
                      className="input" 
                      style={{ width: "100%", paddingLeft: "2rem" }} 
                      placeholder="Your Offer..."
                      value={offer}
                      onChange={e => setOffer(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline" style={{ backgroundColor: "#fff" }}>Offer</button>
                </form>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
