"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [bodyMeasure,setBodyMeasure]=useState("");const [patternMeasure,setPatternMeasure]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const bm=parseFloat(bodyMeasure)||0;const pm=parseFloat(patternMeasure)||0;const totalEase=pm-bm;const wearingEase=Math.min(totalEase,2);const designEase=Math.max(totalEase-wearingEase,0);const fit=totalEase<1?"Very close fitting":totalEase<3?"Close fitting":totalEase<5?"Standard":totalEase<8?"Relaxed":"Oversized";const hasResult=bm>0&&pm>0;const resultValue=totalEase.toFixed(2)+"\" total ease";const resultLabel=fit+" fit";

  const faqItems = [{q:"What is the difference between wearing ease and design ease?",a:"Wearing ease is the minimum extra for movement (1-2 inches at bust). Design ease is additional ease for the style."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Ease Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📏</span> Pattern Tool #101</span>
            <h1>Ease Calculator</h1>
            <p>Calculate wearing ease and design ease by comparing body to pattern measurements.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="bm">Body measurement (in)</label><input id="bm" type="number" className="input-field" placeholder="e.g., 36" value={bodyMeasure} onChange={e=>setBodyMeasure(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label" htmlFor="pm">Pattern measurement (in)</label><input id="pm" type="number" className="input-field" placeholder="e.g., 40" value={patternMeasure} onChange={e=>setPatternMeasure(e.target.value)} min="0" step="0.25"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Total ease</span><strong>{totalEase.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Wearing ease (est.)</span><strong>{wearingEase.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Design ease (est.)</span><strong>{designEase.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Fit category</span><strong>{fit}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/ease-adjuster" className="related-tool-link">🔧 Ease Adjuster</a><a href="/pattern/full-bust-adjustment" className="related-tool-link">👗 FBA</a></div></aside>
      </div>
    </div>
  );
}