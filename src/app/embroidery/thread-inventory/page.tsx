"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[brand,sB]=useState("dmc");const[count,sC]=useState("0");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const c=parseInt(count)||0;const totals:Record<string,number>={dmc:500,anchor:460,sulky:534,isacord:400};const total=totals[brand]||500;const pct=total>0?Math.round(c/total*100):0;const hasResult=true;const resultValue=c+"/"+total+" colors ("+pct+"%)";const resultLabel=brand.toUpperCase()+" collection progress";
const faqItems=[{q:"How many DMC colors are there?",a:"DMC has approximately 500 colors in their standard embroidery floss range."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Thread Inventory Tracker"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📦</span> Embroidery #320</span><h1>Thread Inventory Tracker</h1><p>Track your thread collection.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Brand</label><select className="input-field" value={brand} onChange={e=>sB(e.target.value)}><option value="dmc">DMC</option><option value="anchor">Anchor</option><option value="sulky">Sulky</option><option value="isacord">Isacord</option></select></div><div className="input-group"><label className="input-label">Colors owned</label><input type="number" className="input-field" value={count} onChange={e=>sC(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link">🪡 All Embroidery</a></div></aside></div></div>);}