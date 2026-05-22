"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[bs,sBs]=useState("12");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(bs)||12;const side=Math.ceil((b*1.414+1.25)*100)/100;const corner=Math.ceil((b*0.707+0.875)*100)/100;const hasResult=b>0;const resultValue="Side: "+side+"\" / Corner: "+corner+"\"";const resultLabel="cut squares for "+b+"\" blocks";
const faqItems=[{q:"What are setting triangles?",a:"Triangles used to fill edges when blocks are set on-point (diagonal)."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Setting Triangles"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔺</span> Quilt #144</span><h1>Setting Triangles</h1><p>Side and corner triangles for on-point quilts.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Finished block size</label><input type="number" className="input-field" placeholder="12" value={bs} onChange={e=>sBs(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Side triangle sq</span><strong>{side}&quot; (cut diag twice)</strong></div><div className={styles.resultRow}><span>Corner triangle sq</span><strong>{corner}&quot; (cut diag once)</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link">🟩 All Quilt</a></div></aside></div></div>);}