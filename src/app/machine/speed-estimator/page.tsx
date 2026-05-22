"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[seamFt,sS]=useState("");const[skill,sSk]=useState("intermediate");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sf=parseFloat(seamFt)||0;const ftPerMin=skill==="beginner"?2:skill==="intermediate"?4:6;const minutes=sf/ftPerMin;const hrs=minutes/60;const hasResult=sf>0;const resultValue=Math.ceil(minutes)+" min sewing time";const resultLabel=sf+" ft of seams at "+ftPerMin+" ft/min ("+skill+")";
const faqItems=[{q:"How fast should I sew?",a:"Beginners: 1-2 ft/min. Intermediate: 3-4 ft/min. Speed comes with practice — accuracy matters more."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Speed Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⏱️</span> Machine #443</span><h1>Speed Estimator</h1><p>Estimate sewing time by seam length.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total seam length (ft)</label><input type="number" className="input-field" placeholder="50" value={seamFt} onChange={e=>sS(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Skill level</label><select className="input-field" value={skill} onChange={e=>sSk(e.target.value)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link">🧵 All Machine</a></div></aside></div></div>);}