"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[price1,sP1]=useState("");const[yards1,sY1]=useState("200");const[price2,sP2]=useState("");const[yards2,sY2]=useState("1000");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p1=parseFloat(price1)||0;const y1=parseFloat(yards1)||200;const p2=parseFloat(price2)||0;const y2=parseFloat(yards2)||1000;const cpp1=p1>0?p1/y1*100:0;const cpp2=p2>0?p2/y2*100:0;const better=cpp1<cpp2?"Small":"Large";const hasResult=p1>0&&p2>0;const resultValue=better+" spool is better value";const resultLabel="Small: "+cpp1.toFixed(2)+"¢/yd vs Large: "+cpp2.toFixed(2)+"¢/yd";
const faqItems=[{q:"Is buying larger spools always cheaper?",a:"Usually yes per yard, but only if you use the color often enough to justify it."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Spool Size Comparison"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📊</span> Notion #185</span><h1>Spool Size Comparison</h1><p>Compare spool sizes and economy.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Small spool price ($)</label><input type="number" className="input-field" placeholder="3.99" value={price1} onChange={e=>sP1(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" value={yards1} onChange={e=>sY1(e.target.value)}/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Large spool price ($)</label><input type="number" className="input-field" placeholder="7.99" value={price2} onChange={e=>sP2(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" value={yards2} onChange={e=>sY2(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}