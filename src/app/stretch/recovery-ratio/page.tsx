"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[stretch,sS]=useState("");const[recovery,sR]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(stretch)||0;const r=parseFloat(recovery)||0;const quality=r>=95?"Excellent":r>=85?"Good":r>=75?"Fair":"Poor";const hasResult=s>0&&r>0;const resultValue=quality+" quality";const resultLabel=s+"% stretch with "+r+"% recovery";
const faqItems=[{q:"What makes good recovery?",a:"95%+ is excellent (activewear quality). Below 80% means the fabric will bag out over time."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Recovery and Stretch Ratio"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📈</span> Stretch #307</span><h1>Recovery and Stretch Ratio</h1><p>Stretch-to-recovery quality ratio.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Stretch %</label><input type="number" className="input-field" placeholder="50" value={stretch} onChange={e=>sS(e.target.value)}/></div><div className="input-group"><label className="input-label">Recovery %</label><input type="number" className="input-field" placeholder="95" value={recovery} onChange={e=>sR(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link">🧶 All Stretch</a></div></aside></div></div>);}