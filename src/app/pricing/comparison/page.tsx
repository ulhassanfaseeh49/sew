"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[cost,sC]=useState("");const[market,sM]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const c=parseFloat(cost)||0;const mk=parseFloat(market)||0;const costPlus=c*2;const value=mk*1.1;const hasResult=c>0;const resultValue="cost-plus: $"+costPlus.toFixed(2)+" | market: $"+mk.toFixed(2)+" | value: $"+value.toFixed(2);const resultLabel="compare and choose the best strategy";
const faqItems=[{q:"Which pricing strategy is best?",a:"Use cost-plus as your floor. Check market prices. Charge more for unique, high-quality, or custom work."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Pricing Comparison"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔄</span> Pricing #409</span><h1>Pricing Comparison</h1><p>Compare pricing strategies.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Your total cost ($)</label><input type="number" className="input-field" placeholder="15" value={cost} onChange={e=>sC(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Market price ($)</label><input type="number" className="input-field" placeholder="35" value={market} onChange={e=>sM(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link">💰 All Pricing</a></div></aside></div></div>);}