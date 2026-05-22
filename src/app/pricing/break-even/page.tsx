"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, DollarSign, Printer, Scale } from "lucide-react";
export default function Page(){
const[fixed,sF]=useState("");const[price,sP]=useState("");const[varCost,sV]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fixed)||0;const p=parseFloat(price)||0;const v=parseFloat(varCost)||0;const contribution=p-v;const units=contribution>0?Math.ceil(f/contribution):0;const hasResult=f>0&&p>0;const resultValue=units+" units to break even";const resultLabel="$"+contribution.toFixed(2)+" profit per unit × "+units+" = $"+f;
const faqItems=[{q:"What are fixed costs for sewists?",a:"Machine payments, software subscriptions, booth fees, website costs, and equipment depreciation."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Break-Even Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Pricing #408</span><h1>Break-Even Calculator</h1><p>Units to break even on costs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fixed costs ($)</label><input type="number" className="input-field" placeholder="500" value={fixed} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Price per unit ($)</label><input type="number" className="input-field" placeholder="30" value={price} onChange={e=>sP(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Variable cost/unit ($)</label><input type="number" className="input-field" placeholder="12" value={varCost} onChange={e=>sV(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}