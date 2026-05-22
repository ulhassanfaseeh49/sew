"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [curveType,setCurveType]=useState("concave");const [sa,setSa]=useState("0.625");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const seam=parseFloat(sa)||0.625;const clipSpacing=curveType==="tight"?0.375:curveType==="concave"?0.5:0.75;const trimTo=seam>0.375?seam-0.125:seam;const method=curveType==="concave"?"Clip into SA":"Notch wedges from SA";const hasResult=true;const resultValue=method+" every "+clipSpacing+"\"";const resultLabel=curveType+" curve with "+sa+"\" SA";

  const faqItems = [{q:"Why clip curves differently?",a:"Concave curves need clips so the SA can spread open. Convex curves need notches so SA can overlap without bunching."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Curved Seams Guide"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>〰️</span> Seam Tool #92</span>
            <h1>Curved Seams Guide</h1>
            <p>Guide for grading and clipping seam allowances on curves.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Curve type</label><select className="input-field" value={curveType} onChange={e=>setCurveType(e.target.value)}><option value="concave">Concave (inward, like neckline)</option><option value="convex">Convex (outward, like princess seam)</option><option value="tight">Tight curve (like armhole)</option></select></div><div className="input-group"><label className="input-label">Seam allowance</label><select className="input-field" value={sa} onChange={e=>setSa(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.625">5/8&quot;</option></select></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Method</span><strong>{method}</strong></div><div className={styles.resultRow}><span>Clip/notch spacing</span><strong>{clipSpacing}&quot; apart</strong></div><div className={styles.resultRow}><span>Trim SA to</span><strong>{trimTo}&quot; to reduce bulk</strong></div><div className={styles.resultRow}><span>Tip</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{curveType==="concave"?"Clip to (not through) the stitching line":"Cut small V-shaped notches so SA lies flat"}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/grading" className="related-tool-link">📐 Grading</a><a href="/seam-allowance/standard-guide" className="related-tool-link">📖 Standard Guide</a></div></aside>
      </div>
    </div>
  );
}