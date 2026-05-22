"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[placketLen,sPL]=useState("");const[numButtons,sNB]=useState("5");const[topOffset,sTO]=useState("0.75");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const pl=parseFloat(placketLen)||0;const nb=parseInt(numButtons)||5;const to=parseFloat(topOffset)||0.75;const usable=pl-to*2;const spacing=nb>1?usable/(nb-1):0;const hasResult=pl>0;const resultValue=spacing.toFixed(2)+"\" apart";const resultLabel=nb+" buttons evenly spaced";
const faqItems=[{q:"Where should the first button go?",a:"Typically 3/4 inch from the top edge. Place bust button first, then space evenly from there."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Button Spacing Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Notion #187</span><h1>Button Spacing Calculator</h1><p>Calculate even button spacing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Placket length (in)</label><input type="number" className="input-field" placeholder="18" value={placketLen} onChange={e=>sPL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of buttons</label><input type="number" className="input-field" value={numButtons} onChange={e=>sNB(e.target.value)} min="2"/></div><div className="input-group"><label className="input-label">Top offset (in)</label><input type="number" className="input-field" value={topOffset} onChange={e=>sTO(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Spacing</span><strong>{spacing.toFixed(2)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}