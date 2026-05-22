"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[pct,sP]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseFloat(pct)||0;const cat=p<15?"Low stretch":p<25?"Moderate stretch":p<50?"Good stretch":"Super stretch";const suit=p<15?"Stable knits, ponte":p<25?"T-shirts, basic jerseys":p<50?"Activewear, fitted garments":"Swimwear, dance, compression";const hasResult=p>0;const resultValue=cat+" ("+p+"%)";const resultLabel=suit;
const faqItems=[{q:"What stretch % do I need for a T-shirt?",a:"25-50% stretch is ideal for T-shirts. Most jersey knits fall in this range."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Fabric Stretch Gauge"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Stretch #300</span><h1>Fabric Stretch Gauge</h1><p>Measure stretch accurately.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Your fabric stretch %</label><input type="number" className="input-field" placeholder="25" value={pct} onChange={e=>sP(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link">🧶 All Stretch</a></div></aside></div></div>);}