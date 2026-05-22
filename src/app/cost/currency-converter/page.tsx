"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [amount,setAmount]=useState("");const [fromCur,setFromCur]=useState("USD");const [toCur,setToCur]=useState("EUR");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const rates: Record<string,number>={USD:1,EUR:0.92,GBP:0.79,CAD:1.36,AUD:1.53,JPY:149.5};const amt=parseFloat(amount)||0;const inUSD=amt/(rates[fromCur]||1);const converted=inUSD*(rates[toCur]||1);const hasResult=amt>0;const symbols: Record<string,string>={USD:"$",EUR:"€",GBP:"£",CAD:"C$",AUD:"A$",JPY:"¥"};const resultValue=(symbols[toCur]||"")+converted.toFixed(2);const resultLabel=amt+" "+fromCur+" = "+converted.toFixed(2)+" "+toCur;

  const faqItems = [{q:"Are these rates accurate?",a:"These are approximate rates for estimation. Check current rates before making purchases."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Currency Converter for Fabric Shopping"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>💱</span> Cost Tool #82</span>
            <h1>Currency Converter for Fabric Shopping</h1>
            <p>Convert currencies for international fabric shopping.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="amt">Amount</label><input id="amt" type="number" className="input-field" placeholder="e.g., 25" value={amount} onChange={e=>setAmount(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">From</label><select className="input-field" value={fromCur} onChange={e=>setFromCur(e.target.value)}><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="CAD">CAD (C$)</option><option value="AUD">AUD (A$)</option><option value="JPY">JPY (¥)</option></select></div><div className="input-group"><label className="input-label">To</label><select className="input-field" value={toCur} onChange={e=>setToCur(e.target.value)}><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="CAD">CAD (C$)</option><option value="AUD">AUD (A$)</option><option value="JPY">JPY (¥)</option></select></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Rate</span><strong>1 {fromCur} = {((rates[toCur]||1)/(rates[fromCur]||1)).toFixed(4)} {toCur}</strong></div>
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button>
                </div>
              </div>
            )}
          </div>
          <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/online-vs-local" className="related-tool-link">🛒 Online vs Local</a><a href="/cost/per-yard" className="related-tool-link">💰 Per Yard</a></div></aside>
      </div>
    </div>
  );
}