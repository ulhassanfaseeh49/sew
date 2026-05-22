"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Scale, Target } from "lucide-react";
export default function Page(){
  const [size,setSize]=useState("12");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const s=parseInt(size)||12;const brands=[{n:"Simplicity",bust:s===8?31.5:s===10?32.5:s===12?34:s===14?36:38},{n:"McCalls",bust:s===8?31.5:s===10?32.5:s===12?34:s===14?36:38},{n:"Burda",bust:s===8?32:s===10?33.5:s===12?35:s===14?37:39},{n:"Vogue",bust:s===8?31.5:s===10?32.5:s===12?34:s===14?36:38}];const hasResult=true;const resultValue="Size "+s+" across brands";const resultLabel="bust measurement comparison";
  const faqItems=[{q:"Are all pattern companies the same size?",a:"Big 4 (Simplicity, McCall, Butterick, Vogue) are similar. Burda and indie brands often differ."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Brand Size Comparator"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Body Tool</span><h1>Brand Size Comparator</h1><p>Compare sizing between pattern brands.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={size} onChange={e=>setSize(e.target.value)}><option value="8">8</option><option value="10">10</option><option value="12">12</option><option value="14">14</option><option value="16">16</option></select></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}>{brands.map(b=>(<div key={b.n} className={styles.resultRow}><span>{b.n}</span><strong>{b.bust}&quot; bust</strong></div>))}</div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/standard-measurements" className="related-tool-link"><BarChart3 size={13} /> Standards</a><a href="/body/pattern-size-selector" className="related-tool-link"><Target size={13} /> Size Selector</a></div></aside></div></div>);
}