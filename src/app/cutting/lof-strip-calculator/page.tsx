"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[stripW,sS]=useState("4");const[len,sL]=useState("80");const[fw,sFw]=useState("42");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sw=parseFloat(stripW)||4;const l=parseFloat(len)||80;const fw2=parseFloat(fw)||42;const strips=Math.floor(fw2/sw);const yd=Math.ceil(l/36*8)/8;const hasResult=sw>0;const resultValue=strips+" LOF strips, "+yd+" yd each";const resultLabel="each "+l+"\" long";
const faqItems=[{q:"When use LOF vs WOF?",a:"LOF strips have no grain line stretch — ideal for borders and sashing."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"LOF Strip Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Cutting #173</span><h1>LOF Strip Calculator</h1><p>Strips cut along length of fabric.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Strip width</label><input type="number" className="input-field" value={stripW} onChange={e=>sS(e.target.value)}/></div><div className="input-group"><label className="input-label">Length needed</label><input type="number" className="input-field" value={len} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Fabric W</label><input type="number" className="input-field" value={fw} onChange={e=>sFw(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link"><Scissors size={13} /> All Cutting</a></div></aside></div></div>);}