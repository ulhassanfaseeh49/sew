"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[system,sS]=useState("us");const[size,sSz]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sz=parseInt(size)||4;const conv:Record<string,Record<number,string>>={us:{2:"UK 2-3 / EU 92",4:"UK 3-4 / EU 104",6:"UK 5-6 / EU 116",8:"UK 7-8 / EU 128",10:"UK 9-10 / EU 140",12:"UK 11-12 / EU 152"},uk:{2:"US 2 / EU 92",4:"US 4 / EU 104",6:"US 6 / EU 116",8:"US 8 / EU 128",10:"US 10 / EU 140",12:"US 12 / EU 152"},eu:{2:"US 2T / UK 2-3",4:"US 4 / UK 3-4",6:"US 6 / UK 5-6",8:"US 8 / UK 7-8",10:"US 10 / UK 9-10",12:"US 12 / UK 11-12"}};const result=conv[system]?.[sz]||"N/A";const hasResult=true;const resultValue=system.toUpperCase()+" "+sz;const resultLabel=result;
const faqItems=[{q:"Are children sizes the same worldwide?",a:"No, US, UK, and EU use different numbering. Always check a conversion chart and measure the child."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Children Size Converter"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Baby #389</span><h1>Children Size Converter</h1><p>US/UK/EU size conversion.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">System</label><select className="input-field" value={system} onChange={e=>sS(e.target.value)}><option value="us">US</option><option value="uk">UK</option><option value="eu">EU</option></select></div><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={size} onChange={e=>sSz(e.target.value)}><option value="2">2</option><option value="4">4</option><option value="6">6</option><option value="8">8</option><option value="10">10</option><option value="12">12</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}