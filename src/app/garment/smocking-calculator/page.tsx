"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[finWidth,sF]=useState("");const[ratio,sR]=useState("2.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fw=parseFloat(finWidth)||0;const r=parseFloat(ratio)||2.5;const fabric=fw*r;const hasResult=fw>0;const resultValue=fabric.toFixed(1)+"\" fabric width";const resultLabel="for "+fw+"\" finished smocking at "+r+"x";
const faqItems=[{q:"How much fabric does smocking use?",a:"2-3x the finished width depending on stitch pattern complexity."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Smocking Yardage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧵</span> Garment #209</span><h1>Smocking Yardage</h1><p>Fabric width for smocking.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished smocked width (in)</label><input type="number" className="input-field" placeholder="14" value={finWidth} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Smocking ratio</label><select className="input-field" value={ratio} onChange={e=>sR(e.target.value)}><option value="2">2x (cable)</option><option value="2.5">2.5x (standard)</option><option value="3">3x (complex)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}