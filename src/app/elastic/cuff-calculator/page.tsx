"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[circ,sC]=useState("");const[type,sT]=useState("sleeve");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const c=parseFloat(circ)||0;const pct=type==="sleeve"?0.9:0.85;const elastic=c*pct+0.5;const hasResult=c>0;const resultValue=elastic.toFixed(1)+"\" elastic";const resultLabel=type+" cuff, "+Math.round(pct*100)+"% ratio";
const faqItems=[{q:"What width elastic for cuffs?",a:"1/4 to 3/8 inch for sleeve cuffs, 3/4 to 1 inch for pant legs."}];
return(<div className="container"><Breadcrumb items={[{label:"Elastic",href:"/elastic"},{label:"Cuff Elastic Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔄</span> Elastic #291</span><h1>Cuff Elastic Calculator</h1><p>Elastic for sleeve and pant cuffs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Body circumference (in)</label><input type="number" className="input-field" placeholder="9" value={circ} onChange={e=>sC(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Application</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="sleeve">Sleeve cuff</option><option value="pant">Pant cuff</option><option value="ankle">Ankle</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/elastic" className="related-tool-link">〰️ All Elastic</a></div></aside></div></div>);}