"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[age,sA]=useState("3");const[garment,sG]=useState("top");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const a=parseInt(age)||3;const growth=a<=2?3:a<=5?2:1.5;const hasResult=true;const resultValue="add "+growth+"\" extra length";const resultLabel="for age "+a+" — add deep hems to let out later";
const faqItems=[{q:"How do I add growth room?",a:"Add 2-3 inches to hems. Use deep hems that can be let down. Add tucks at shoulders for tops."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Growth Room Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Baby #390</span><h1>Growth Room Calculator</h1><p>Extra length for growth.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Child age</label><select className="input-field" value={age} onChange={e=>sA(e.target.value)}><option value="1">1 year</option><option value="2">2 years</option><option value="3">3 years</option><option value="5">5 years</option><option value="8">8 years</option></select></div><div className="input-group"><label className="input-label">Garment type</label><select className="input-field" value={garment} onChange={e=>sG(e.target.value)}><option value="top">Top/shirt</option><option value="pants">Pants</option><option value="dress">Dress</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link"><Baby size={13} /> All Baby</a></div></aside></div></div>);}