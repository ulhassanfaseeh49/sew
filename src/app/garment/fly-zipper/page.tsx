"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[rise,sR]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const r=parseFloat(rise)||0;const zipLen=Math.ceil((r*0.75)/2)*2;const hasResult=r>0;const resultValue=zipLen+"\" fly zipper";const resultLabel="for "+r+"\" front rise";
const faqItems=[{q:"How do I measure for a fly zipper?",a:"Measure from the waist seam to the desired fly opening (about 75% of the front rise)."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Fly Zipper Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Garment #218</span><h1>Fly Zipper Calculator</h1><p>Fly zipper length from body measurements.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Front rise / crotch to waist (in)</label><input type="number" className="input-field" placeholder="10" value={rise} onChange={e=>sR(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}