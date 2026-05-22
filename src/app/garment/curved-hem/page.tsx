"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[hemDepth,sH]=useState("1");const[curve,sC]=useState("moderate");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const hd=parseFloat(hemDepth)||1;const method=curve==="extreme"?"Narrow hem or bias facing":curve==="moderate"?"Ease with steam, use narrow hem":"Standard hem works";const maxHem=curve==="extreme"?0.5:curve==="moderate"?0.75:hd;const hasResult=true;const resultValue=method;const resultLabel="max hem depth: "+maxHem+"\" for "+curve+" curve";
const faqItems=[{q:"Why is hemming a circle skirt hard?",a:"The curved edge is longer than the fold line, causing ripples. Use a narrow hem or bias facing."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Curved Hem Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🌀</span> Garment #212</span><h1>Curved Hem Calculator</h1><p>Adjustments for hemming curved edges.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Hem depth (in)</label><input type="number" className="input-field" value={hemDepth} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Curve amount</label><select className="input-field" value={curve} onChange={e=>sC(e.target.value)}><option value="slight">Slight (A-line)</option><option value="moderate">Moderate (flared)</option><option value="extreme">Extreme (circle skirt)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}