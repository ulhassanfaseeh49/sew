"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("");const[notions,sN]=useState("");const[other,sO]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fabric)||0;const n=parseFloat(notions)||0;const o=parseFloat(other)||0;const total=f+n+o;const hasResult=total>0;const resultValue="$"+total.toFixed(2)+" total materials";const resultLabel="fabric $"+f.toFixed(2)+" + notions $"+n.toFixed(2)+" + other $"+o.toFixed(2);
const faqItems=[{q:"What counts as material cost?",a:"Fabric, thread, zippers, buttons, interfacing, elastic, labels, and packaging materials."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Material Cost Tracker"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📋</span> Pricing #403</span><h1>Material Cost Tracker</h1><p>Track material costs per project.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric cost ($)</label><input type="number" className="input-field" placeholder="15" value={fabric} onChange={e=>sF(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Notions ($)</label><input type="number" className="input-field" placeholder="5" value={notions} onChange={e=>sN(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Other ($)</label><input type="number" className="input-field" placeholder="2" value={other} onChange={e=>sO(e.target.value)} min="0" step="0.01"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link">💰 All Pricing</a></div></aside></div></div>);}