import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

export const revalidate = 0; // Disable caching so it always shows latest products

export default async function Home() {
  let electronics = [];
  let fashion = [];
  let ethnic = [];
  let appliances = [];

  try {
    await connectToDatabase();
    
    const fetchCategory = async (keyword) => {
      const products = await Product.find({ name: { $regex: keyword, $options: "i" } }).limit(10).lean();
      return products.map(p => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString()
      }));
    };

    electronics = await fetchCategory("Laptop|TV|Smartphone|Headphone");
    fashion = await fetchCategory("Sneaker|Watch|Jeans|T-Shirt");
    ethnic = await fetchCategory("Saree|Kurta|Lehenga");
    appliances = await fetchCategory("Espresso|Purifier|Vacuum|Mixer");
    
  } catch (err) {
    console.error("Database connection failed on Vercel. Serving static fallback data.", err);
    // Provide beautiful static fallback data so the portfolio NEVER crashes
    const fallbackProducts = [
      { _id: "1", name: "Premium Smartphone - Midnight Blue", price: 45000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
      { _id: "2", name: "Smart TV 4K - Titanium Silver", price: 65000, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
      { _id: "3", name: "Noise Cancelling Headphones", price: 12000, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
    ];
    const fashionFallback = [
      { _id: "4", name: "Classic Sneakers - Alpine White", price: 4500, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
      { _id: "5", name: "Designer Watch - Rose Gold", price: 8900, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
    ];
    const ethnicFallback = [
      { _id: "6", name: "Handwoven Silk Saree", price: 15000, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
      { _id: "7", name: "Designer Lehenga - Crimson Red", price: 25000, image: "https://images.unsplash.com/photo-1615886753866-79396abc446e?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
    ];
    const appliancesFallback = [
      { _id: "8", name: "Pro Espresso Machine", price: 32000, image: "https://images.unsplash.com/photo-1556910103-1c02745a872f?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
      { _id: "9", name: "Smart Air Purifier", price: 14000, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500", amazonLink: "https://amazon.in", flipkartLink: "https://flipkart.com" },
    ];
    electronics = fallbackProducts;
    fashion = fashionFallback;
    ethnic = ethnicFallback;
    appliances = appliancesFallback;
  }

  const renderProductRow = (title, categoryProducts, categoryPath) => (
    <section style={{ marginBottom: "3rem", padding: "1rem", backgroundColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "1rem", borderBottom: "1px solid #f1f3f6", paddingBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>{title}</h2>
        <Link href={`/products?category=${categoryPath}`} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
          View All
        </Link>
      </div>
      <div className="flex" style={{ gap: "1rem", overflowX: "auto", paddingBottom: "1rem", padding: "0.5rem" }}>
        {categoryProducts.map(product => (
          <Link href={`/products/${product._id}`} key={product._id} className="product-card" style={{ minWidth: "220px", maxWidth: "220px", textDecoration: "none" }}>
            <div style={{ height: "180px", marginBottom: "1rem", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9", padding: "10px" }}>
              <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 500, color: "#212121", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
            <p style={{ color: "#388e3c", fontWeight: 500, marginTop: "auto", fontSize: "1.1rem" }}>₹{product.price.toLocaleString('en-IN')}</p>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="animate-fade-in" style={{ backgroundColor: "#f1f3f6", padding: "1rem 0" }}>
      <div className="container">
        
        {/* Sleek Promo Banner */}
        <div style={{ 
          background: "linear-gradient(90deg, #2874f0 0%, #1e5bb8 100%)", 
          borderRadius: "4px",
          padding: "3rem 2rem", 
          marginBottom: "2rem", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          color: "#fff"
        }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>The Grand Indian Festival</h1>
            <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>Unbeatable deals on 10,000+ products. Upgrade your lifestyle today.</p>
          </div>
          <Link href="/products" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "2px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            Explore Deals
          </Link>
        </div>

        {renderProductRow("Best of Electronics", electronics, "electronics")}
        {renderProductRow("Trending Ethnic Wear", ethnic, "ethnic")}
        {renderProductRow("Men's & Women's Fashion", fashion, "fashion")}
        {renderProductRow("Home & Kitchen Appliances", appliances, "appliances")}

      </div>
    </div>
  );
}
