"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[waist,sW]=useState("");const[frontLen,sF]=useState("18");const[backLen,sB]=useState("30");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const fl=parseFloat(frontLen)||18;const bl=parseFloat(backLen)||30;const r=w/(2*Math.PI);const totalR=r+bl;const yd=Math.ceil((totalR+1)*2/36*4)/4*2;const hasResult=w>0;const resultValue=yd+" yards";const resultLabel="front "+fl+"\" → back "+bl+"\" (circle-based cut)";
const faqItems=[{q:"How do I cut a high-low skirt?",a:"Use a circle skirt base with the back cut longer. The transition happens smoothly at the sides."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"High-Low Hem Skirt"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>↗️</span> Skirt #366</span><h1>High-Low Hem Skirt</h1><p>Asymmetric hem skirt.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Front length (in)</label><input type="number" className="input-field" value={frontLen} onChange={e=>sF(e.target.value)}/></div><div className="input-group"><label className="input-label">Back length (in)</label><input type="number" className="input-field" value={backLen} onChange={e=>sB(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link">👗 All Skirts</a></div></aside></div></div>);}