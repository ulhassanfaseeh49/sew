"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
export default function Page(){
  const [bust,setBust]=useState("");const [waist,setWaist]=useState("");const [hip,setHip]=useState("");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const b=parseFloat(bust)||0;const forms=[{s:"2",bust:32,waist:24,hip:34},{s:"4",bust:33,waist:25,hip:35},{s:"6",bust:34,waist:26,hip:36},{s:"8",bust:35,waist:27,hip:37},{s:"10",bust:36,waist:28,hip:38},{s:"12",bust:38,waist:30,hip:40},{s:"14",bust:40,waist:32,hip:42}];const best=forms.reduce((p,c)=>Math.abs(c.bust-b)<Math.abs(p.bust-b)?c:p);const hasResult=b>0;const resultValue="Size "+best.s+" dress form";const resultLabel="closest match for "+b+"\" bust";
  const faqItems=[{q:"Should I buy a smaller or larger dress form?",a:"Always buy smaller — you can pad up but cant pad down."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Dress Form Size Calculator"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span>👗</span> Body Tool #124</span><h1>Dress Form Size Calculator</h1><p>Determine what size dress form to buy.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Your bust (in)</label><input type="number" className="input-field" placeholder="e.g., 36" value={bust} onChange={e=>setBust(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Your waist (in)</label><input type="number" className="input-field" placeholder="e.g., 28" value={waist} onChange={e=>setWaist(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Your hip (in)</label><input type="number" className="input-field" placeholder="e.g., 38" value={hip} onChange={e=>setHip(e.target.value)} min="0" step="0.25"/></div></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Form bust</span><strong>{best.bust}&quot;</strong></div><div className={styles.resultRow}><span>Form waist</span><strong>{best.waist}&quot;</strong></div><div className={styles.resultRow}><span>Form hip</span><strong>{best.hip}&quot;</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/dress-form-padding" className="related-tool-link">🧵 Padding</a><a href="/body/measurement-tracker" className="related-tool-link">📋 Tracker</a></div></aside></div></div>);
}