"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [totalCost,setTotalCost]=useState("");const [wearsPerWeek,setWearsPerWeek]=useState("1");const [yearsOwned,setYearsOwned]=useState("3");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const tc=parseFloat(totalCost)||0;const wpw=parseFloat(wearsPerWeek)||1;const yrs=parseFloat(yearsOwned)||3;const totalWears=Math.round(wpw*52*yrs);const cpw=totalWears>0?tc/totalWears:0;const rating=cpw<1?"Excellent":cpw<3?"Good":cpw<5?"Fair":"Poor value";const hasResult=tc>0;const resultValue="$"+cpw.toFixed(2)+"/wear";const resultLabel=totalWears+" total wears over "+yrs+" years — "+rating;

  const faqItems = [{q:"What is a good cost per wear?",a:"Under $1/wear is excellent. $1-3 is good. Above $5/wear, consider if the garment is worth making."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Cost Per Wear Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>👔</span> Cost Tool #77</span>
            <h1>Cost Per Wear Calculator</h1>
            <p>Total garment cost ÷ estimated number of wears.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label" htmlFor="tc">Total garment cost ($)</label><input id="tc" type="number" className="input-field" placeholder="e.g., 65" value={totalCost} onChange={e=>setTotalCost(e.target.value)} min="0" step="0.01"/></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Wears per week</label><select className="input-field" value={wearsPerWeek} onChange={e=>setWearsPerWeek(e.target.value)}><option value="0.25">Monthly</option><option value="0.5">Biweekly</option><option value="1">Weekly</option><option value="2">2x/week</option><option value="3">3x/week</option><option value="5">Daily</option></select></div><div className="input-group"><label className="input-label">Years you will own it</label><select className="input-field" value={yearsOwned} onChange={e=>setYearsOwned(e.target.value)}><option value="1">1 year</option><option value="2">2 years</option><option value="3">3 years</option><option value="5">5 years</option><option value="10">10 years</option></select></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Total wears</span><strong>{totalWears}</strong></div><div className={styles.resultRow}><span>Rating</span><strong>{rating}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-garment" className="related-tool-link">👗 Per Garment</a><a href="/cost/project-estimator" className="related-tool-link">📊 Project Cost</a></div></aside>
      </div>
    </div>
  );
}