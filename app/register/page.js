"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        // Auto sign in after register
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInRes?.error) {
          setError(signInRes.error);
        } else {
          router.push(redirect);
          router.refresh();
        }
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <div className="card">
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Create Account</h1>
        
        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center", backgroundColor: "#fee2e2", padding: "0.5rem", borderRadius: "8px" }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="input-group" style={{ marginBottom: "2rem" }}>
            <label>Account Type (For Demo Purposes)</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Regular User</option>
              <option value="admin">Store Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "1rem" }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account? <Link href={`/login?redirect=${redirect}`} style={{ color: "var(--accent-color)", textDecoration: "underline" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
