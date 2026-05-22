"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("foldover");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const dims:Record<string,{cut:string,hardware:string}>={foldover:{cut:"11×18\" (folds to 11×9\")",hardware:"magnetic snap"},frame:{cut:"12×8\" + gussets",hardware:"kiss-lock frame"},envelope:{cut:"12×16\" (triangular fold)",hardware:"magnetic snap"}};const d=dims[type]||dims.foldover;const hasResult=true;const resultValue=d.cut;const resultLabel="plus interfacing, "+d.hardware;
const faqItems=[{q:"What interfacing for a clutch?",a:"Heavy interfacing (Peltex 70) or foam for structure. Fusible fleece for softer bags."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Clutch/Evening Bag"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>👝</span> Bag #378</span><h1>Clutch/Evening Bag</h1><p>Clutch purse dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Style</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="foldover">Fold-over clutch</option><option value="frame">Frame clutch</option><option value="envelope">Envelope clutch</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}