"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[armhole,sA]=useState("");const[sleeveCap,sS]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const ah=parseFloat(armhole)||0;const sc=parseFloat(sleeveCap)||0;const ease=sc-ah;const pct=ah>0?(ease/ah*100):0;const hasResult=ah>0&&sc>0;const resultValue=ease.toFixed(2)+"\" ease ("+pct.toFixed(1)+"%)";const resultLabel=ease>0?"Ease in sleeve cap":"Sleeve cap is too small";
const faqItems=[{q:"How much sleeve cap ease is normal?",a:"1-1.5 inches (6-10%) for wovens. Less for casual, more for tailored shoulders. Zero for knits."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Sleeve Cap Ease"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Garment #223</span><h1>Sleeve Cap Ease</h1><p>Sleeve cap ease calculation.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Armhole (in)</label><input type="number" className="input-field" placeholder="16" value={armhole} onChange={e=>sA(e.target.value)}/></div><div className="input-group"><label className="input-label">Sleeve cap (in)</label><input type="number" className="input-field" placeholder="17.5" value={sleeveCap} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}