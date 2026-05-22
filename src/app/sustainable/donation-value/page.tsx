"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("quilting");const[yards,sY]=useState("");const[condition,sC]=useState("new");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const y=parseFloat(yards)||0;const base:Record<string,number>={quilting:8,apparel:6,silk:15,upholstery:10};const condMult=condition==="new"?0.5:condition==="washed"?0.4:0.25;const perYd=(base[type]||8)*condMult;const total=y*perYd;const hasResult=y>0;const resultValue="$"+total.toFixed(2)+" fair swap value";const resultLabel="$"+perYd.toFixed(2)+"/yard for "+condition+" "+type;
const faqItems=[{q:"How do I value fabric for donation?",a:"30-50% of retail for new unused fabric. 15-25% for washed/used. Consider tax deduction value."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Donation Value Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🎁</span> Eco #458</span><h1>Donation Value Calculator</h1><p>Value fabric for donations/swaps.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="quilting">Quilting cotton</option><option value="apparel">Apparel fabric</option><option value="silk">Silk/luxury</option><option value="upholstery">Upholstery</option></select></div><div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" placeholder="3" value={yards} onChange={e=>sY(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Condition</label><select className="input-field" value={condition} onChange={e=>sC(e.target.value)}><option value="new">New/unused</option><option value="washed">Washed once</option><option value="used">Previously used</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link">♻️ All Sustainable</a></div></aside></div></div>);}