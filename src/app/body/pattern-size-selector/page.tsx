"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Scale, Target } from "lucide-react";
export default function Page(){
  const [bust,setBust]=useState("");const [waist,setWaist]=useState("");const [hip,setHip]=useState("");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const b=parseFloat(bust)||0;const sizes=[{s:6,b:30.5},{s:8,b:31.5},{s:10,b:32.5},{s:12,b:34},{s:14,b:36},{s:16,b:38},{s:18,b:40},{s:20,b:42}];const best=sizes.reduce((p,c)=>Math.abs(c.b-b)<Math.abs(p.b-b)?c:p);const hasResult=b>0;const resultValue="Size "+best.s;const resultLabel="based on "+b+"\" bust measurement";
  const faqItems=[{q:"Should I select size by bust or hip?",a:"For tops and dresses, use bust. For skirts and pants, use hip. For fitted dresses, you may need to blend sizes."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Pattern Size Selector"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><Target size={14} strokeWidth={1.5} /> Body Tool</span><h1>Pattern Size Selector</h1><p>Input measurements to get recommended pattern size.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Bust (in)</label><input type="number" className="input-field" placeholder="e.g., 36" value={bust} onChange={e=>setBust(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="e.g., 28" value={waist} onChange={e=>setWaist(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field" placeholder="e.g., 38" value={hip} onChange={e=>setHip(e.target.value)} min="0" step="0.25"/></div></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Your bust</span><strong>{b}&quot;</strong></div><div className={styles.resultRow}><span>Closest size bust</span><strong>{best.b}&quot;</strong></div><div className={styles.resultRow}><span>Recommended</span><strong>Size {best.s}</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/standard-measurements" className="related-tool-link"><BarChart3 size={13} /> Standards</a><a href="/body/brand-size-comparator" className="related-tool-link"><Scale size={13} /> Compare</a></div></aside></div></div>);
}