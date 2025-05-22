import React, { useState, useEffect } from "react";
import { loginUser } from '../supabaseExamples';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      localStorage.setItem('supabaseSession', JSON.stringify(session));
    }
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem('supabaseSession', JSON.stringify(session));
      } else {
        localStorage.removeItem('supabaseSession');
      }
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }
    setLoading(true);
    const { user, error } = await loginUser(email, password);
    if (user) {
      setMessage("Login successful! Redirecting...");
      localStorage.setItem('supabaseUser', JSON.stringify(user));
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setMessage(error?.message || "Login failed.");
    }
    setLoading(false);
  };

  // Logout function
  const handleLogout = () => {
    supabase.auth.signOut();
    localStorage.removeItem('supabaseUser');
    navigate('/login');
  };



  return (
    <div className="container" style={{maxWidth:420, marginTop:56}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:18}}>
        {/* Lock SVG icon */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#377dff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h1 style={{textAlign:'center',marginBottom:18}}>Login</h1>
      <form className="auth-form" onSubmit={handleLogin}>
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
        <button type="submit" className="humanize-btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <div style={{textAlign:'center',marginTop:12}}>
        <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
      </div>
      {message && <div className="auth-message">{message}</div>}
    </div>
  );
}
