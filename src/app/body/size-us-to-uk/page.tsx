"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
export default function Page(){
  const [usSize,setUsSize]=useState("8");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const us=parseInt(usSize)||8;const uk=us+4;const hasResult=true;const resultValue="UK "+uk;const resultLabel="US "+us+" = UK "+uk;
  const faqItems=[{q:"Is US to UK sizing always +4?",a:"Generally yes for womens clothing, but always check by measurements for best accuracy."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"US to UK Size Converter"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span>🇬🇧</span> Body Tool #116</span><h1>US to UK Size Converter</h1><p>Convert between US and UK clothing sizes.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="input-group"><label className="input-label">US Size</label><select className="input-field" value={usSize} onChange={e=>setUsSize(e.target.value)}><option value="0">0</option><option value="2">2</option><option value="4">4</option><option value="6">6</option><option value="8">8</option><option value="10">10</option><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option></select></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>US Size</span><strong>{us}</strong></div><div className={styles.resultRow}><span>UK Size</span><strong>{uk}</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/size-us-to-eu" className="related-tool-link">🇪🇺 US→EU</a><a href="/body/size-converter-universal" className="related-tool-link">🌐 Universal</a></div></aside></div></div>);
}