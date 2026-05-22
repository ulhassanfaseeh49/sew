"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[size,sS]=useState("18");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseInt(size)||18;const cut=s+1;const yd=Math.ceil(cut*2/36*4)/4;const zipLen=s-2;const hasResult=true;const resultValue=yd+" yards + "+zipLen+"\" zipper";const resultLabel="two "+cut+"x"+cut+"\" pieces";
const faqItems=[{q:"What size zipper for a cushion cover?",a:"2 inches shorter than the cushion size. For an 18 inch cushion use a 16 inch zipper."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Cushion Cover (Zipper)"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔲</span> Home #261</span><h1>Cushion Cover (Zipper)</h1><p>Fabric for zipper cushion covers.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Cushion size (in)</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="14">14\"</option><option value="16">16\"</option><option value="18">18\"</option><option value="20">20\"</option><option value="22">22\"</option><option value="24">24\"</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}