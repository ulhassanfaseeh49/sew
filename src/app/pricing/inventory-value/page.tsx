"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[finished,sF]=useState("");const[wip,sW]=useState("");const[materials,sM]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(finished)||0;const w=parseFloat(wip)||0;const m=parseFloat(materials)||0;const total=f+w+m;const hasResult=total>0;const resultValue="$"+total.toFixed(2)+" total inventory";const resultLabel="finished $"+f.toFixed(2)+" + WIP $"+w.toFixed(2)+" + materials $"+m.toFixed(2);
const faqItems=[{q:"Why track inventory value?",a:"Required for taxes, insurance, and business planning. Know what you have invested in stock."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Inventory Value"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📦</span> Pricing #414</span><h1>Inventory Value</h1><p>Calculate inventory value.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished goods value ($)</label><input type="number" className="input-field" placeholder="500" value={finished} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">WIP value ($)</label><input type="number" className="input-field" placeholder="200" value={wip} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Raw materials ($)</label><input type="number" className="input-field" placeholder="300" value={materials} onChange={e=>sM(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link">💰 All Pricing</a></div></aside></div></div>);}