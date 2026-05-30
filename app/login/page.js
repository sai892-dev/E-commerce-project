"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push(redirect);
      router.refresh(); // Refresh to update session state in Navbar
    }
  };

  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</div>}>
      <div className="animate-fade-in" style={{ maxWidth: "400px", margin: "4rem auto" }}>
        <div className="card">
          <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Sign In</h1>
          
          {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center", backgroundColor: "#fee2e2", padding: "0.5rem", borderRadius: "8px" }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group" style={{ marginBottom: "2rem" }}>
              <label>Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "1rem" }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Don't have an account? <Link href={`/register?redirect=${redirect}`} style={{ color: "var(--accent-color)", textDecoration: "underline" }}>Register here</Link>
          </p>
        </div>
      </div>
    </Suspense>
  );
}
