"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Frame, Printer } from "lucide-react";
export default function Page(){
const[cutLen,sC]=useState("");const[widths,sW]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const cl=parseFloat(cutLen)||0;const w=parseInt(widths)||2;const liningLen=cl-2;const yd=Math.ceil(w*liningLen/36*4)/4;const hasResult=cl>0;const resultValue=yd+" yards lining";const resultLabel=w+" widths at "+liningLen+"\" (2\" shorter than face)";
const faqItems=[{q:"Should I line curtains?",a:"Lined curtains hang better, last longer, and protect face fabric from sun damage."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Lining Yardage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Curtain #244</span><h1>Lining Yardage Calculator</h1><p>Lining fabric for curtains.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Cut length per width (in)</label><input type="number" className="input-field" placeholder="90" value={cutLen} onChange={e=>sC(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of widths</label><input type="number" className="input-field" value={widths} onChange={e=>sW(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link"><Frame size={13} /> All Curtains</a></div></aside></div></div>);}