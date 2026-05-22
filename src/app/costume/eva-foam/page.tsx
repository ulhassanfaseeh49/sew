"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[pieces,sP]=useState("");const[avgArea,sA]=useState("100");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseInt(pieces)||0;const a=parseFloat(avgArea)||100;const totalArea=p*a*1.3;const sheets=Math.ceil(totalArea/(24*36));const hasResult=p>0;const resultValue=sheets+" foam sheets (24×36\")";const resultLabel=p+" pieces with 30% waste allowance";
const faqItems=[{q:"What thickness EVA foam for armor?",a:"6mm for detail pieces, 10mm for main armor plates. Layer for thickness or use heat to shape."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"EVA Foam Coverage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Costume #345</span><h1>EVA Foam Coverage</h1><p>EVA foam sheets needed.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Armor pieces</label><input type="number" className="input-field" placeholder="12" value={pieces} onChange={e=>sP(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Avg piece area (sq in)</label><input type="number" className="input-field" value={avgArea} onChange={e=>sA(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}