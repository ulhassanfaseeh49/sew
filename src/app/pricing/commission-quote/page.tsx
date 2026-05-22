"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, DollarSign, Printer } from "lucide-react";
export default function Page(){
const[materials,sM]=useState("");const[hours,sH]=useState("");const[rate,sR]=useState("20");const[complexity,sC]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const m=parseFloat(materials)||0;const h=parseFloat(hours)||0;const r=parseFloat(rate)||20;const cx=parseFloat(complexity)||1;const labor=h*r*cx;const quote=m+labor;const deposit=quote*0.5;const hasResult=m>0||h>0;const resultValue="$"+quote.toFixed(2)+" quote";const resultLabel="50% deposit: $"+deposit.toFixed(2);
const faqItems=[{q:"Should I require a deposit for commissions?",a:"Yes, always 50% deposit before starting. Non-refundable for custom/cut fabric. Protects both parties."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Commission Quote"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Pricing #411</span><h1>Commission Quote</h1><p>Custom sewing price quotes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Materials ($)</label><input type="number" className="input-field" placeholder="25" value={materials} onChange={e=>sM(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Estimated hours</label><input type="number" className="input-field" placeholder="5" value={hours} onChange={e=>sH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Rate ($/hr)</label><input type="number" className="input-field" value={rate} onChange={e=>sR(e.target.value)}/></div><div className="input-group"><label className="input-label">Complexity</label><select className="input-field" value={complexity} onChange={e=>sC(e.target.value)}><option value="1">Standard (1x)</option><option value="1.25">Complex (1.25x)</option><option value="1.5">Very complex (1.5x)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}