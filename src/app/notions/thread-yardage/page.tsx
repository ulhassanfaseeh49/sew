"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[seams,sS]=useState("");const[avgLen,sL]=useState("15");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseInt(seams)||0;const l=parseFloat(avgLen)||15;const totalIn=s*l*2.5;const yards=Math.ceil(totalIn/36);const hasResult=s>0;const resultValue=yards+" yards thread";const resultLabel=s+" seams × "+l+"\" avg × 2.5x thread ratio";
const faqItems=[{q:"How much thread per bobbin?",a:"About 70 yards for a standard bobbin, but varies by thread weight."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Thread Yardage Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Notion #180</span><h1>Thread Yardage Estimator</h1><p>Estimate thread needed for a project.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Number of seams</label><input type="number" className="input-field" placeholder="12" value={seams} onChange={e=>sS(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Avg seam length (in)</label><input type="number" className="input-field" value={avgLen} onChange={e=>sL(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Total thread</span><strong>{yards} yards</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}