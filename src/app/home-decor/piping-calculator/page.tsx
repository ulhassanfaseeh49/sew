"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[totalLen,sL]=useState("");const[cordDia,sC]=useState("0.25");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(totalLen)||0;const cd=parseFloat(cordDia)||0.25;const biasW=cd*Math.PI+1.25;const cordYd=Math.ceil(l/36*4)/4;const biasYd=cordYd;const hasResult=l>0;const resultValue=cordYd+" yards cord + bias";const resultLabel="bias cut "+biasW.toFixed(1)+"\" wide";
const faqItems=[{q:"What size piping cord is most common?",a:"1/4 inch (size 2) for cushions and garments. 3/8 inch for upholstery."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Piping/Welt Cord Yardage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>〰️</span> Home #268</span><h1>Piping/Welt Cord Yardage</h1><p>Bias strip and cord for piping.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total piping length (in)</label><input type="number" className="input-field" placeholder="120" value={totalLen} onChange={e=>sL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Cord diameter (in)</label><select className="input-field" value={cordDia} onChange={e=>sC(e.target.value)}><option value="0.125">1/8\"</option><option value="0.25">1/4\"</option><option value="0.375">3/8\"</option><option value="0.5">1/2\"</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}