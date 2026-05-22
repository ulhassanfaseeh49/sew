"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[tasselLen,sL]=useState("3");const[qty,sQ]=useState("4");const[wraps,sW]=useState("30");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tl=parseFloat(tasselLen)||3;const q=parseInt(qty)||4;const w=parseInt(wraps)||30;const perTassel=tl*2*w+12;const total=perTassel*q;const yd=Math.ceil(total/36);const hasResult=true;const resultValue=yd+" yards thread";const resultLabel=q+" tassels × "+w+" wraps at "+tl+"\"";
const faqItems=[{q:"What makes a full tassel?",a:"30-50 wraps for embroidery floss. More wraps = fuller tassel. Thicker thread needs fewer wraps."}];
return(<div className="container"><Breadcrumb items={[{label:"Lace & Trim",href:"/lace-trim"},{label:"Tassel Maker Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🪢</span> Trim #328</span><h1>Tassel Maker Calculator</h1><p>Thread for making tassels.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Tassel length (in)</label><input type="number" className="input-field" value={tasselLen} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Number of tassels</label><input type="number" className="input-field" value={qty} onChange={e=>sQ(e.target.value)} min="1"/></div><div className="input-group"><label className="input-label">Wraps per tassel</label><input type="number" className="input-field" value={wraps} onChange={e=>sW(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/lace-trim" className="related-tool-link">🌸 All Trim</a></div></aside></div></div>);}