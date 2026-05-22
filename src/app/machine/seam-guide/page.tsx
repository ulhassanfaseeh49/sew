"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[sa,sS]=useState("0.625");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(sa)||0.625;const mm=s*25.4;const guide=s===0.25?"Use 1/4\" piecing foot or tape mark":s===0.625?"Align fabric edge with right edge of standard foot":"Use seam guide markings on needle plate or magnetic guide";const hasResult=true;const resultValue=s+"\" = "+mm.toFixed(1)+"mm";const resultLabel=guide;
const faqItems=[{q:"Why is 5/8 inch the standard seam allowance?",a:"It provides enough fabric for strong seams, allows for fitting adjustments, and resists fraying."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Seam Guide Tool"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Machine #447</span><h1>Seam Guide Tool</h1><p>Seam allowance guide for machines.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Seam allowance</label><select className="input-field" value={sa} onChange={e=>sS(e.target.value)}><option value="0.25">1/4\" (quilting)</option><option value="0.375">3/8\"</option><option value="0.5">1/2\"</option><option value="0.625">5/8\" (standard)</option><option value="1">1\" (home décor)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link">🧵 All Machine</a></div></aside></div></div>);}