"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, RefreshCw, Scissors } from "lucide-react";
export default function Page(){
const[bust,sB]=useState("");const[ease,sE]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(bust)||0;const e=parseFloat(ease)||4;const knitSize=b-e+1;const removed=b-knitSize;const hasResult=b>0;const resultValue=knitSize.toFixed(1)+"\" knit pattern bust";const resultLabel="removed "+removed.toFixed(1)+"\" positive ease, added 1\" knit ease";
const faqItems=[{q:"Can I use any woven pattern for knits?",a:"Fitted patterns adapt best. Eliminate darts, reduce ease, and skip closures where stretch allows pull-on fit."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Woven to Knit Converter"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Stretch #304</span><h1>Woven to Knit Converter</h1><p>Adapt woven patterns for knits.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Woven pattern bust (in)</label><input type="number" className="input-field" placeholder="40" value={bust} onChange={e=>sB(e.target.value)}/></div><div className="input-group"><label className="input-label">Current ease (in)</label><input type="number" className="input-field" value={ease} onChange={e=>sE(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link"><Scissors size={13} /> All Stretch</a></div></aside></div></div>);}