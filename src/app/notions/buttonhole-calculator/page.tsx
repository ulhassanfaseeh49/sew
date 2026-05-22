"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[diameter,sD]=useState("");const[thickness,sT]=useState("0.125");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const d=parseFloat(diameter)||0;const th=parseFloat(thickness)||0.125;const bhLen=d+th+0.125;const hasResult=d>0;const resultValue=bhLen.toFixed(3)+"\" buttonhole";const resultLabel="diameter + thickness + 1/8\" ease";
const faqItems=[{q:"How do I test buttonhole size?",a:"Always test on scrap fabric first. The button should slide through with slight resistance."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Buttonhole Length Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🕳️</span> Notion #188</span><h1>Buttonhole Length Calculator</h1><p>Buttonhole length from button size.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Button diameter (in)</label><input type="number" className="input-field" placeholder="0.625" value={diameter} onChange={e=>sD(e.target.value)} min="0" step="0.0625"/></div><div className="input-group"><label className="input-label">Button thickness (in)</label><input type="number" className="input-field" value={thickness} onChange={e=>sT(e.target.value)} min="0" step="0.0625"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Buttonhole length</span><strong>{bhLen.toFixed(3)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}