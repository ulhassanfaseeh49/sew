"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, DollarSign, Printer, Receipt } from "lucide-react";
export default function Page(){
const[revenue,sR]=useState("");const[taxRate,sT]=useState("7");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const r=parseFloat(revenue)||0;const t=parseFloat(taxRate)||7;const tax=r*t/100;const net=r-tax;const hasResult=r>0;const resultValue="$"+tax.toFixed(2)+" tax owed";const resultLabel="net $"+net.toFixed(2)+" from $"+r.toFixed(2)+" at "+t+"%";
const faqItems=[{q:"Do I need to charge sales tax?",a:"In most US states, yes for tangible goods. Check your state requirements. Some platforms collect for you."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Tax Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Receipt size={14} strokeWidth={1.5} /> Pricing #413</span><h1>Tax Calculator</h1><p>Sales tax for handmade sales.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Revenue ($)</label><input type="number" className="input-field" placeholder="1000" value={revenue} onChange={e=>sR(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Tax rate (%)</label><input type="number" className="input-field" value={taxRate} onChange={e=>sT(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}