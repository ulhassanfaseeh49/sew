"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[edges,sE]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const e=parseFloat(edges)||0;const total=e+12;const yd=Math.ceil(total/36*4)/4;const hasResult=e>0;const resultValue=yd+" yards piping";const resultLabel=e+"\" edges + 12\" for joins and corners";
const faqItems=[{q:"How much extra piping for corners?",a:"Add 1 inch per corner for pivoting. Add 6 inches overlap for joining ends."}];
return(<div className="container"><Breadcrumb items={[{label:"Lace & Trim",href:"/lace-trim"},{label:"Piping Coverage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Trim #329</span><h1>Piping Coverage Calculator</h1><p>Piping yardage for edges.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Total edge length (in)</label><input type="number" className="input-field" placeholder="120" value={edges} onChange={e=>sE(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/lace-trim" className="related-tool-link"> All Trim</a></div></aside></div></div>);}