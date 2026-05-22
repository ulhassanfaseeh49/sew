"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[pieces,sP]=useState("");const[avgSize,sS]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseInt(pieces)||0;const s=parseFloat(avgSize)||4;const area=p*s*s;const yd=Math.ceil(area/(17*36)*4)/4;const hasResult=p>0;const resultValue=yd+" yards fusible web";const resultLabel=p+" pieces at ~"+s+"x"+s+"\"";
const faqItems=[{q:"What is fusible web?",a:"A heat-activated adhesive sheet used to bond fabric pieces for applique without sewing."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Fusible Web Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔥</span> Notion #198</span><h1>Fusible Web Calculator</h1><p>Fusible web yardage for applique.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Applique pieces</label><input type="number" className="input-field" placeholder="12" value={pieces} onChange={e=>sP(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Avg piece size (in)</label><input type="number" className="input-field" value={avgSize} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}