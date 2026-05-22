"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Package, Printer, Recycle } from "lucide-react";
export default function Page(){
const[yards,sY]=useState("");const[avgCost,sA]=useState("10");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const y=parseFloat(yards)||0;const c=parseFloat(avgCost)||10;const value=y*c;const projects=Math.floor(y/2.5);const hasResult=y>0;const resultValue="$"+value.toFixed(2)+" stash value";const resultLabel=y+" yards could make ~"+projects+" garments";
const faqItems=[{q:"Should I track my fabric stash?",a:"Yes! It prevents duplicate purchases, helps plan projects, and is needed for insurance and taxes."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Fabric Stash Tracker"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Package size={14} strokeWidth={1.5} /> Eco #453</span><h1>Fabric Stash Tracker</h1><p>Track your fabric stash.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total yards in stash</label><input type="number" className="input-field" placeholder="50" value={yards} onChange={e=>sY(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Average cost per yard ($)</label><input type="number" className="input-field" value={avgCost} onChange={e=>sA(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}