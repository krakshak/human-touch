import React, { useState } from "react";
import { registerUser } from '../supabaseExamples';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const { user, error } = await registerUser(email, password);
    if (user) {
      setMessage("Registration successful! Redirecting...");
      localStorage.setItem('supabaseUser', JSON.stringify(user));
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setMessage(error?.message || "Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{maxWidth:420, marginTop:56}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:18}}>
        {/* Lock SVG icon */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1bb76e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h1 style={{textAlign:'center',marginBottom:18}}>Sign Up</h1>
      <form className="auth-form" onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="humanize-btn" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
      </form>
      <div style={{textAlign:'center',marginTop:12}}>
        <span>Already have an account? <Link to="/login">Login</Link></span>
      </div>
      {message && <div className="auth-message">{message}</div>}
    </div>
  );
}
