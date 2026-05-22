"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ShoppingBag } from "lucide-react";
export default function Page(){
const[outerYd,sO]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const o=parseFloat(outerYd)||0;const lining=o;const hasResult=o>0;const resultValue=lining+" yards lining";const resultLabel="same as outer fabric (add 0.25 yd for pockets)";
const faqItems=[{q:"Do all bags need lining?",a:"Not required, but lining hides seams, adds structure, and creates interior pockets. Highly recommended."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Bag Lining Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Bag #368</span><h1>Bag Lining Calculator</h1><p>Lining fabric for any bag.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Outer fabric yardage</label><input type="number" className="input-field" placeholder="1" value={outerYd} onChange={e=>sO(e.target.value)} min="0" step="0.25"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link"><ShoppingBag size={13} /> All Bags</a></div></aside></div></div>);}