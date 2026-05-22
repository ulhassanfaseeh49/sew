"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[sq,sSq]=useState("");const[method,sM]=useState("hst");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(sq)||0;const per=method==="qst"?4:2;const sqPerYard=Math.floor(42/s)*Math.floor(36/s);const total=sqPerYard*per;const hasResult=s>0;const resultValue=total+" triangles/yard";const resultLabel=sqPerYard+" squares x "+per+" triangles each";
const faqItems=[{q:"How many triangles per square?",a:"HST method: 2 per square. QST method: 4 per square."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Triangle Cutting Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔺</span> Cutting #170</span><h1>Triangle Cutting Calculator</h1><p>How many triangles from fabric.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Square size</label><input type="number" className="input-field" placeholder="5" value={sq} onChange={e=>sSq(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Method</label><select className="input-field" value={method} onChange={e=>sM(e.target.value)}><option value="hst">HST (2 per sq)</option><option value="qst">QST (4 per sq)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link">✂️ All Cutting</a></div></aside></div></div>);}