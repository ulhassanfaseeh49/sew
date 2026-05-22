"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("bifold");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const dims:Record<string,{outer:string,slots:number}>={bifold:{outer:"9×4.5\" (×2 for open)",slots:6},trifold:{outer:"12×4\" (×3 panels)",slots:8},accordion:{outer:"8×4\" + accordion folds",slots:10}};const d=dims[type]||dims.bifold;const hasResult=true;const resultValue=d.outer;const resultLabel=d.slots+" card slot capacity";
const faqItems=[{q:"What fabric for wallets?",a:"Cork fabric, vinyl, or heavy cotton with interfacing. Add card slots from lighter fabric."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Wallet Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>👛</span> Bag #373</span><h1>Wallet Calculator</h1><p>Fabric wallet dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Wallet type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="bifold">Bi-fold</option><option value="trifold">Tri-fold</option><option value="accordion">Accordion</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}