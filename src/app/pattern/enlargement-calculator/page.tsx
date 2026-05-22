"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [gridScale,setGridScale]=useState("");const [targetScale,setTargetScale]=useState("1");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const gs=parseFloat(gridScale)||0;const ts=parseFloat(targetScale)||1;const pct=gs>0?(ts/gs)*100:0;const hasResult=gs>0;const resultValue=pct.toFixed(0)+"%";const resultLabel="print/copy at "+pct.toFixed(0)+"% to enlarge";

  const faqItems = [{q:"How do I enlarge a pattern from a book?",a:"Count the grid squares, then redraw each line at the enlarged scale, or use a copy shop at the calculated percentage."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Pattern Enlargement Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🔍</span> Pattern Tool #96</span>
            <h1>Pattern Enlargement Calculator</h1>
            <p>Enlarge mini patterns to full size based on grid scale.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="gs">Grid: 1 square = ___ inches</label><input id="gs" type="number" className="input-field" placeholder="e.g., 0.25" value={gridScale} onChange={e=>setGridScale(e.target.value)} min="0" step="0.0625"/></div><div className="input-group"><label className="input-label" htmlFor="ts">Target: 1 square = ___ inches</label><input id="ts" type="number" className="input-field" value={targetScale} onChange={e=>setTargetScale(e.target.value)} min="0" step="0.25"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Scale factor</span><strong>{(ts/gs).toFixed(2)}x</strong></div><div className={styles.resultRow}><span>Print percentage</span><strong>{pct.toFixed(0)}%</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/reduction-calculator" className="related-tool-link">🔎 Reduction</a><a href="/pattern/copy-shop-guide" className="related-tool-link">🖨️ Copy Shop</a></div></aside>
      </div>
    </div>
  );
}