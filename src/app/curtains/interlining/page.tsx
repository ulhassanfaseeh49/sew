"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[cutLen,sC]=useState("");const[widths,sW]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const cl=parseFloat(cutLen)||0;const w=parseInt(widths)||2;const yd=Math.ceil(w*cl/36*4)/4;const hasResult=cl>0;const resultValue=yd+" yards interlining";const resultLabel=w+" widths at "+cl+"\"";
const faqItems=[{q:"What is interlining?",a:"A soft fabric layer between face fabric and lining. It adds body, insulation, and luxury drape."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Interlining Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>☁️</span> Curtain #245</span><h1>Interlining Calculator</h1><p>Interlining for professional curtains.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Cut length (in)</label><input type="number" className="input-field" placeholder="90" value={cutLen} onChange={e=>sC(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Widths</label><input type="number" className="input-field" value={widths} onChange={e=>sW(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link">🪟 All Curtains</a></div></aside></div></div>);}