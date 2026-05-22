"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[pieces,sP]=useState("");const[avgArea,sA]=useState("80");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseInt(pieces)||0;const a=parseFloat(avgArea)||80;const totalArea=p*a*1.25;const sheets=Math.ceil(totalArea/(29*19));const hasResult=p>0;const resultValue=sheets+" Worbla sheet(s)";const resultLabel="standard size sheets with 25% waste";
const faqItems=[{q:"What is Worbla?",a:"A thermoplastic sheet that becomes moldable when heated. It sticks to itself and can be shaped over foam."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Worbla/Thermoplastic"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔥</span> Costume #346</span><h1>Worbla/Thermoplastic</h1><p>Thermoplastic sheet quantity.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pieces</label><input type="number" className="input-field" placeholder="8" value={pieces} onChange={e=>sP(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Avg piece area (sq in)</label><input type="number" className="input-field" value={avgArea} onChange={e=>sA(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}