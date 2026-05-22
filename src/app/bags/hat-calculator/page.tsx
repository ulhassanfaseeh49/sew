"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[head,sH]=useState("22");const[type,sT]=useState("bucket");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const h=parseFloat(head)||22;const yds:Record<string,number>={bucket:0.5,baseball:0.5,beanie:0.25,sun:0.75};const yd=yds[type]||0.5;const hasResult=true;const resultValue=yd+" yards";const resultLabel=type+" hat for "+h+"\" head";
const faqItems=[{q:"How do I measure for a hat?",a:"Measure around your head just above the ears. Standard adult is 21.5-23 inches."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Hat Size Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧢</span> Bag #381</span><h1>Hat Size Calculator</h1><p>Fabric for hats.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Head circumference (in)</label><input type="number" className="input-field" value={head} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Hat type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="bucket">Bucket hat</option><option value="baseball">Baseball cap</option><option value="beanie">Beanie</option><option value="sun">Sun hat (wide brim)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}