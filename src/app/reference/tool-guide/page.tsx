"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[category,sC]=useState("cutting");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,string>={cutting:"Fabric scissors (8\"), rotary cutter (45mm), cutting mat, pinking shears, thread snips",measuring:"Tape measure, clear rulers (6×24\"), seam gauge, French curve, hip curve",marking:"Chalk pencil, water-soluble markers, tracing wheel + carbon paper, tailor tacks",pressing:"Iron, pressing ham, sleeve board, seam roll, pressing cloth, tailor clapper",sewing:"Hand needles (sharps #8), pins, pin cushion, thimble, seam ripper, needle threader"};const list=info[category]||info.cutting;const hasResult=true;const resultValue=category+" tools";const resultLabel=list;
const faqItems=[{q:"What are the most essential sewing tools?",a:"Good scissors, a tape measure, pins, and a seam ripper. These are used in every single project."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Sewing Tool Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧰</span> Ref #482</span><h1>Sewing Tool Guide</h1><p>Guide to all sewing tools.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Tool category</label><select className="input-field" value={category} onChange={e=>sC(e.target.value)}><option value="cutting">Cutting tools</option><option value="measuring">Measuring tools</option><option value="marking">Marking tools</option><option value="pressing">Pressing tools</option><option value="sewing">Hand sewing tools</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}