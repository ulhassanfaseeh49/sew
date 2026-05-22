"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[weight,sW]=useState("");const[method,sM]=useState("priority");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(weight)||0;const rates:Record<string,{base:number,per:number}>={first:{base:3.5,per:0.2},priority:{base:8,per:0.15},flat:{base:9.45,per:0}};const r=rates[method]||rates.priority;const cost=r.base+w*r.per;const hasResult=w>0;const resultValue="~$"+cost.toFixed(2);const resultLabel="estimated "+method+" shipping for "+w+"oz package";
const faqItems=[{q:"Should I offer free shipping?",a:"Free shipping increases sales but factor the cost into your price. Most buyers prefer free shipping."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Shipping Cost Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📮</span> Pricing #412</span><h1>Shipping Cost Estimator</h1><p>Estimate shipping costs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Package weight (oz)</label><input type="number" className="input-field" placeholder="8" value={weight} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Method</label><select className="input-field" value={method} onChange={e=>sM(e.target.value)}><option value="first">First Class (&lt;16oz)</option><option value="priority">Priority Mail</option><option value="flat">Flat Rate</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link">💰 All Pricing</a></div></aside></div></div>);}