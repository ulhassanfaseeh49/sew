"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[stripW,sS]=useState("2.5");const[pieceW,sPW]=useState("2.5");const[fw,sFw]=useState("42");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sw=parseFloat(stripW)||2.5;const pw=parseFloat(pieceW)||2.5;const fw2=parseFloat(fw)||42;const perStrip=Math.floor(fw2/pw);const hasResult=sw>0;const resultValue=perStrip+" pieces per strip";const resultLabel=pw+"\" pieces from "+sw+"\" x "+fw2+"\" strip";
const faqItems=[{q:"What are sub-cuts?",a:"Cutting a strip into smaller pieces. A 2.5 inch WOF strip sub-cut into 2.5 inch squares gives 16 squares."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Sub-Cut Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>✂️</span> Cutting #174</span><h1>Sub-Cut Calculator</h1><p>Sub-cuts from strips into pieces.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Strip width</label><input type="number" className="input-field" value={stripW} onChange={e=>sS(e.target.value)}/></div><div className="input-group"><label className="input-label">Piece width</label><input type="number" className="input-field" value={pieceW} onChange={e=>sPW(e.target.value)}/></div><div className="input-group"><label className="input-label">Fabric width</label><input type="number" className="input-field" value={fw} onChange={e=>sFw(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link">✂️ All Cutting</a></div></aside></div></div>);}