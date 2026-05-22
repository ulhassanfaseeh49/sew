"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
  const [prev,setPrev]=useState("");const [current,setCurrent]=useState("");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const p=parseFloat(prev)||0;const c=parseFloat(current)||0;const diff=c-p;const significant=Math.abs(diff)>0.5;const hasResult=p>0&&c>0;const resultValue=(diff>0?"+":"")+diff.toFixed(2)+"\"";const resultLabel=significant?" Significant change — check pattern fit":" Within normal variation";
  const faqItems=[{q:"How much change is significant?",a:"More than 1/2 inch at bust, waist, or hip may affect pattern fit and require re-sizing."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Measurement Change Tracker"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span></span> Body Tool</span><h1>Measurement Change Tracker</h1><p>Track measurement changes over time.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Previous measurement (in)</label><input type="number" className="input-field" placeholder="e.g., 36" value={prev} onChange={e=>setPrev(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Current measurement (in)</label><input type="number" className="input-field" placeholder="e.g., 37" value={current} onChange={e=>setCurrent(e.target.value)} min="0" step="0.25"/></div></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Previous</span><strong>{p}&quot;</strong></div><div className={styles.resultRow}><span>Current</span><strong>{c}&quot;</strong></div><div className={styles.resultRow}><span>Change</span><strong style={{color:significant?"var(--color-warning)":"var(--color-success)"}}>{diff>0?"+":""}{diff.toFixed(2)}&quot;</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/measurement-tracker" className="related-tool-link"><ClipboardCopy size={13} /> Tracker</a><a href="/body/alterations-calculator" className="related-tool-link"><Scissors size={13} /> Alterations</a></div></aside></div></div>);
}