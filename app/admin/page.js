"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("products");
  
  // Product Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState("");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "admin" && status === "authenticated") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (activeTab === "orders" && session?.user?.role === "admin") {
      fetchOrders();
    }
  }, [activeTab, session]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    setProductMessage("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          image: image || undefined,
          stock: Number(stock)
        })
      });

      if (res.ok) {
        setProductMessage("Product added successfully!");
        setName(""); setDescription(""); setPrice(""); setImage(""); setStock("");
      } else {
        const data = await res.json();
        setProductMessage(data.message || "Failed to add product");
      }
    } catch (err) {
      setProductMessage("An error occurred");
    } finally {
      setProductLoading(false);
    }
  };

  if (status === "loading" || session?.user?.role !== "admin") {
    return <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>
      
      <div className="flex gap-4" style={{ marginBottom: "2rem" }}>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab("products")}
        >
          Add Product
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab("orders")}
        >
          View Orders
        </button>
      </div>
      
      {activeTab === "products" && (
        <div className="card" style={{ maxWidth: "600px" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Add New Product</h2>
          
          {productMessage && <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: productMessage.includes("success") ? "#dcfce7" : "#fee2e2", color: productMessage.includes("success") ? "#166534" : "#991b1b", borderRadius: "8px" }}>{productMessage}</div>}
          
          <form onSubmit={handleAddProduct}>
            <div className="input-group">
              <label>Product Name</label>
              <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} required rows={3}></textarea>
            </div>
            <div className="flex gap-4">
              <div className="input-group" style={{ flex: 1 }}>
                <label>Price (₹)</label>
                <input type="number" step="0.01" className="input" value={price} onChange={e => setPrice(e.target.value)} required min={0} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Stock Quantity</label>
                <input type="number" className="input" value={stock} onChange={e => setStock(e.target.value)} required min={0} />
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: "2rem" }}>
              <label>Image URL (Optional)</label>
              <input type="url" className="input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={productLoading}>
              {productLoading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === "orders" && (
        <div>
          <h2 style={{ marginBottom: "1.5rem" }}>All Orders</h2>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--card-border)" }}>
                    <th style={{ padding: "1rem" }}>Order ID</th>
                    <th style={{ padding: "1rem" }}>Customer</th>
                    <th style={{ padding: "1rem" }}>Date</th>
                    <th style={{ padding: "1rem" }}>Total</th>
                    <th style={{ padding: "1rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                      <td style={{ padding: "1rem", fontFamily: "monospace" }}>{order._id.substring(0, 8)}...</td>
                      <td style={{ padding: "1rem" }}>{order.user?.name || 'Unknown'}</td>
                      <td style={{ padding: "1rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "1rem", fontWeight: "600" }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ padding: "0.25rem 0.5rem", backgroundColor: "#fef3c7", color: "#92400e", borderRadius: "4px", fontSize: "0.875rem" }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
