"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [pricePerYard,setPricePerYard]=useState("");const [yards,setYards]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const ppy=parseFloat(pricePerYard)||0;const yd=parseFloat(yards)||0;const total=ppy*yd;const perMeter=ppy/0.9144;const hasResult=ppy>0&&yd>0;const resultValue="$"+total.toFixed(2);const resultLabel=yd+" yards at $"+ppy.toFixed(2)+"/yd";

  const faqItems = [{q:"How do I calculate fabric cost?",a:"Multiply price per yard by the number of yards needed. Add tax and any cutting fees."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Cost Per Yard Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>💰</span> Cost Tool #67</span>
            <h1>Cost Per Yard Calculator</h1>
            <p>Calculate cost per yard or total cost from price per yard and yardage.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="ppy">Price per yard ($)</label><input id="ppy" type="number" className="input-field" placeholder="e.g., 12.99" value={pricePerYard} onChange={e=>setPricePerYard(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="yd">Yards needed</label><input id="yd" type="number" className="input-field" placeholder="e.g., 3.5" value={yards} onChange={e=>setYards(e.target.value)} min="0" step="0.125"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Price per meter</span><strong>${perMeter.toFixed(2)}/m</strong></div><div className={styles.resultRow}><span>Price per yard</span><strong>${ppy.toFixed(2)}/yd</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-meter" className="related-tool-link">💶 Per Meter</a><a href="/yardage/basic-calculator" className="related-tool-link">📐 Yardage Calculator</a></div></aside>
      </div>
    </div>
  );
}