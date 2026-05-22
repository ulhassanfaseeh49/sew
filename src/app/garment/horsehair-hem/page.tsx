"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[hemCirc,sH]=useState("");const[braidW,sB]=useState("0.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const hc=parseFloat(hemCirc)||0;const bw=parseFloat(braidW)||0.5;const yd=Math.ceil(hc/36*4)/4;const hasResult=hc>0;const resultValue=yd+" yards of "+bw+"\" braid";const resultLabel="for "+hc+"\" hem circumference";
const faqItems=[{q:"What is horsehair braid for?",a:"It creates a structured, stand-away hem on formal dresses and bridal gowns."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Horsehair Braid Hem"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🐴</span> Garment #215</span><h1>Horsehair Braid Hem</h1><p>Horsehair braid length for structured hems.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Hem circumference (in)</label><input type="number" className="input-field" placeholder="80" value={hemCirc} onChange={e=>sH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Braid width</label><select className="input-field" value={braidW} onChange={e=>sB(e.target.value)}><option value="0.5">1/2&quot; (subtle)</option><option value="1">1&quot; (standard)</option><option value="2">2&quot; (dramatic)</option><option value="3">3&quot; (bridal)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}