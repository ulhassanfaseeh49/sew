"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[garment,sG]=useState("dress");const[opening,sO]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const o=parseFloat(opening)||0;const add=garment==="pants"?1:garment==="jacket"?0:2;const zipLen=o>0?Math.ceil((o+add)/2)*2:0;const hasResult=o>0;const resultValue=zipLen+"\" zipper";const resultLabel="for "+o+"\" opening (rounded to nearest even inch)";
const faqItems=[{q:"Should I buy a longer zipper?",a:"Yes, buying 1-2 inches longer is fine — you can shorten most zippers by sewing a new stop."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Zipper Length Selector"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🤐</span> Notion #189</span><h1>Zipper Length Selector</h1><p>Correct zipper length by garment type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Garment type</label><select className="input-field" value={garment} onChange={e=>sG(e.target.value)}><option value="dress">Dress (back)</option><option value="skirt">Skirt (side)</option><option value="pants">Pants (fly)</option><option value="jacket">Jacket (separating)</option></select></div><div className="input-group"><label className="input-label">Opening length (in)</label><input type="number" className="input-field" placeholder="22" value={opening} onChange={e=>sO(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}