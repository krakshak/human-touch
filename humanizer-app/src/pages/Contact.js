import React, { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container" style={{maxWidth:420, marginTop:56}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:18}}>
        {/* Mail SVG icon */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#38b2ac" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><polyline points="22,6 12,13 2,6"/></svg>
      </div>
      <h1 style={{textAlign:'center',marginBottom:18}}>Contact Us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Your message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
        />
        <button type="submit" className="humanize-btn">Send</button>
      </form>
      {sent && <div className="contact-message">Thank you for contacting us!</div>}
    </div>
  );
}
