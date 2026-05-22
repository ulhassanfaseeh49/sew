"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[finW,sF]=useState("0.5");const[fold,sFd]=useState("double");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(finW)||0.5;const cutW=fold==="double"?f*4+0.5:f*2+0.5;const hasResult=true;const resultValue=cutW.toFixed(2)+"\" cut width";const resultLabel=fold+"-fold for "+f+"\" finished";
const faqItems=[{q:"What is the difference between single and double fold?",a:"Single fold: edges fold to center. Double fold: folds again in half. Double is sturdier."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Bias Tape Width Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Bias #280</span><h1>Bias Tape Width Calculator</h1><p>Cutting width for desired finished width.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished width</label><select className="input-field" value={finW} onChange={e=>sF(e.target.value)}><option value="0.25">1/4\"</option><option value="0.375">3/8\"</option><option value="0.5">1/2\"</option><option value="0.75">3/4\"</option><option value="1">1\"</option></select></div><div className="input-group"><label className="input-label">Fold type</label><select className="input-field" value={fold} onChange={e=>sFd(e.target.value)}><option value="single">Single fold</option><option value="double">Double fold</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Cut width</span><strong>{cutW.toFixed(2)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link">🎀 All Bias</a></div></aside></div></div>);}