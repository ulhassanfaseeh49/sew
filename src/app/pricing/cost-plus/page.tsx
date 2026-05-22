"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, DollarSign, Printer } from "lucide-react";
export default function Page(){
const[cost,sC]=useState("");const[margin,sM]=useState("50");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const c=parseFloat(cost)||0;const m=parseFloat(margin)||50;const price=c/(1-m/100);const profit=price-c;const hasResult=c>0;const resultValue="$"+price.toFixed(2);const resultLabel="$"+profit.toFixed(2)+" profit ("+m+"% margin)";
const faqItems=[{q:"What is cost-plus pricing?",a:"Add a percentage markup to total costs (materials + labor + overhead) to determine the selling price."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Cost-Plus Pricing"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Pricing #401</span><h1>Cost-Plus Pricing</h1><p>Price with adjustable profit margin.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total cost ($)</label><input type="number" className="input-field" placeholder="25" value={cost} onChange={e=>sC(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Profit margin %</label><input type="number" className="input-field" value={margin} onChange={e=>sM(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}