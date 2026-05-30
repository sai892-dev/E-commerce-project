"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  
  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    let matches = true;
    if (categoryQuery) {
      // In a real app you'd map these better, here we match category names to descriptions or names loosely if DB doesn't have a category field.
      // But since we just seeded it, let's match keywords based on our known seed products.
      const cat = categoryQuery.toLowerCase();
      if (cat === "electronics" && !product.name.includes("MacBook") && !product.name.includes("Galaxy") && !product.name.includes("Sony") && !product.name.includes("TV")) matches = false;
      if (cat === "fashion" && !product.name.includes("Sneaker") && !product.name.includes("Watch") && !product.name.includes("Sunglasses")) matches = false;
      if (cat === "ethnic" && !product.name.includes("Saree") && !product.name.includes("Kurta") && !product.name.includes("Lehenga")) matches = false;
      if (cat === "appliances" && !product.name.includes("Espresso") && !product.name.includes("Vacuum") && !product.name.includes("Purifier")) matches = false;
    }
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(sq) && !product.description.toLowerCase().includes(sq)) {
        matches = false;
      }
    }
    return matches;
  });

  if (loading) {
    return <div style={{ textAlign: "center", padding: "4rem" }}>Loading products...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem" }}>
        {searchQuery ? `Search Results for "${searchQuery}"` : categoryQuery ? `${categoryQuery.charAt(0).toUpperCase() + categoryQuery.slice(1)} Products` : 'All Products'}
      </h1>
      
      {filteredProducts.length === 0 ? (
        <p>No products found matching your criteria. Check back later!</p>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div style={{ height: "200px", backgroundColor: "#f1f3f6", marginBottom: "1rem", overflow: "hidden", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: 500, flexGrow: 1 }}>
                <Link href={`/products/${product._id}`}>{product.name}</Link>
              </h3>
              <p style={{ fontSize: "0.85rem", height: "40px", overflow: "hidden", marginBottom: "0.5rem" }}>{product.description}</p>
              <div className="flex justify-between items-center" style={{ marginBottom: "1rem" }}>
                <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
              <button 
                onClick={() => addToCart(product)} 
                className="btn btn-secondary" 
                style={{ width: "100%" }}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
