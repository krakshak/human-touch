import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../App.css";

const plans = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    credits: 20,
    features: [
      "20 credits/month",
      "Basic AI humanizing",
      "Community support"
    ],
    highlight: false
  },
  {
    name: "Pro",
    priceMonthly: 12,
    priceYearly: 96, // 20% off
    credits: 300,
    features: [
      "300 credits/month",
      "Advanced AI humanizing",
      "Priority support"
    ],
    highlight: true
  },
  {
    name: "Enterprise",
    priceMonthly: 39,
    priceYearly: 312, // 33% off
    credits: 1500,
    features: [
      "1500 credits/month",
      "Team dashboard",
      "Dedicated manager"
    ],
    highlight: false
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    navigate('/payment', { state: { plan } });
  };

  return (
    <div className="container pricing-page">
      <h1 className="hero-title" style={{marginBottom: 8, textAlign:'center', fontWeight:800, fontSize:'2.1rem', color:'#212b36', letterSpacing:'.01em'}}>Get the most undetectable The Human Touch AI humanizer</h1>
      <p className="hero-subtitle" style={{marginBottom: 24, color: '#38b2ac', fontWeight: 600}}>
        3-day money-back guarantee. If you're not happy, we'll refund your payment.
      </p>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 36}}>
        <span style={{fontWeight: 500}}>Monthly</span>
        <label className="switch">
          <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(v => !v)} />
          <span className="slider round"></span>
        </label>
        <span style={{fontWeight: 500}}>Yearly <span style={{color: '#377dff', fontWeight: 700}}>(20% off)</span></span>
      </div>
      <div className="pricing-table">
        {plans.map(plan => (
          <div className={`plan${plan.highlight ? " plan-highlight" : ""}`} key={plan.name}>
            <h2>{plan.name}</h2>
            <div className="plan-price">
              <span className="plan-currency">$</span>
              <span className="plan-amount">{isYearly ? plan.priceYearly : plan.priceMonthly}</span>
              <span className="plan-duration">/{isYearly ? "year" : "month"}</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <button className="humanize-btn" style={{marginTop: 18}} onClick={() => handleSelectPlan(plan.name)}>{plan.name === "Free" ? "Get Started" : "Choose Plan"}</button>
          </div>
        ))}
      </div>
      <style>{`
        .pricing-page {
          background: transparent;
          box-shadow: none;
        }
        .pricing-table {
          display: flex;
          gap: 32px;
          justify-content: center;
          margin-top: 24px;
        }
        .plan {
          background: #181f2b;
          color: #f7fafc;
          border-radius: 16px;
          padding: 32px 30px 28px 30px;
          box-shadow: 0 4px 32px rgba(44, 62, 80, 0.10);
          text-align: center;
          min-width: 220px;
          border: 2px solid #232e42;
          transition: box-shadow 0.2s, border 0.2s;
        }
        .plan-highlight {
          border: 2.5px solid #377dff;
          box-shadow: 0 8px 32px rgba(55, 125, 255, 0.13);
        }
        .plan h2 {
          color: #67b6fc;
          margin-bottom: 16px;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .plan-price {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 18px;
          color: #fff;
        }
        .plan-currency {
          font-size: 1.3rem;
          vertical-align: super;
        }
        .plan-duration {
          font-size: 1.1rem;
          color: #b8d4fc;
          margin-left: 2px;
        }
        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 0 0;
          text-align: left;
        }
        .plan-features li {
          margin: 10px 0;
          color: #eaf2fb;
          font-size: 1.06rem;
        }
        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .switch input {display:none;}
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #b8d4fc;
          transition: .4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #377dff;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
}
