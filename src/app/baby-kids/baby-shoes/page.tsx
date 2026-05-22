"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[age,sA]=useState("6m");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const footSizes:Record<string,{len:number,sole:string}>={["0m"]:{len:3.5,sole:"3.5×2\""},["3m"]:{len:3.75,sole:"3.75×2.25\""},["6m"]:{len:4,sole:"4×2.5\""},["12m"]:{len:4.5,sole:"4.5×2.75\""},["18m"]:{len:5,sole:"5×3\""}};const s=footSizes[age]||footSizes["6m"];const hasResult=true;const resultValue=s.sole+" sole";const resultLabel="foot length: ~"+s.len+"\" + scrap fabric";
const faqItems=[{q:"What soles for baby shoes?",a:"Soft leather or felt for non-walkers. Non-slip fabric or suede for early walkers."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Baby Shoe/Bootie Size"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>👟</span> Baby #396</span><h1>Baby Shoe/Bootie Size</h1><p>Pattern sizes for baby shoes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Age</label><select className="input-field" value={age} onChange={e=>sA(e.target.value)}><option value="0m">0-3 months</option><option value="3m">3-6 months</option><option value="6m">6-9 months</option><option value="12m">9-12 months</option><option value="18m">12-18 months</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}