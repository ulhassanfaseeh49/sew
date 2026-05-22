"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("pleated");const[qty,sQ]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const q=parseInt(qty)||4;const per=type==="pleated"?{w:10,h:7}:{w:9,h:7};const area=q*per.w*per.h*2;const yd=Math.ceil(area/(44*36)*8)/8;const hasResult=true;const resultValue=yd+" yards (2 layers) + "+q+"×7\" elastic";const resultLabel=q+" "+type+" masks at "+per.w+"×"+per.h+"\"";
const faqItems=[{q:"How many layers for a face mask?",a:"2-3 layers of tightly woven cotton. Add a filter pocket for optional insert."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Face Mask Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>😷</span> Bag #384</span><h1>Face Mask Calculator</h1><p>Pleated and fitted face masks.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Style</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="pleated">Pleated</option><option value="fitted">Fitted/contoured</option></select></div><div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field" value={qty} onChange={e=>sQ(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}