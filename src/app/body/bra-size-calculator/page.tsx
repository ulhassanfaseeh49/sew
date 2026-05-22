"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
export default function Page(){
  const [band,setBand]=useState("");const [bust,setBust]=useState("");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const b=parseFloat(band)||0;const f=parseFloat(bust)||0;const bandSize=Math.round(b/2)*2+(b%2>=1?1:0);const diff=Math.round(f-bandSize);const cups=["AA","A","B","C","D","DD","DDD","G","H"];const cupLetter=diff>=0&&diff<cups.length?cups[diff]:"?";const hasResult=b>0&&f>0;const resultValue=bandSize+cupLetter;const resultLabel="US bra size";
  const faqItems=[{q:"How do I measure for bra size?",a:"Band: snugly around ribcage just under bust. Full bust: around the fullest point without compressing."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Bra Size Calculator"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Body Tool #128</span><h1>Bra Size Calculator</h1><p>Calculate bra size from band and bust measurements.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Band/underbust (in)</label><input type="number" className="input-field" placeholder="e.g., 32" value={band} onChange={e=>setBand(e.target.value)} min="0" step="0.5"/></div><div className="input-group"><label className="input-label">Full bust (in)</label><input type="number" className="input-field" placeholder="e.g., 36" value={bust} onChange={e=>setBust(e.target.value)} min="0" step="0.5"/></div></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Band size</span><strong>{bandSize}</strong></div><div className={styles.resultRow}><span>Cup difference</span><strong>{diff}&quot;</strong></div><div className={styles.resultRow}><span>Cup size</span><strong>{cupLetter}</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/measurement-guide" className="related-tool-link">📖 Guide</a><a href="/body/standard-measurements" className="related-tool-link">📊 Standards</a></div></aside></div></div>);
}