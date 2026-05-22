"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { CheckCircle, ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[required,sR]=useState("");const[actual,sA]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const r=parseFloat(required)||0;const a=parseFloat(actual)||0;const ok=a>=r;const hasResult=r>0&&a>0;const resultValue=ok?" Yes, fabric works!":" Not enough stretch";const resultLabel="Need "+r+"%, have "+a+"%"+(ok?" — "+Math.round(a-r)+"% margin":" — "+Math.round(r-a)+"% short");
const faqItems=[{q:"What if my fabric has too much stretch?",a:"More stretch is usually fine. Size down or add stabilizer if garment is too loose."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Stretch Required for Pattern"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><CheckCircle size={14} strokeWidth={1.5} /> Stretch #301</span><h1>Stretch Required for Pattern</h1><p>Does your fabric have enough stretch?</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pattern requires (%)</label><input type="number" className="input-field" placeholder="25" value={required} onChange={e=>sR(e.target.value)}/></div><div className="input-group"><label className="input-label">Your fabric (%)</label><input type="number" className="input-field" placeholder="35" value={actual} onChange={e=>sA(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link"><Scissors size={13} /> All Stretch</a></div></aside></div></div>);}