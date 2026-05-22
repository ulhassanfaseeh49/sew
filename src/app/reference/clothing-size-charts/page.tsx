"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[region,sR]=useState("us");const[type,sT]=useState("women");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const hasResult=true;const resultValue=region.toUpperCase()+" "+type+" sizing";const resultLabel=region==="us"?"US sizes: 0-2 (XS), 4-6 (S), 8-10 (M), 12-14 (L), 16-18 (XL)":region==="uk"?"UK sizes: 6 (XS), 8-10 (S), 12-14 (M), 16-18 (L)":"EU sizes: 32-34 (XS), 36-38 (S), 40-42 (M), 44-46 (L)";
const faqItems=[{q:"Why dont clothing sizes match?",a:"Vanity sizing and brand differences mean a size 8 varies widely. Always use body measurements for sewing."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Clothing Size Charts"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>👗</span> Ref #469</span><h1>Clothing Size Charts</h1><p>US/UK/EU sizing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Region</label><select className="input-field" value={region} onChange={e=>sR(e.target.value)}><option value="us">US</option><option value="uk">UK</option><option value="eu">EU</option></select></div><div className="input-group"><label className="input-label">Type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="women">Women</option><option value="men">Men</option><option value="children">Children</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}