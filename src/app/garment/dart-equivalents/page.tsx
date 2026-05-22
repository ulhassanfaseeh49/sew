"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[intake,sI]=useState("");const[method,sM]=useState("gathers");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const di=parseFloat(intake)||0;const equiv=method==="tucks"?Math.ceil(di/0.25):method==="ease"?di:di;const desc=method==="tucks"?equiv+" tiny tucks at 1/4\"":method==="ease"?di.toFixed(2)+"\" eased in":di.toFixed(2)+"\" gathered";const hasResult=di>0;const resultValue=desc;const resultLabel=di+"\" dart converted to "+method;
const faqItems=[{q:"Can I replace darts with gathers?",a:"Yes, gathers or tucks can replace darts for a softer look. The total intake stays the same."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Dart Equivalents"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔀</span> Garment #204</span><h1>Dart Equivalents</h1><p>Convert dart intake to gathers, tucks, or ease.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Dart intake (in)</label><input type="number" className="input-field" placeholder="1.5" value={intake} onChange={e=>sI(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Convert to</label><select className="input-field" value={method} onChange={e=>sM(e.target.value)}><option value="gathers">Gathers</option><option value="tucks">Tucks</option><option value="ease">Ease</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}