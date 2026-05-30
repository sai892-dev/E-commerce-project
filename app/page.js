import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

export const revalidate = 0; // Disable caching so it always shows latest products

export default async function Home() {
  await connectToDatabase();
  
  // Since we now have 10,000 products, fetching all of them will crash the app.
  // We will fetch a limited number of items per category query.
  
  const fetchCategory = async (keyword) => {
    const products = await Product.find({ name: { $regex: keyword, $options: "i" } }).limit(10).lean();
    return products.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString()
    }));
  };

  const electronics = await fetchCategory("Laptop|TV|Smartphone|Headphone");
  const fashion = await fetchCategory("Sneaker|Watch|Jeans|T-Shirt");
  const ethnic = await fetchCategory("Saree|Kurta|Lehenga");
  const appliances = await fetchCategory("Espresso|Purifier|Vacuum|Mixer");

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
