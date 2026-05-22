"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[winH,sH]=useState("");const[style,sS]=useState("floor");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const h=parseFloat(winH)||0;const adj=style==="sill"?-0.5:style==="apron"?4:style==="floor"?-0.5:6;const finLen=h+adj;const hasResult=h>0;const resultValue=finLen.toFixed(1)+"\" finished length";const resultLabel=style+" length curtain";
const faqItems=[{q:"What is the most popular curtain length?",a:"Floor length (1/2 inch above floor) is most popular and gives the most polished look."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Curtain Length Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Curtain #241</span><h1>Curtain Length Calculator</h1><p>Calculate length for sill, floor, and puddle.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Rod to target (in)</label><input type="number" className="input-field" placeholder="84" value={winH} onChange={e=>sH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Style</label><select className="input-field" value={style} onChange={e=>sS(e.target.value)}><option value="sill">Sill (1/2\" above)</option><option value="apron">Apron (4\" below sill)</option><option value="floor">Floor (1/2\" above)</option><option value="puddle">Puddle (+6\" on floor)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link">🪟 All Curtains</a></div></aside></div></div>);}