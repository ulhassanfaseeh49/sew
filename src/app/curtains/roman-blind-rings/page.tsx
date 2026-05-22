"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Frame, Printer } from "lucide-react";
export default function Page(){
const[blindH,sH]=useState("");const[folds,sF]=useState("6");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const h=parseFloat(blindH)||0;const f=parseInt(folds)||6;const spacing=h/f;const hasResult=h>0;const resultValue=spacing.toFixed(1)+"\" between rings";const resultLabel=f+" folds over "+h+"\"";
const faqItems=[{q:"Should folds be even or odd?",a:"Odd numbers of folds (5 or 7) look more balanced. The bottom fold should be a double fold."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Roman Blind Ring Spacing"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⭕</span> Curtain #249</span><h1>Roman Blind Ring Spacing</h1><p>Ring spacing for even folds.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Blind height (in)</label><input type="number" className="input-field" placeholder="48" value={blindH} onChange={e=>sH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of folds</label><input type="number" className="input-field" value={folds} onChange={e=>sF(e.target.value)} min="3"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link"><Frame size={13} /> All Curtains</a></div></aside></div></div>);}