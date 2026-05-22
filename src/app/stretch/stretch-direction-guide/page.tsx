"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[dir,sD]=useState("four");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info=dir==="two"?{desc:"Stretches in one direction (usually crosswise)",use:"T-shirts, casual wear, some pants",note:"Place stretch direction around body for comfort"}:{desc:"Stretches in both length and width",use:"Activewear, swimwear, dancewear, fitted garments",note:"More versatile, better recovery, easier to sew"};const hasResult=true;const resultValue=dir+"-way stretch";const resultLabel=info.desc;
const faqItems=[{q:"Do I need four-way stretch?",a:"For activewear and swimwear, yes. For casual T-shirts and dresses, two-way is fine."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Two-Way vs Four-Way Stretch"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>↔️</span> Stretch #308</span><h1>Two-Way vs Four-Way Stretch</h1><p>Compare stretch directions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Stretch direction</label><select className="input-field" value={dir} onChange={e=>sD(e.target.value)}><option value="two">Two-way stretch</option><option value="four">Four-way stretch</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Best for</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{info.use}</strong></div><div className={styles.resultRow}><span>Tip</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{info.note}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link">🧶 All Stretch</a></div></aside></div></div>);}