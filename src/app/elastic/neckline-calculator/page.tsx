"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[neck,sN]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const n=parseFloat(neck)||0;const elastic=n*0.75+0.5;const hasResult=n>0;const resultValue=elastic.toFixed(1)+"\" elastic";const resultLabel="75% of "+n+"\" neckline + 1/2\" overlap";
const faqItems=[{q:"What type of elastic for necklines?",a:"Clear elastic or fold-over elastic (FOE) for knits. 1/4 inch width is standard."}];
return(<div className="container"><Breadcrumb items={[{label:"Elastic",href:"/elastic"},{label:"Neckline Elastic Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Elastic #292</span><h1>Neckline Elastic Calculator</h1><p>Elastic for necklines.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Neckline measurement (in)</label><input type="number" className="input-field" placeholder="22" value={neck} onChange={e=>sN(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/elastic" className="related-tool-link"> All Elastic</a></div></aside></div></div>);}