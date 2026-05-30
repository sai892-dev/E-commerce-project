"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { getCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const cartCount = getCartCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate a scan delay of 2.5 seconds
    setTimeout(() => {
      setIsScanning(false);
      setIsScannerOpen(false);
      // Mock redirect to a "scanned" search or a random product
      router.push("/products?search=macbook");
      alert("Product Scanned Successfully!");
    }, 2500);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Scanner Modal (Visual Search) */}
      {isScannerOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", width: "90%", maxWidth: "450px", textAlign: "center", position: "relative" }}>
            <button onClick={() => setIsScannerOpen(false)} style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#878787" }}>✕</button>
            <h3 style={{ marginBottom: "0.5rem", color: "#212121" }}>📷 Visual Search</h3>
            <p style={{ fontSize: "0.9rem", color: "#878787", marginBottom: "1.5rem" }}>Snap a photo of any outfit or product to find it instantly.</p>
            
            <div style={{ width: "100%", height: "300px", backgroundColor: "#000", position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {/* Mock camera view */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              
              {/* Focus Bounding Box (Google Lens style) */}
              <div style={{ width: "60%", height: "60%", border: "2px dashed rgba(255,255,255,0.7)", borderRadius: "8px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {!isScanning && <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Align product here</span>}
              </div>

              {/* Scanning processing animation */}
              {isScanning && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(40, 116, 240, 0.2)", backdropFilter: "blur(2px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", border: "4px solid #fff", borderTop: "4px solid #2874f0", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                  <p style={{ color: "#fff", marginTop: "1rem", fontWeight: 500 }}>Analyzing Image...</p>
                </div>
              )}
              
              <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
            
            <button onClick={handleScan} className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem", borderRadius: "8px", backgroundColor: "#2874f0" }} disabled={isScanning}>
              {isScanning ? "Processing..." : "Capture Image & Search"}
            </button>
          </div>
        </div>
      )}

      {/* Top Helpline Banner */}
      <div style={{ backgroundColor: "#1e5bb8", color: "#fff", padding: "0.25rem 1rem", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
        <span>India's Largest E-commerce Store</span>
        <span style={{ fontWeight: 500 }}>📞 24/7 Helpline: 1800-123-4567</span>
      </div>

      <nav className="navbar">
        <div className="container nav-content">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer" }}
            >
              ☰
            </button>
            <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
              LuxeStore
            </Link>
          </div>
          
          <form className="search-bar" onSubmit={handleSearch} style={{ position: "relative" }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for products, brands and more" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: "40px" }}
            />
            {/* Scanner Button inside Search Bar */}
            <button 
              type="button" 
              onClick={() => setIsScannerOpen(true)}
              style={{ position: "absolute", right: "90px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", padding: "5px" }}
              title="Scan to search"
            >
              📷
            </button>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <div className="nav-links">
            <Link href="/products" className={`nav-link ${pathname === '/products' ? 'active' : ''}`}>
              Shop
            </Link>
            <Link href="/cart" className={`nav-link ${pathname === '/cart' ? 'active' : ''}`}>
              Cart ({cartCount})
            </Link>
            {session ? (
              <div className="flex items-center gap-4">
                {session.user.role === 'admin' && (
                  <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                    Admin
                  </Link>
                )}
                <Link href="/profile" className={`nav-link ${pathname === '/profile' ? 'active' : ''}`}>
                  Profile
                </Link>
                <button onClick={() => signOut()} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" style={{ color: '#fff', fontWeight: 500 }}>
                Login
              </Link>
            )}
          </div>
        </div>
        
        {/* Secondary Category Navbar */}
        <div style={{ backgroundColor: "#fff", borderBottom: "1px solid var(--card-border)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", marginTop: "0.75rem" }}>
          <div className="container flex items-center" style={{ gap: "2rem", padding: "0.5rem 1rem", overflowX: "auto", whiteSpace: "nowrap" }}>
            <Link href="/products?category=electronics" style={{ color: "#212121", fontWeight: 500, fontSize: "0.9rem" }}>
              Electronics
            </Link>
            <Link href="/products?category=fashion" style={{ color: "#212121", fontWeight: 500, fontSize: "0.9rem" }}>
              Fashion
            </Link>
            <Link href="/products?category=ethnic" style={{ color: "#212121", fontWeight: 500, fontSize: "0.9rem" }}>
              Ethnic Wear
            </Link>
            <Link href="/products?category=appliances" style={{ color: "#212121", fontWeight: 500, fontSize: "0.9rem" }}>
              Home & Kitchen
            </Link>
            <Link href="/products" style={{ color: "#212121", fontWeight: 500, fontSize: "0.9rem" }}>
              All Products
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
