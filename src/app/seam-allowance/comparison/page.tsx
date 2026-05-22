"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const sas=[{name:"1/4\"",inches:0.25,use:"Quilting, doll clothes"},{name:"3/8\"",inches:0.375,use:"Knits, lightweight fabrics"},{name:"1/2\"",inches:0.5,use:"Home decor, casual sewing"},{name:"5/8\"",inches:0.625,use:"Standard garment sewing"},{name:"1\"",inches:1,use:"Coats, tailoring, hems"},{name:"1-1/2\"",inches:1.5,use:"Deep hems, curtain hems"}];const hasResult=true;const resultValue="6 common seam allowances";const resultLabel="comparison reference";

  const faqItems = [{q:"Which seam allowance should I use?",a:"Follow your patterns instructions. If drafting your own, 5/8 inch is standard for garments, 1/4 inch for quilting."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Seam Allowance Comparison"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📊</span> Seam Tool #87</span>
            <h1>Seam Allowance Comparison</h1>
            <p>Visual comparison of seam allowances and when to use each.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  {sas.map(s=>(<div key={s.name} className={styles.resultRow}><span>{s.name} ({(s.inches*2.54).toFixed(1)} cm)</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{s.use}</strong></div>))}
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/standard-guide" className="related-tool-link">📖 Standard Guide</a><a href="/seam-allowance/converter" className="related-tool-link">↔️ Converter</a></div></aside>
      </div>
    </div>
  );
}