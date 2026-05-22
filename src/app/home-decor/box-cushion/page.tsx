"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[w,sW]=useState("20");const[d,sD]=useState("20");const[h,sH]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w2=parseFloat(w)||20;const d2=parseFloat(d)||20;const h2=parseFloat(h)||4;const topBot=(w2+1)*(d2+1)*2;const boxing=(w2+d2)*2*(h2+1);const total=topBot+boxing;const yd=Math.ceil(total/(54*36)*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel="top, bottom, and "+h2+"\" boxing strip";
const faqItems=[{q:"What is boxing on a cushion?",a:"The side strip (gusset) that gives the cushion its depth/height. Usually has a zipper on the back."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Box Cushion Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📦</span> Home #265</span><h1>Box Cushion Calculator</h1><p>Fabric for box-style cushions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={w} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Depth (in)</label><input type="number" className="input-field" value={d} onChange={e=>sD(e.target.value)}/></div><div className="input-group"><label className="input-label">Height/gusset (in)</label><input type="number" className="input-field" value={h} onChange={e=>sH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}