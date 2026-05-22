"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [waistToHip,setWaistToHip]=useState("");const [patternWTH,setPatternWTH]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const wth=parseFloat(waistToHip)||0;const pwth=parseFloat(patternWTH)||0;const adj=pwth-wth;const hasResult=wth>0&&pwth>0;const resultValue=adj>0?"Remove "+adj.toFixed(2)+"\" at center back":"No adjustment needed";const resultLabel="swayback adjustment";

  const faqItems = [{q:"What is a swayback?",a:"An inward curve of the lower back that causes excess fabric to bunch at the center back waist of a garment."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Swayback Adjustment Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🔄</span> Pattern Tool #106</span>
            <h1>Swayback Adjustment Calculator</h1>
            <p>Calculate swayback pattern adjustment amount.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="wth">Your center back waist-to-hip (in)</label><input id="wth" type="number" className="input-field" placeholder="e.g., 7" value={waistToHip} onChange={e=>setWaistToHip(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label" htmlFor="pwth">Pattern center back length (in)</label><input id="pwth" type="number" className="input-field" placeholder="e.g., 8" value={patternWTH} onChange={e=>setPatternWTH(e.target.value)} min="0" step="0.25"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Your measurement</span><strong>{wth}&quot;</strong></div><div className={styles.resultRow}><span>Pattern measurement</span><strong>{pwth}&quot;</strong></div><div className={styles.resultRow}><span>Adjustment</span><strong>{adj>0?"-"+adj.toFixed(2)+"\"":"None"}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/height-adjuster" className="related-tool-link">📐 Height</a><a href="/pattern/full-bust-adjustment" className="related-tool-link">👗 FBA</a></div></aside>
      </div>
    </div>
  );
}