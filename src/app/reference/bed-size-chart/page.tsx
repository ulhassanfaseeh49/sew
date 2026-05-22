"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[region,sR]=useState("us");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,string>={us:"Twin 38×75 | Full 54×75 | Queen 60×80 | King 76×80 | Cal King 72×84",uk:"Single 36×75 | Double 54×75 | King 60×78 | Super King 72×78",eu:"Single 90×200cm | Double 140×200cm | King 160×200cm | Super King 180×200cm"};const s=sizes[region]||sizes.us;const hasResult=true;const resultValue=region.toUpperCase()+" mattress sizes";const resultLabel=s;
const faqItems=[{q:"Why do I need mattress sizes for sewing?",a:"Essential for making fitted sheets, duvet covers, bed skirts, and quilts that actually fit."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Bed/Mattress Size Chart"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🛏️</span> Ref #470</span><h1>Bed/Mattress Size Chart</h1><p>Mattress sizes worldwide.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Region</label><select className="input-field" value={region} onChange={e=>sR(e.target.value)}><option value="us">US</option><option value="uk">UK</option><option value="eu">EU</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}