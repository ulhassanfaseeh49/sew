"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fin,sF]=useState("");const[sa,sSa]=useState("0.25");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fin)||0;const s=parseFloat(sa)||0.25;const unfin=f+s*2;const hasResult=f>0;const resultValue=unfin.toFixed(2)+"\" unfinished";const resultLabel=f+"\" finished + "+s+"\" SA each side";
const faqItems=[{q:"What is unfinished vs finished size?",a:"Unfinished includes seam allowance. Finished is after sewing — the visible size."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Block Size Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🟩</span> Quilt #132</span><h1>Block Size Calculator</h1><p>Finished and unfinished block sizes with seam allowance.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished size (in)</label><input type="number" className="input-field" placeholder="12" value={fin} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">SA</label><select className="input-field" value={sa} onChange={e=>sSa(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.5">1/2&quot;</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Finished</span><strong>{f}&quot;</strong></div><div className={styles.resultRow}><span>Unfinished</span><strong>{unfin.toFixed(2)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link">🟩 All Quilt</a></div></aside></div></div>);}