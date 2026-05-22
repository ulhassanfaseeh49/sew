"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[wrist,sW]=useState("");const[cuffW,sCW]=useState("2.5");const[overlap,sO]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(wrist)||0;const cw=parseFloat(cuffW)||2.5;const o=parseFloat(overlap)||1;const cutLen=w+o+1.25;const cutW=cw*2+1.25;const hasResult=w>0;const resultValue=cutLen.toFixed(1)+"\" × "+cutW.toFixed(1)+"\"";const resultLabel="cuff cut dimensions";
const faqItems=[{q:"How much ease in a cuff?",a:"About 1/2 inch ease so the cuff can slide over the hand. More for French cuffs."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Cuff Size Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔘</span> Garment #222</span><h1>Cuff Size Calculator</h1><p>Cuff dimensions for various styles.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Wrist (in)</label><input type="number" className="input-field" placeholder="7" value={wrist} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Cuff width (in)</label><input type="number" className="input-field" value={cuffW} onChange={e=>sCW(e.target.value)}/></div><div className="input-group"><label className="input-label">Overlap</label><input type="number" className="input-field" value={overlap} onChange={e=>sO(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}