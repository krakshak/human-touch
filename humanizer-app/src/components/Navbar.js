import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import "../App.css";

export default function Navbar() {
  const navigate = useNavigate();
  const userObj = localStorage.getItem('supabaseUser');
  let userEmail = '';
  let isLoggedIn = false;
  if (userObj) {
    isLoggedIn = true;
    try {
      const user = JSON.parse(userObj);
      userEmail = user.email || user.user?.email || '';
    } catch {}
  }
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabaseUser');
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">The Human Touch</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/payment">Payment</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {isLoggedIn ? (
          <>
            <li style={{color:'#377dff',fontWeight:600}}>{userEmail}</li>
            <li><button onClick={handleLogout} style={{background:'none',border:'none',color:'#e53e3e',cursor:'pointer',fontWeight:600}}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
