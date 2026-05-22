"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[size,sS]=useState("medium");const[qty,sQ]=useState("3");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const q=parseInt(qty)||3;const yd=Math.ceil(q*0.25*4)/4;const elastic=q*14;const hasResult=true;const resultValue=yd+" yards PUL + "+elastic+"\" elastic";const resultLabel=q+" "+size+" diaper covers";
const faqItems=[{q:"What fabric for diaper covers?",a:"PUL (polyurethane laminate) for waterproof covers. Use FOE (fold-over elastic) for leg openings."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Diaper Cover Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🩲</span> Baby #393</span><h1>Diaper Cover Calculator</h1><p>Fabric for cloth diaper covers.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="newborn">Newborn</option><option value="small">Small (3-6m)</option><option value="medium">Medium (6-12m)</option><option value="large">Large (12-24m)</option></select></div><div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field" value={qty} onChange={e=>sQ(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}