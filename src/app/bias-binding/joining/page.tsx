"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[totalLen,sL]=useState("");const[stripLen,sS]=useState("42");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(totalLen)||0;const sl=parseFloat(stripLen)||42;const joins=Math.ceil(l/sl)-1;const extraPerJoin=2;const totalExtra=joins*extraPerJoin;const adjusted=l+totalExtra;const hasResult=l>0;const resultValue=joins+" joins, add "+totalExtra+"\"";const resultLabel=adjusted+"\" total including joins";
const faqItems=[{q:"How do I join bias strips?",a:"Place strips right sides together at 90 degrees, sew diagonally, then trim to 1/4 inch seam."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Bias Tape Joining"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔗</span> Bias #285</span><h1>Bias Tape Joining</h1><p>Extra length for joins.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total length needed (in)</label><input type="number" className="input-field" placeholder="120" value={totalLen} onChange={e=>sL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Strip length</label><input type="number" className="input-field" value={stripLen} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link">🎀 All Bias</a></div></aside></div></div>);}