"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[cordDia,sC]=useState("0.25");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const cd=parseFloat(cordDia)||0.25;const biasW=cd*Math.PI+1.25;const hasResult=true;const resultValue=biasW.toFixed(1)+"\" bias strip width";const resultLabel="for "+cd+"\" cord (circumference + 1.25\" SA)";
const faqItems=[{q:"How do I calculate bias width for piping?",a:"Wrap the cord: circumference = diameter × pi. Add 1.25 inches for two 5/8 inch seam allowances."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Piping from Bias Tape"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>〰️</span> Bias #289</span><h1>Piping from Bias Tape</h1><p>Bias tape width for piping cord.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Cord diameter</label><select className="input-field" value={cordDia} onChange={e=>sC(e.target.value)}><option value="0.125">1/8\" (size 0)</option><option value="0.1875">3/16\" (size 1)</option><option value="0.25">1/4\" (size 2)</option><option value="0.375">3/8\" (size 5)</option><option value="0.5">1/2\" (size 8)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link">🎀 All Bias</a></div></aside></div></div>);}