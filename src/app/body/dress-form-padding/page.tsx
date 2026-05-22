"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
export default function Page(){
  const [formBust,setFormBust]=useState("");const [yourBust,setYourBust]=useState("");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const fb=parseFloat(formBust)||0;const yb=parseFloat(yourBust)||0;const diff=yb-fb;const layers=Math.ceil(diff/0.25);const hasResult=fb>0&&yb>0;const resultValue=diff>0?diff.toFixed(1)+"\" padding needed":"No padding needed";const resultLabel="bust padding (approx "+layers+" layers of batting)";
  const faqItems=[{q:"What material for dress form padding?",a:"Quilt batting, foam, or cotton padding. Pin in place and cover with a knit fabric."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Dress Form Padding Calculator"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span>🧵</span> Body Tool #125</span><h1>Dress Form Padding Calculator</h1><p>Calculate padding needed to match your measurements.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Dress form bust (in)</label><input type="number" className="input-field" placeholder="e.g., 34" value={formBust} onChange={e=>setFormBust(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Your bust (in)</label><input type="number" className="input-field" placeholder="e.g., 37" value={yourBust} onChange={e=>setYourBust(e.target.value)} min="0" step="0.25"/></div></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Difference</span><strong>{diff.toFixed(1)}&quot;</strong></div><div className={styles.resultRow}><span>Batting layers (est.)</span><strong>~{layers}</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/dress-form-calculator" className="related-tool-link">👗 Form Size</a><a href="/body/measurement-tracker" className="related-tool-link">📋 Tracker</a></div></aside></div></div>);
}