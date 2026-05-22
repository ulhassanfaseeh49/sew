"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, DollarSign, Printer } from "lucide-react";
export default function Page(){
const[annual,sA]=useState("");const[weeks,sW]=useState("48");const[hoursWeek,sH]=useState("30");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const a=parseFloat(annual)||0;const w=parseFloat(weeks)||48;const h=parseFloat(hoursWeek)||30;const rate=a/(w*h);const hasResult=a>0;const resultValue="$"+rate.toFixed(2)+"/hour";const resultLabel=w+" weeks × "+h+" hrs = "+Math.round(w*h)+" billable hours";
const faqItems=[{q:"How many billable hours should I plan?",a:"Only 60-70% of working hours are billable. The rest is admin, marketing, and setup."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Hourly Rate Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⏰</span> Pricing #402</span><h1>Hourly Rate Calculator</h1><p>Calculate your hourly rate.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Desired annual income ($)</label><input type="number" className="input-field" placeholder="40000" value={annual} onChange={e=>sA(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Working weeks/year</label><input type="number" className="input-field" value={weeks} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Billable hours/week</label><input type="number" className="input-field" value={hoursWeek} onChange={e=>sH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}