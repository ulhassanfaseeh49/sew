"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, Target } from "lucide-react";
export default function Page(){
  const [bust,setBust]=useState("");const [waist,setWaist]=useState("");const [hip,setHip]=useState("");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const b=parseFloat(bust)||0;const w=parseFloat(waist)||0;const h=parseFloat(hip)||0;const hasResult=b>0||w>0||h>0;const resultValue="B:"+b+" / W:"+w+" / H:"+h;const resultLabel="your measurements";
  const faqItems=[{q:"How often should I remeasure?",a:"Every 3-6 months, or before starting a major garment project."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Body Measurement Tracker"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><ClipboardCopy size={14} strokeWidth={1.5} /> Body Tool</span><h1>Body Measurement Tracker</h1><p>Record and track your body measurements.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Bust (in)</label><input type="number" className="input-field" placeholder="e.g., 36" value={bust} onChange={e=>setBust(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="e.g., 28" value={waist} onChange={e=>setWaist(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field" placeholder="e.g., 38" value={hip} onChange={e=>setHip(e.target.value)} min="0" step="0.25"/></div></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}>{b>0&&<div className={styles.resultRow}><span>Bust</span><strong>{b}&quot;</strong></div>}{w>0&&<div className={styles.resultRow}><span>Waist</span><strong>{w}&quot;</strong></div>}{h>0&&<div className={styles.resultRow}><span>Hip</span><strong>{h}&quot;</strong></div>}</div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/measurement-guide" className="related-tool-link"><BookOpen size={13} /> Guide</a><a href="/body/pattern-size-selector" className="related-tool-link"><Target size={13} /> Size Selector</a></div></aside></div></div>);
}