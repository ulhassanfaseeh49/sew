"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[size,sS]=useState("12");const[type,sT]=useState("bear");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(size)||12;const mult=type==="bear"?1.5:type==="doll"?1.25:1;const area=(s+2)*(s+2)*mult*2;const yd=Math.ceil(area/(44*36)*4)/4;const stuffOz=Math.ceil(s*0.5);const hasResult=true;const resultValue=yd+" yards + "+stuffOz+"oz stuffing";const resultLabel=s+"\" "+type+" ("+Math.ceil(mult*4)+" pattern pieces)";
const faqItems=[{q:"What stuffing for stuffed animals?",a:"Polyester fiberfill for most projects. Safety eyes with locking backs for children over 3."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Stuffed Animal Size"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧸</span> Baby #398</span><h1>Stuffed Animal Size</h1><p>Fabric for plush toys.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished size (in)</label><input type="number" className="input-field" value={size} onChange={e=>sS(e.target.value)}/></div><div className="input-group"><label className="input-label">Type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="bear">Bear/animal</option><option value="doll">Rag doll</option><option value="simple">Simple shape</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}