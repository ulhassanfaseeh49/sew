"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Frame, Printer, Ruler } from "lucide-react";
export default function Page(){
const[totalW,sT]=useState("");const[panels,sP]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tw=parseFloat(totalW)||0;const p=parseInt(panels)||2;const perPanel=tw/p;const hasResult=tw>0;const resultValue=perPanel.toFixed(1)+"\" per panel";const resultLabel=p+" panels from "+tw+"\"";
const faqItems=[{q:"How many panels do I need?",a:"2 panels for center-opening curtains (1 each side). 1 panel for a single-sided draw."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Panel Width Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Curtain #240</span><h1>Panel Width Calculator</h1><p>Individual panel width from total width.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total fabric width (in)</label><input type="number" className="input-field" placeholder="120" value={totalW} onChange={e=>sT(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of panels</label><input type="number" className="input-field" value={panels} onChange={e=>sP(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link"><Frame size={13} /> All Curtains</a></div></aside></div></div>);}