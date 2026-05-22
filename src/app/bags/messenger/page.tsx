"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[w,sW]=useState("15");const[h,sH]=useState("11");const[d,sD]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w2=parseFloat(w)||15;const h2=parseFloat(h)||11;const d2=parseFloat(d)||4;const flap=h2+3;const total=(w2+1)*(h2*2+d2+flap+2);const yd=Math.ceil(total/(44*36)*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=w2+"×"+h2+"×"+d2+"\" messenger with flap";
const faqItems=[{q:"What makes a good messenger bag?",a:"Adjustable crossbody strap, magnetic or buckle flap closure, and interior pockets for organization."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Messenger Bag Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>💼</span> Bag #379</span><h1>Messenger Bag Calculator</h1><p>Messenger bag panels and yardage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={w} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field" value={h} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Depth (in)</label><input type="number" className="input-field" value={d} onChange={e=>sD(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}