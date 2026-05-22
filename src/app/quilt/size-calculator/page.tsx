"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[w,sW]=useState("");const[h,sH]=useState("");const[bs,setBs]=useState("12");const[cols,setCols]=useState("5");const[rows,setRows]=useState("6");const[border,setBorder]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(bs)||12;const c=parseInt(cols)||5;const r=parseInt(rows)||6;const bd=parseFloat(border)||0;const qw=c*b+bd*2;const qh=r*b+bd*2;const hasResult=true;const resultValue=qw+"x"+qh+"\"";const resultLabel=c+"x"+r+" blocks with "+bd+"\" border";
const faqItems=[{q:"What size quilt should I make?",a:"Throw: 50x65, Twin: 65x87, Queen: 88x92, King: 108x92 inches."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Quilt Size Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Quilt #129</span><h1>Quilt Size Calculator</h1><p>Calculate finished quilt size from blocks, sashing, and borders.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" placeholder="60" value={w} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field" placeholder="80" value={h} onChange={e=>sH(e.target.value)} min="0"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Block size</label><input type="number" className="input-field" value={bs} onChange={e=>setBs(e.target.value)}/></div><div className="input-group"><label className="input-label">Columns</label><input type="number" className="input-field" value={cols} onChange={e=>setCols(e.target.value)}/></div><div className="input-group"><label className="input-label">Rows</label><input type="number" className="input-field" value={rows} onChange={e=>setRows(e.target.value)}/></div><div className="input-group"><label className="input-label">Border (in)</label><input type="number" className="input-field" value={border} onChange={e=>setBorder(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Width</span><strong>{qw}&quot;</strong></div><div className={styles.resultRow}><span>Height</span><strong>{qh}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link">🟩 All Quilt</a></div></aside></div></div>);}