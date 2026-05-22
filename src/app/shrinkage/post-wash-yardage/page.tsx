"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[original,sO]=useState("");const[shrinkPct,sS]=useState("5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const o=parseFloat(original)||0;const s=parseFloat(shrinkPct)||5;const remaining=o*(1-s/100);const hasResult=o>0;const resultValue=remaining.toFixed(2)+" yards remaining";const resultLabel=o+" yards - "+s+"% shrinkage";
const faqItems=[{q:"Does fabric shrink in both directions?",a:"Mostly in length (warp). Width shrinkage is typically less (1-2%). Our calculator focuses on length."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Post-Wash Yardage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Shrinkage #232</span><h1>Post-Wash Yardage Calculator</h1><p>Resulting yardage after washing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Original yardage</label><input type="number" className="input-field" placeholder="3" value={original} onChange={e=>sO(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Shrinkage %</label><input type="number" className="input-field" value={shrinkPct} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link">💧 All Shrinkage</a></div></aside></div></div>);}