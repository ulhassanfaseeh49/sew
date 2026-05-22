"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shirt } from "lucide-react";
export default function Page(){
const[waist,sW]=useState("");const[wbWidth,sWB]=useState("1.5");const[overlap,sO]=useState("1.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const ww=parseFloat(wbWidth)||1.5;const o=parseFloat(overlap)||1.5;const cutLen=w+o+1.25;const cutW=ww*2+1.25;const hasResult=w>0;const resultValue=cutLen.toFixed(1)+"\" × "+cutW.toFixed(1)+"\"";const resultLabel="waistband cut dimensions";
const faqItems=[{q:"How much overlap for a waistband?",a:"1-1.5 inches for button closure, more for hook-and-bar closure."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Waistband Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Garment #216</span><h1>Waistband Calculator</h1><p>Waistband length and width.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">WB width (in)</label><input type="number" className="input-field" value={wbWidth} onChange={e=>sWB(e.target.value)}/></div><div className="input-group"><label className="input-label">Overlap (in)</label><input type="number" className="input-field" value={overlap} onChange={e=>sO(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Cut length</span><strong>{cutLen.toFixed(1)}&quot;</strong></div><div className={styles.resultRow}><span>Cut width</span><strong>{cutW.toFixed(1)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}