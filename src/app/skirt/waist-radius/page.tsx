"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[waist,sW]=useState("");const[portion,sP]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const p=parseFloat(portion)||1;const r=w/(2*Math.PI*p);const hasResult=w>0;const resultValue=r.toFixed(2)+"\" radius";const resultLabel="formula: waist ÷ (2π × "+p+")";
const faqItems=[{q:"Why is the radius formula important?",a:"The waist radius is the starting point for ALL circle skirt patterns. Its the inner curve you cut."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"Waist Radius Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Skirt #358</span><h1>Waist Radius Calculator</h1><p>Radius from waist measurement.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Circle portion</label><select className="input-field" value={portion} onChange={e=>sP(e.target.value)}><option value="0.25">Quarter (90°)</option><option value="0.5">Half (180°)</option><option value="0.75">Three-quarter (270°)</option><option value="1">Full (360°)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link">👗 All Skirts</a></div></aside></div></div>);}