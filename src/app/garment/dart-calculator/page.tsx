"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shirt } from "lucide-react";
export default function Page(){
const[intake,sI]=useState("");const[len,sL]=useState("6");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const di=parseFloat(intake)||0;const dl=parseFloat(len)||6;const halfWidth=di/2;const hasResult=di>0;const resultValue=di+"\" intake, "+dl+"\" long";const resultLabel="dart takes in "+di+"\" at widest point";
const faqItems=[{q:"What is dart intake?",a:"The total width of fabric folded out by the dart. A 1.5 inch dart folds 0.75 inch on each side."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Dart Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Garment #201</span><h1>Dart Calculator</h1><p>Calculate dart width, length, and intake.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Dart intake (in)</label><input type="number" className="input-field" placeholder="1.5" value={intake} onChange={e=>sI(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">Dart length (in)</label><input type="number" className="input-field" value={len} onChange={e=>sL(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Each side of dart</span><strong>{halfWidth.toFixed(3)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}