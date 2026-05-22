"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
export default function Page(){
  const [usSize,setUsSize]=useState("8");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const us=parseInt(usSize)||8;const uk=us+4;const eu=us+30;const hasResult=true;const resultValue="US "+us+" = UK "+uk+" = EU "+eu;const resultLabel="universal size conversion";
  const faqItems=[{q:"Why do sizes vary between countries?",a:"Each country developed its own sizing system based on different body standards and measurement methods."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Universal Size Converter"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span>🌐</span> Body Tool #119</span><h1>Universal Size Converter</h1><p>Convert between ANY international sizing systems.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="input-group"><label className="input-label">US Size</label><select className="input-field" value={usSize} onChange={e=>setUsSize(e.target.value)}><option value="0">0 (XXS)</option><option value="2">2 (XS)</option><option value="4">4 (S)</option><option value="6">6 (S-M)</option><option value="8">8 (M)</option><option value="10">10 (M-L)</option><option value="12">12 (L)</option><option value="14">14 (XL)</option><option value="16">16 (XXL)</option></select></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>US</span><strong>{us}</strong></div><div className={styles.resultRow}><span>UK</span><strong>{uk}</strong></div><div className={styles.resultRow}><span>EU (FR/DE)</span><strong>{eu}</strong></div><div className={styles.resultRow}><span>Italian</span><strong>{eu+2}</strong></div><div className={styles.resultRow}><span>Australian</span><strong>{us+4}</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/size-us-to-uk" className="related-tool-link">🇬🇧 US→UK</a><a href="/body/size-us-to-eu" className="related-tool-link">🇪🇺 US→EU</a></div></aside></div></div>);
}