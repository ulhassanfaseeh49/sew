"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ribbon, Scissors } from "lucide-react";
export default function Page(){
const[length,sL]=useState("");const[bows,sB]=useState("0");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(length)||0;const b=parseInt(bows)||0;const bowLen=b*24;const total=l+bowLen;const yd=Math.ceil(total/36*4)/4;const hasResult=l>0||b>0;const resultValue=yd+" yards";const resultLabel=l+"\" straight + "+b+" bows (24\" each)";
const faqItems=[{q:"How much ribbon for a bow?",a:"About 24 inches (2/3 yard) for a standard bow. More for larger or multi-loop bows."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Ribbon Length Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ribbon size={14} strokeWidth={1.5} /> Notion #193</span><h1>Ribbon Length Calculator</h1><p>Ribbon needed for projects.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Straight length needed (in)</label><input type="number" className="input-field" placeholder="36" value={length} onChange={e=>sL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of bows</label><input type="number" className="input-field" value={bows} onChange={e=>sB(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}