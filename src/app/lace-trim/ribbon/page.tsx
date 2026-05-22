"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[straight,sS]=useState("");const[bows,sB]=useState("0");const[bowSize,sBs]=useState("24");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(straight)||0;const b=parseInt(bows)||0;const bs=parseFloat(bowSize)||24;const total=s+b*bs;const yd=Math.ceil(total/36*4)/4;const hasResult=s>0||b>0;const resultValue=yd+" yards";const resultLabel=s+"\" straight + "+b+" bows";
const faqItems=[{q:"How much ribbon per bow?",a:"24 inches for a simple bow, 36+ for a multi-loop bow. Wider ribbon needs more length."}];
return(<div className="container"><Breadcrumb items={[{label:"Lace & Trim",href:"/lace-trim"},{label:"Ribbon Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🎀</span> Trim #326</span><h1>Ribbon Calculator</h1><p>Ribbon for bows, sashes, edges.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Straight length (in)</label><input type="number" className="input-field" placeholder="36" value={straight} onChange={e=>sS(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of bows</label><input type="number" className="input-field" value={bows} onChange={e=>sB(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Per bow (in)</label><input type="number" className="input-field" value={bowSize} onChange={e=>sBs(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/lace-trim" className="related-tool-link">🌸 All Trim</a></div></aside></div></div>);}