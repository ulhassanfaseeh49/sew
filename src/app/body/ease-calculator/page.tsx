"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
export default function Page(){
  const [body,setBody]=useState("");const [wearing,setWearing]=useState("2");const [design,setDesign]=useState("0");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const b=parseFloat(body)||0;const we=parseFloat(wearing)||0;const de=parseFloat(design)||0;const pattern=b+we+de;const hasResult=b>0;const resultValue=pattern.toFixed(2)+"\"";const resultLabel="pattern measurement (body + "+we+"\" wearing + "+de+"\" design)";
  const faqItems=[{q:"What is wearing ease vs design ease?",a:"Wearing ease (1-2 in) is minimum for movement. Design ease is extra for the style (loose vs fitted)."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Ease Calculation Tool"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Body Tool #115</span><h1>Ease Calculation Tool</h1><p>Calculate total ease: body + wearing ease + design ease.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Body measurement (in)</label><input type="number" className="input-field" placeholder="e.g., 36" value={body} onChange={e=>setBody(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Wearing ease (in)</label><input type="number" className="input-field" value={wearing} onChange={e=>setWearing(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Design ease (in)</label><input type="number" className="input-field" value={design} onChange={e=>setDesign(e.target.value)} min="0" step="0.25"/></div></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Body</span><strong>{b}&quot;</strong></div><div className={styles.resultRow}><span>Wearing ease</span><strong>+{we}&quot;</strong></div><div className={styles.resultRow}><span>Design ease</span><strong>+{de}&quot;</strong></div><div className={styles.resultRow}><span>Total pattern</span><strong>{pattern.toFixed(2)}&quot;</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/ease-calculator" className="related-tool-link">📏 Pattern Ease</a><a href="/body/measurement-guide" className="related-tool-link">📖 Guide</a></div></aside></div></div>);
}