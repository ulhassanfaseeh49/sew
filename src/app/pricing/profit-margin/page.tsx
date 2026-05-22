"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, DollarSign, Printer } from "lucide-react";
export default function Page(){
const[price,sP]=useState("");const[cost,sC]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseFloat(price)||0;const c=parseFloat(cost)||0;const profit=p-c;const margin=p>0?(profit/p*100):0;const markup2=c>0?(profit/c*100):0;const hasResult=p>0&&c>0;const resultValue=margin.toFixed(1)+"% profit margin";const resultLabel="$"+profit.toFixed(2)+" profit ("+markup2.toFixed(0)+"% markup)";
const faqItems=[{q:"Whats the difference between margin and markup?",a:"Margin = profit/price (percentage of selling price). Markup = profit/cost (percentage of cost)."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Profit Margin Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Pricing #407</span><h1>Profit Margin Calculator</h1><p>Calculate profit margins.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Selling price ($)</label><input type="number" className="input-field" placeholder="40" value={price} onChange={e=>sP(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Total cost ($)</label><input type="number" className="input-field" placeholder="18" value={cost} onChange={e=>sC(e.target.value)} min="0" step="0.01"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}