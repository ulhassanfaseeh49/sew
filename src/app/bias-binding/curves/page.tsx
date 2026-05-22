"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ribbon } from "lucide-react";
export default function Page(){
const[straightLen,sL]=useState("");const[curveType,sC]=useState("moderate");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(straightLen)||0;const extra=curveType==="slight"?1.05:curveType==="moderate"?1.1:1.2;const total=l*extra;const yd=Math.ceil(total/36*4)/4;const hasResult=l>0;const resultValue=yd+" yards";const resultLabel="add "+Math.round((extra-1)*100)+"% for "+curveType+" curves";
const faqItems=[{q:"Does bias tape stretch around curves?",a:"Yes, thats why we use bias cut — it stretches to follow curves without puckering."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Bias Tape for Curves"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Bias #283</span><h1>Bias Tape for Curves</h1><p>Extra tape for curved edges.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Measured length (in)</label><input type="number" className="input-field" placeholder="60" value={straightLen} onChange={e=>sL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Curve type</label><select className="input-field" value={curveType} onChange={e=>sC(e.target.value)}><option value="slight">Slight curves</option><option value="moderate">Moderate curves</option><option value="scallop">Scalloped edge</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link"><Ribbon size={13} /> All Bias</a></div></aside></div></div>);}