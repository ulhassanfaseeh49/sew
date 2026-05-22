"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[finWidth,sF]=useState("");const[pleatDepth,sP]=useState("1");const[type,sT]=useState("knife");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fw=parseFloat(finWidth)||0;const pd=parseFloat(pleatDepth)||1;const mult=type==="box"?3:2;const fabricNeeded=fw*mult;const numPleats=Math.floor(fw/(pd*2));const hasResult=fw>0;const resultValue=fabricNeeded+"\" fabric needed";const resultLabel=numPleats+" "+type+" pleats for "+fw+"\" finished";
const faqItems=[{q:"How much extra fabric for pleats?",a:"Knife pleats need 2x fabric, box pleats need 3x fabric width."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Pleat Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📊</span> Garment #205</span><h1>Pleat Calculator</h1><p>Calculate pleat depth, spacing, and number.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished width (in)</label><input type="number" className="input-field" placeholder="20" value={finWidth} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Pleat depth (in)</label><input type="number" className="input-field" value={pleatDepth} onChange={e=>sP(e.target.value)}/></div><div className="input-group"><label className="input-label">Type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="knife">Knife</option><option value="box">Box</option><option value="inverted">Inverted</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Fabric ratio</span><strong>{mult}:1</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}