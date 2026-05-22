"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("standard");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{fabric:string,size:string}>={standard:{fabric:"0.75 yards canvas",size:"14×16×4\""},foldable:{fabric:"0.5 yards ripstop nylon",size:"15×17\" (folds to 4×4\")"},mesh:{fabric:"0.5 yards mesh fabric",size:"12×14\" (see-through)"}};const d=data[type]||data.standard;const hasResult=true;const resultValue=d.fabric;const resultLabel=d.size;
const faqItems=[{q:"What fabric is best for grocery bags?",a:"Canvas or duck cloth for durability. Ripstop nylon for foldable bags. Use reinforced handles."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Market/Grocery Bag"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🛒</span> Bag #376</span><h1>Market/Grocery Bag</h1><p>Reusable grocery bags.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Style</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="standard">Standard tote</option><option value="foldable">Foldable/roll-up</option><option value="mesh">Mesh produce bag</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}