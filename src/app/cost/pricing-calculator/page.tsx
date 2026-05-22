"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [materials,setMaterials]=useState("");const [hours,setHours]=useState("");const [hourlyRate,setHourlyRate]=useState("15");const [overheadPct,setOverheadPct]=useState("10");const [profitPct,setProfitPct]=useState("30");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const mat=parseFloat(materials)||0;const hrs=parseFloat(hours)||0;const rate=parseFloat(hourlyRate)||0;const oh=parseFloat(overheadPct)||0;const pf=parseFloat(profitPct)||0;const labor=hrs*rate;const subtotal=mat+labor;const overhead=subtotal*(oh/100);const base=subtotal+overhead;const profit=base*(pf/100);const sellingPrice=base+profit;const hasResult=mat>0;const resultValue="$"+sellingPrice.toFixed(2);const resultLabel="recommended selling price";

  const faqItems = [{q:"How do I price handmade items?",a:"Materials + Labor + Overhead + Profit. Never price below materials + labor or you lose money."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Handmade Item Pricing Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🏷️</span> Cost Tool #73</span>
            <h1>Handmade Item Pricing Calculator</h1>
            <p>Calculate selling price: material cost + labor + overhead + profit margin.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="mat">Total materials ($)</label><input id="mat" type="number" className="input-field" placeholder="e.g., 25" value={materials} onChange={e=>setMaterials(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="hrs">Hours to make</label><input id="hrs" type="number" className="input-field" placeholder="e.g., 4" value={hours} onChange={e=>setHours(e.target.value)} min="0" step="0.25"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="rate">Hourly rate ($)</label><input id="rate" type="number" className="input-field" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Overhead (%)</label><select className="input-field" value={overheadPct} onChange={e=>setOverheadPct(e.target.value)}><option value="5">5%</option><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option></select></div></div><div className="input-group"><label className="input-label">Profit margin (%)</label><select className="input-field" value={profitPct} onChange={e=>setProfitPct(e.target.value)}><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option><option value="50">50%</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Materials</span><strong>${mat.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Labor ({hrs}h × ${rate})</span><strong>${labor.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Overhead ({oh}%)</span><strong>${overhead.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Profit ({pf}%)</span><strong>${profit.toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/batch-production" className="related-tool-link">🏭 Batch Production</a><a href="/cost/per-garment" className="related-tool-link">👗 Per Garment</a></div></aside>
      </div>
    </div>
  );
}