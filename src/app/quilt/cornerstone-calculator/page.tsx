"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[sw,sSw]=useState("2");const[cols,sC]=useState("5");const[rows,sR]=useState("6");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(sw)||2;const c=parseInt(cols)||5;const r=parseInt(rows)||6;const stones=(c-1)*(r-1);const cut=s+0.5;const hasResult=true;const resultValue=stones+" cornerstones";const resultLabel="cut at "+cut+"\" ("+s+"\" + SA)";
const faqItems=[{q:"Do I need cornerstones?",a:"Optional but they add a design element at sashing intersections."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Cornerstone Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⬛</span> Quilt #145</span><h1>Cornerstone Calculator</h1><p>Cornerstone sizes for sashing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Sashing W</label><input type="number" className="input-field" value={sw} onChange={e=>sSw(e.target.value)}/></div><div className="input-group"><label className="input-label">Cols</label><input type="number" className="input-field" value={cols} onChange={e=>sC(e.target.value)}/></div><div className="input-group"><label className="input-label">Rows</label><input type="number" className="input-field" value={rows} onChange={e=>sR(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link">🟩 All Quilt</a></div></aside></div></div>);}