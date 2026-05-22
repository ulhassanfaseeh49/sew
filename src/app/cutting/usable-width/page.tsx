"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Scissors } from "lucide-react";
export default function Page(){
const[totalW,sT]=useState("44");const[selvage,sS]=useState("0.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(totalW)||44;const s=parseFloat(selvage)||0.5;const usable=w-s*2;const hasResult=true;const resultValue=usable+"\" usable";const resultLabel=w+"\" - "+s+"\" selvage each side";
const faqItems=[{q:"How wide is selvage?",a:"Typically 1/4 to 1/2 inch on each side for quilting cotton. Up to 1 inch on some fabrics."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Usable Width Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Cutting #178</span><h1>Usable Width Calculator</h1><p>Actual usable width after selvage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total fabric width</label><input type="number" className="input-field" value={totalW} onChange={e=>sT(e.target.value)}/></div><div className="input-group"><label className="input-label">Selvage each side</label><input type="number" className="input-field" value={selvage} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link"><Scissors size={13} /> All Cutting</a></div></aside></div></div>);}