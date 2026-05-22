"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[hoursWeek,sH]=useState("5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const h=parseFloat(hoursWeek)||5;const weeksPerNeedle=Math.floor(8/h);const needlesPerMonth=Math.ceil(4/Math.max(weeksPerNeedle,1));const needlesPerYear=needlesPerMonth*12;const hasResult=true;const resultValue="change every "+Math.max(weeksPerNeedle,1)+" week(s)";const resultLabel="~"+needlesPerYear+" needles per year at "+h+" hrs/week";
const faqItems=[{q:"How do I know my needle is dull?",a:"Skipped stitches, popping sounds, pulled threads, or small holes in fabric mean its time to change."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Replacement Schedule"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📅</span> Needle #436</span><h1>Replacement Schedule</h1><p>When to change needles.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Sewing hours per week</label><input type="number" className="input-field" value={hoursWeek} onChange={e=>sH(e.target.value)} min="1"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link">🪡 All Needles</a></div></aside></div></div>);}