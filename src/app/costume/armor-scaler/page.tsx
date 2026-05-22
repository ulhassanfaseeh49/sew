"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Drama, Printer, Shield } from "lucide-react";
export default function Page(){
const[chest,sC]=useState("");const[patChest,sP]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const c=parseFloat(chest)||0;const p=parseFloat(patChest)||0;const scale=p>0?c/p*100:0;const hasResult=c>0&&p>0;const resultValue=scale.toFixed(0)+"% scale";const resultLabel="print/cut pattern at "+scale.toFixed(0)+"% of original";
const faqItems=[{q:"How do I scale EVA foam armor?",a:"Measure yourself, compare to pattern. Scale all pieces by the same percentage for consistent fit."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Armor Pattern Scaling"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Shield size={14} strokeWidth={1.5} /> Costume #344</span><h1>Armor Pattern Scaling</h1><p>Scale armor patterns to your body.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Your chest (in)</label><input type="number" className="input-field" placeholder="38" value={chest} onChange={e=>sC(e.target.value)}/></div><div className="input-group"><label className="input-label">Pattern chest (in)</label><input type="number" className="input-field" placeholder="40" value={patChest} onChange={e=>sP(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link"><Drama size={13} /> All Costume</a></div></aside></div></div>);}