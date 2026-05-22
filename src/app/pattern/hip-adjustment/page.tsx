"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [yourHip,setYourHip]=useState("");const [patternHip,setPatternHip]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const yh=parseFloat(yourHip)||0;const ph=parseFloat(patternHip)||0;const diff=yh-ph;const perSide=diff/4;const hasResult=yh>0&&ph>0;const resultValue=(diff>0?"+":"")+diff.toFixed(1)+"\" total hip adjustment";const resultLabel=diff>0?"Increase":"Decrease";

  const faqItems = [{q:"Where do I adjust hip width?",a:"At both side seams, grading smoothly from the waist to the hip line. Maintain the same hem width."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Hip Adjustment Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📐</span> Pattern Tool #108</span>
            <h1>Hip Adjustment Calculator</h1>
            <p>Calculate hip curve adjustments for different hip shapes.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="yh">Your hip measurement (in)</label><input id="yh" type="number" className="input-field" placeholder="e.g., 42" value={yourHip} onChange={e=>setYourHip(e.target.value)} min="0" step="0.5"/></div><div className="input-group"><label className="input-label" htmlFor="ph">Pattern hip measurement (in)</label><input id="ph" type="number" className="input-field" placeholder="e.g., 40" value={patternHip} onChange={e=>setPatternHip(e.target.value)} min="0" step="0.5"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Per quarter (per seam)</span><strong>{perSide>0?"+":""}{perSide.toFixed(3)}&quot;</strong></div><div className={styles.resultRow}><span>Method</span><strong>{Math.abs(diff)>2?"Grade from waist to hip":"Blend at side seam"}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/size-grader" className="related-tool-link">📊 Size Grader</a><a href="/pattern/between-sizes-grader" className="related-tool-link">🔀 Between Sizes</a></div></aside>
      </div>
    </div>
  );
}