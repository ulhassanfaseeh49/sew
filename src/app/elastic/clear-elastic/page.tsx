"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[seamLen,sS]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sl=parseFloat(seamLen)||0;const elastic=sl;const hasResult=sl>0;const resultValue=elastic+"\" clear elastic";const resultLabel="cut same length as seam — do NOT stretch when applying";
const faqItems=[{q:"Where do I use clear elastic?",a:"Shoulder seams, necklines, and waistlines on knit garments to prevent stretching out."}];
return(<div className="container"><Breadcrumb items={[{label:"Elastic",href:"/elastic"},{label:"Clear Elastic for Knits"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔍</span> Elastic #296</span><h1>Clear Elastic for Knits</h1><p>Clear elastic for stabilizing knit seams.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Seam length to stabilize (in)</label><input type="number" className="input-field" placeholder="16" value={seamLen} onChange={e=>sS(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/elastic" className="related-tool-link">〰️ All Elastic</a></div></aside></div></div>);}