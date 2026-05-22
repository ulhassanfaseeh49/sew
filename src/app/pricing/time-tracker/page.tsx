"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, DollarSign, Printer } from "lucide-react";
export default function Page(){
const[cutting,sC]=useState("");const[sewing,sS]=useState("");const[finishing,sF]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const c=parseFloat(cutting)||0;const s=parseFloat(sewing)||0;const f=parseFloat(finishing)||0;const total=c+s+f;const hrs=total/60;const hasResult=total>0;const resultValue=hrs.toFixed(1)+" hours ("+total+" min)";const resultLabel="cut "+c+"m + sew "+s+"m + finish "+f+"m";
const faqItems=[{q:"Why track sewing time?",a:"Essential for accurate pricing. Most sewists underestimate their time by 30-50%."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Time Tracking"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⏱</span> Pricing #410</span><h1>Time Tracking</h1><p>Track sewing project time.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Cutting (min)</label><input type="number" className="input-field" placeholder="30" value={cutting} onChange={e=>sC(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Sewing (min)</label><input type="number" className="input-field" placeholder="90" value={sewing} onChange={e=>sS(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Finishing (min)</label><input type="number" className="input-field" placeholder="20" value={finishing} onChange={e=>sF(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}