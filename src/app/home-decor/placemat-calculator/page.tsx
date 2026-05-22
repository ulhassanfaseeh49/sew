"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[qty,sQ]=useState("4");const[pW,sPW]=useState("18");const[pH,sPH]=useState("13");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const q=parseInt(qty)||4;const w=parseFloat(pW)||18;const h=parseFloat(pH)||13;const across=Math.floor(44/(w+1));const rows=Math.ceil(q/across);const yd=Math.ceil(rows*(h+1)/36*4)/4;const hasResult=true;const resultValue=yd+" yards (×2 for front+back)";const resultLabel=q+" placemats, "+across+" per row";
const faqItems=[{q:"What size are standard placemats?",a:"18×13 inches is standard. Allow 12 inches per place setting width."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Placemat Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🍴</span> Home #271</span><h1>Placemat Calculator</h1><p>Fabric for placemats.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field" value={qty} onChange={e=>sQ(e.target.value)} min="1"/></div><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={pW} onChange={e=>sPW(e.target.value)}/></div><div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field" value={pH} onChange={e=>sPH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}