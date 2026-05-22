"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [materialCost,setMaterialCost]=useState("");const [patternCost,setPatternCost]=useState("");const [timesUsed,setTimesUsed]=useState("1");const [hours,setHours]=useState("");const [hourlyRate,setHourlyRate]=useState("15");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const mc=parseFloat(materialCost)||0;const pc=parseFloat(patternCost)||0;const tu=parseInt(timesUsed)||1;const hr=parseFloat(hours)||0;const rate=parseFloat(hourlyRate)||0;const patternPerUse=pc/tu;const laborCost=hr*rate;const totalCost=mc+patternPerUse+laborCost;const hasResult=mc>0;const resultValue="$"+totalCost.toFixed(2);const resultLabel="total cost per garment";

  const faqItems = [{q:"Should I count my labor time?",a:"For personal projects, labor is free. For selling, always include labor at a fair hourly rate."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Cost Per Garment Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>👗</span> Cost Tool #71</span>
            <h1>Cost Per Garment Calculator</h1>
            <p>Total cost per garment including materials, pattern amortization, and labor.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="mc">Total materials ($)</label><input id="mc" type="number" className="input-field" placeholder="e.g., 40" value={materialCost} onChange={e=>setMaterialCost(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="pc">Pattern cost ($)</label><input id="pc" type="number" className="input-field" placeholder="e.g., 15" value={patternCost} onChange={e=>setPatternCost(e.target.value)} min="0" step="0.01"/></div></div><div className="input-group"><label className="input-label" htmlFor="tu">Times you will use this pattern</label><input id="tu" type="number" className="input-field" value={timesUsed} onChange={e=>setTimesUsed(e.target.value)} min="1"/></div><div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="hr">Hours to make</label><input id="hr" type="number" className="input-field" placeholder="e.g., 6" value={hours} onChange={e=>setHours(e.target.value)} min="0" step="0.5"/></div><div className="input-group"><label className="input-label" htmlFor="rate">Your hourly rate ($)</label><input id="rate" type="number" className="input-field" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} min="0" step="0.5"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Materials</span><strong>${mc.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Pattern (amortized)</span><strong>${patternPerUse.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Labor ({hr} hrs × ${rate}/hr)</span><strong>${laborCost.toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/pricing-calculator" className="related-tool-link">🏷️ Pricing</a><a href="/cost/project-estimator" className="related-tool-link">📊 Project Cost</a></div></aside>
      </div>
    </div>
  );
}