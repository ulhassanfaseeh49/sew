"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[sq,sSq]=useState("");const[stripW,sSW]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(sq)||0;const sw=parseFloat(stripW)||2;const diagLen=s*1.414;const numStrips=Math.floor(diagLen/sw);const totalLen=numStrips*diagLen;const hasResult=s>0;const resultValue=Math.round(totalLen)+"\" total bias";const resultLabel=numStrips+" strips from "+s+"\" square";
const faqItems=[{q:"How do I cut bias strips?",a:"Cut at 45° to the selvage. Use a continuous bias method for long strips from a square."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Bias Strip Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>↗️</span> Cutting #171</span><h1>Bias Strip Calculator</h1><p>Bias strips at 45° and total yield.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric square (in)</label><input type="number" className="input-field" placeholder="18" value={sq} onChange={e=>sSq(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Strip width</label><input type="number" className="input-field" value={stripW} onChange={e=>sSW(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link">✂️ All Cutting</a></div></aside></div></div>);}