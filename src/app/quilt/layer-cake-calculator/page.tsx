"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[cakes,sC]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const c=parseInt(cakes)||1;const sq=c*42;const hasResult=true;const resultValue=sq+" squares (10\")";const resultLabel="makes large throw or twin quilt";
const faqItems=[{q:"What is a layer cake?",a:"42 pre-cut 10-inch squares from a fabric collection."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Layer Cake Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Quilt #162</span><h1>Layer Cake Calculator</h1><p>Projects from layer cakes (42x10 inch squares).</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Number of layer cakes</label><input type="number" className="input-field" value={cakes} onChange={e=>sC(e.target.value)} min="1"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}