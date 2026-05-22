"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[panels,sP]=useState("6");const[bustToWaist,sBW]=useState("8");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseInt(panels)||6;const bw=parseFloat(bustToWaist)||8;const bones=p*2;const boneLen=bw-0.5;const totalLen=bones*boneLen;const hasResult=true;const resultValue=bones+" bones at "+boneLen+"\"";const resultLabel=totalLen+"\" total boning";
const faqItems=[{q:"What type of boning should I use?",a:"Spiral steel for curves, flat steel for straight lines, plastic for lightweight support."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Boning Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🦴</span> Notion #200</span><h1>Boning Calculator</h1><p>Boning lengths for corsets and bodices.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Number of panels</label><input type="number" className="input-field" value={panels} onChange={e=>sP(e.target.value)} min="2"/></div><div className="input-group"><label className="input-label">Bust to waist (in)</label><input type="number" className="input-field" value={bustToWaist} onChange={e=>sBW(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Bones per panel</span><strong>2</strong></div><div className={styles.resultRow}><span>Bone length</span><strong>{boneLen}&quot; (seam length - 1/2&quot;)</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}