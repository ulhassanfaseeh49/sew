"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[pieces,sP]=useState("");const[avgW,sW]=useState("4");const[avgH,sH]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseInt(pieces)||0;const w=parseFloat(avgW)||4;const h=parseFloat(avgH)||4;const area=p*w*h;const yd=Math.ceil(area/(17*36)*4)/4;const hasResult=p>0;const resultValue=yd+" yards fusible web";const resultLabel=p+" pieces × "+w+"×"+h+"\"";
const faqItems=[{q:"What is the best fusible web?",a:"HeatnBond Lite for sew-through, HeatnBond Ultra for no-sew. Steam-A-Seam has pressure-sensitive tack."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Fusible Applique Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔥</span> Embroidery #319</span><h1>Fusible Applique Calculator</h1><p>Fusible web for applique projects.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pieces</label><input type="number" className="input-field" placeholder="8" value={pieces} onChange={e=>sP(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Avg width (in)</label><input type="number" className="input-field" value={avgW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Avg height (in)</label><input type="number" className="input-field" value={avgH} onChange={e=>sH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link">🪡 All Embroidery</a></div></aside></div></div>);}