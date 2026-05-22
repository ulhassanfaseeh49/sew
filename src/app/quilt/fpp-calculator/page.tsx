"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fin,sF]=useState("6");const[sections,sS]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fin)||6;const s=parseInt(sections)||4;const template=f+1;const fabricPerSection=f/s+1;const hasResult=f>0;const resultValue=template+"\" template";const resultLabel=s+" sections, fabric pieces ~"+fabricPerSection.toFixed(1)+"\"";
const faqItems=[{q:"What is FPP?",a:"Foundation Paper Piecing — sewing fabric to paper templates for sharp points."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"FPP Size Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📄</span> Quilt #158</span><h1>FPP Size Calculator</h1><p>Template and fabric sizes for foundation paper piecing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished size</label><input type="number" className="input-field" value={fin} onChange={e=>sF(e.target.value)}/></div><div className="input-group"><label className="input-label">Sections</label><input type="number" className="input-field" value={sections} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link">🟩 All Quilt</a></div></aside></div></div>);}