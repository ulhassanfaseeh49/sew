"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[finW,sF]=useState("0.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(finW)||0.5;const singleCut=f*2+0.5;const doubleCut=f*4+0.5;const hasResult=true;const resultValue="Single: "+singleCut.toFixed(1)+"\" / Double: "+doubleCut.toFixed(1)+"\"";const resultLabel="cut widths for "+f+"\" finished";
const faqItems=[{q:"When to use single vs double fold?",a:"Single fold for enclosed edges. Double fold for raw edges — it wraps completely for a clean finish."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Single vs Double Fold"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⚖️</span> Bias #284</span><h1>Single vs Double Fold</h1><p>Compare fold types.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Desired finished width</label><select className="input-field" value={finW} onChange={e=>sF(e.target.value)}><option value="0.25">1/4\"</option><option value="0.375">3/8\"</option><option value="0.5">1/2\"</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Single fold cut</span><strong>{singleCut.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Double fold cut</span><strong>{doubleCut.toFixed(2)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link">🎀 All Bias</a></div></aside></div></div>);}