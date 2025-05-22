import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.plan;

  return (
    <div className="container" style={{maxWidth:420, marginTop:56}}>
      <div className="payment-card">
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:18}}>
          {/* Credit card SVG icon */}
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1bb76e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="3"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          <h2 style={{marginTop:10,marginBottom:0,fontWeight:700,fontSize:'1.3rem',color:'#212b36'}}>Payment</h2>
          {selectedPlan ? (
            <div style={{marginTop:8,marginBottom:10,fontWeight:600,fontSize:'1.09rem',color:'#1bb76e',background:'#eafaf1',padding:'7px 18px',borderRadius:8}}>Selected Plan: {selectedPlan}</div>
          ) : (
            <div style={{marginTop:8,marginBottom:10,fontWeight:500,fontSize:'1.03rem',color:'#e53e3e',background:'#fff6f6',padding:'7px 18px',borderRadius:8}}>
              No plan selected. <button style={{marginLeft:8,background:'#1bb76e',color:'#fff',border:'none',borderRadius:6,padding:'3px 10px',fontWeight:600,cursor:'pointer'}} onClick={()=>navigate('/pricing')}>Go to Pricing</button>
            </div>
          )}
        </div>
        <p style={{textAlign:'center',color:'#5a6a85',marginBottom:18}}>This is a mock payment screen. Payment processing is not enabled in this demo.</p>
        <form className="payment-form">
          <div className="input-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input id="cardNumber" type="text" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="input-row">
            <div className="input-group" style={{flex:1,marginRight:10}}>
              <label htmlFor="expiry">Expiry</label>
              <input id="expiry" type="text" placeholder="MM/YY" />
            </div>
            <div className="input-group" style={{flex:1}}>
              <label htmlFor="cvc">CVC</label>
              <input id="cvc" type="text" placeholder="CVC" />
            </div>
          </div>
          <button className="humanize-btn" type="submit" style={{marginTop:18}}>Pay Now</button>
        </form>
      </div>
    </div>
  );
}
