"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[sqSize,sS]=useState("");const[stripW,sW]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sq=parseFloat(sqSize)||0;const sw=parseFloat(stripW)||2;const area=sq*sq;const totalLen=area/sw;const yd=Math.round(totalLen/36*10)/10;const hasResult=sq>0;const resultValue=yd+" yards of bias";const resultLabel="from a "+sq+"\" square cut "+sw+"\" wide";
const faqItems=[{q:"What is the continuous bias method?",a:"Cut a square diagonally, offset seam, then cut in a continuous spiral for long, joined-free bias strips."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Continuous Bias Strip"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔄</span> Bias #282</span><h1>Continuous Bias Strip</h1><p>Bias tape from a fabric square.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Square size (in)</label><input type="number" className="input-field" placeholder="18" value={sqSize} onChange={e=>sS(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Strip width (in)</label><input type="number" className="input-field" value={stripW} onChange={e=>sW(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link">🎀 All Bias</a></div></aside></div></div>);}