"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("half");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const dims:Record<string,{fabric:string,stiff:string}>={half:{fabric:"12×8\" piece",stiff:"Buckram or craft felt"},full:{fabric:"14×10\" piece",stiff:"Heavy buckram + batting"},eye:{fabric:"8×4\" piece",stiff:"Craft foam or buckram"}};const d=dims[type]||dims.half;const hasResult=true;const resultValue=d.fabric;const resultLabel="plus "+d.stiff+" for structure";
const faqItems=[{q:"What stiffener for masks?",a:"Buckram for traditional masks, craft foam for lightweight, Worbla for rigid cosplay masks."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Mask Pattern Tool"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🎭</span> Costume #342</span><h1>Mask Pattern Tool</h1><p>Fabric for costume masks.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Mask type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="half">Half-face mask</option><option value="full">Full-face mask</option><option value="eye">Eye mask/domino</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}