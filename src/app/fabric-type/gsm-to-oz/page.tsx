"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[gsm,sG]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const g=parseFloat(gsm)||0;const oz=g*0.02949;const cat=g<150?"Lightweight":g<250?"Medium weight":g<350?"Heavyweight":"Very heavy";const hasResult=g>0;const resultValue=oz.toFixed(2)+" oz/yd²";const resultLabel=g+" GSM = "+cat;
const faqItems=[{q:"What is GSM?",a:"Grams per square meter — the global standard for measuring fabric weight. Higher GSM = heavier fabric."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"GSM to oz/yd² Converter"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⚖️</span> Fabric #415</span><h1>GSM to oz/yd² Converter</h1><p>Convert GSM to ounces per square yard.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">GSM (grams per square meter)</label><input type="number" className="input-field" placeholder="150" value={gsm} onChange={e=>sG(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link">⚖️ All Fabric Type</a></div></aside></div></div>);}