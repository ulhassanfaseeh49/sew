"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [dollHeight,setDollHeight]=useState("18");const [humanHeight,setHumanHeight]=useState("65");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const dh=parseFloat(dollHeight)||18;const hh=parseFloat(humanHeight)||65;const scalePct=(dh/hh)*100;const sa=scalePct<30?"1/8\"":scalePct<50?"3/16\"":"1/4\"";const hasResult=true;const resultValue=scalePct.toFixed(1)+"% of human size";const resultLabel=dh+"\" doll from "+hh+"\" human";

  const faqItems = [{q:"Can I just shrink a human pattern for dolls?",a:"Proportions differ between dolls and humans, so you may need to adjust proportions after scaling."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Doll Clothes Scaling Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🪆</span> Pattern Tool #110</span>
            <h1>Doll Clothes Scaling Calculator</h1>
            <p>Scale human garment patterns to doll sizes.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Doll size</label><select className="input-field" value={dollHeight} onChange={e=>setDollHeight(e.target.value)}><option value="11.5">Barbie (11.5&quot;)</option><option value="18">American Girl (18&quot;)</option><option value="14.5">WellieWishers (14.5&quot;)</option><option value="6">Mini (6&quot;)</option></select></div><div className="input-group"><label className="input-label" htmlFor="hh">Human height (in)</label><input id="hh" type="number" className="input-field" value={humanHeight} onChange={e=>setHumanHeight(e.target.value)} min="48"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Scale factor</span><strong>{(dh/hh).toFixed(3)}x</strong></div><div className={styles.resultRow}><span>Print at</span><strong>{scalePct.toFixed(1)}%</strong></div><div className={styles.resultRow}><span>Recommended SA</span><strong>{sa}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/percentage-scaler" className="related-tool-link">📐 % Scaler</a><a href="/pattern/reduction-calculator" className="related-tool-link">🔎 Reduction</a></div></aside>
      </div>
    </div>
  );
}