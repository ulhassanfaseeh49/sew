"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [originalRepeat,setOriginalRepeat]=useState("");const [scalePct,setScalePct]=useState("125");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const or2=parseFloat(originalRepeat)||0;const sp=parseFloat(scalePct)||100;const newRepeat=or2*(sp/100);const hasResult=or2>0;const resultValue=newRepeat.toFixed(2)+"\" new repeat";const resultLabel="repeat scaled from "+or2+"\" at "+sp+"%";

  const faqItems = [{q:"Why does pattern repeat matter when scaling?",a:"If you scale a garment but the fabric repeat stays the same, matching may require different yardage."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Pattern Repeat Scaling Tool"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🔁</span> Pattern Tool #111</span>
            <h1>Pattern Repeat Scaling Tool</h1>
            <p>Scale pattern repeat dimensions proportionally for resized garments.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="or">Original repeat (in)</label><input id="or" type="number" className="input-field" placeholder="e.g., 12" value={originalRepeat} onChange={e=>setOriginalRepeat(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label" htmlFor="sp">Scale percentage</label><input id="sp" type="number" className="input-field" placeholder="e.g., 125" value={scalePct} onChange={e=>setScalePct(e.target.value)} min="1"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Original repeat</span><strong>{or2}&quot;</strong></div><div className={styles.resultRow}><span>Scaled repeat</span><strong>{newRepeat.toFixed(2)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/pattern-repeat-calculator" className="related-tool-link">🔁 Repeat Yardage</a><a href="/pattern/percentage-scaler" className="related-tool-link">📐 % Scaler</a></div></aside>
      </div>
    </div>
  );
}