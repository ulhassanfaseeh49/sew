"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[retail,sR]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const r=parseFloat(retail)||0;const wholesale=r*0.5;const keystone=r*0.5;const hasResult=r>0;const resultValue="$"+wholesale.toFixed(2)+" wholesale";const resultLabel="50% of retail (keystone). Your cost must be under $"+(wholesale*0.5).toFixed(2);
const faqItems=[{q:"What is keystone pricing?",a:"Wholesale = 50% of retail. Your cost should be 25% of retail to maintain margins at both levels."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Wholesale Pricing"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📦</span> Pricing #406</span><h1>Wholesale Pricing</h1><p>Wholesale price calculator.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Retail price ($)</label><input type="number" className="input-field" placeholder="40" value={retail} onChange={e=>sR(e.target.value)} min="0" step="0.01"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link">💰 All Pricing</a></div></aside></div></div>);}