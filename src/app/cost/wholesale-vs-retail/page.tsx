"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [retailPrice,setRetailPrice]=useState("");const [retailYards,setRetailYards]=useState("");const [wholesalePrice,setWholesalePrice]=useState("");const [moq,setMoq]=useState("");const [shipping,setShipping]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const rp=parseFloat(retailPrice)||0;const ry=parseFloat(retailYards)||0;const wp=parseFloat(wholesalePrice)||0;const mq=parseFloat(moq)||0;const sh=parseFloat(shipping)||0;const retailTotal=rp*ry;const wholesaleYards=Math.max(ry,mq);const wholesaleTotal=wp*wholesaleYards+sh;const savings=retailTotal-wholesaleTotal;const hasResult=rp>0&&wp>0&&ry>0;const resultValue=savings>0?"Wholesale saves $"+savings.toFixed(2):"Retail saves $"+Math.abs(savings).toFixed(2);const resultLabel="for "+ry+" yards needed";

  const faqItems = [{q:"When is wholesale worth it?",a:"Wholesale saves money when you need enough yardage to meet the minimum order quantity."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Wholesale vs Retail Comparator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🏭</span> Cost Tool #75</span>
            <h1>Wholesale vs Retail Comparator</h1>
            <p>Compare wholesale vs retail costs including MOQ and shipping.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Retail $/yd</label><input type="number" className="input-field" placeholder="e.g., 15" value={retailPrice} onChange={e=>setRetailPrice(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Yards needed</label><input type="number" className="input-field" placeholder="e.g., 10" value={retailYards} onChange={e=>setRetailYards(e.target.value)} min="0" step="0.125"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Wholesale $/yd</label><input type="number" className="input-field" placeholder="e.g., 8" value={wholesalePrice} onChange={e=>setWholesalePrice(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Min order (yards)</label><input type="number" className="input-field" placeholder="e.g., 15" value={moq} onChange={e=>setMoq(e.target.value)} min="0"/></div></div><div className="input-group"><label className="input-label">Wholesale shipping ($)</label><input type="number" className="input-field" placeholder="e.g., 12" value={shipping} onChange={e=>setShipping(e.target.value)} min="0" step="0.01"/></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Retail total</span><strong>${retailTotal.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Wholesale total</span><strong>${wholesaleTotal.toFixed(2)} ({wholesaleYards} yd + ${sh.toFixed(2)} ship)</strong></div><div className={styles.resultRow}><span>Savings</span><strong>${Math.abs(savings).toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link">💰 Per Yard</a><a href="/cost/batch-production" className="related-tool-link">🏭 Batch</a></div></aside>
      </div>
    </div>
  );
}