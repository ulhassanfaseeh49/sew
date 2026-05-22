"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[before,sB]=useState("");const[after,sA]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(before)||0;const a=parseFloat(after)||0;const pct=b>0?((b-a)/b*100):0;const hasResult=b>0&&a>0;const resultValue=pct.toFixed(1)+"% shrinkage";const resultLabel=b+"\" → "+a+"\" (lost "+(b-a).toFixed(1)+"\")";
const faqItems=[{q:"How do I test shrinkage?",a:"Cut a 12x12 inch swatch, wash and dry, then measure. Calculate: (original - final) / original × 100."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Shrinkage Percentage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Shrinkage #233</span><h1>Shrinkage Percentage Calculator</h1><p>Calculate actual shrinkage from before/after measurements.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Before washing (in)</label><input type="number" className="input-field" placeholder="36" value={before} onChange={e=>sB(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">After washing (in)</label><input type="number" className="input-field" placeholder="34.5" value={after} onChange={e=>sA(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link"> All Shrinkage</a></div></aside></div></div>);}