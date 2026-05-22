"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, RefreshCw, Shirt } from "lucide-react";
export default function Page(){
const[waist,sW]=useState("");const[length,sL]=useState("22");const[overlap,sO]=useState("6");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const l=parseFloat(length)||22;const o=parseFloat(overlap)||6;const totalW=w+o;const yd=Math.ceil((l+4)/36*4)/4;const hasResult=w>0;const resultValue=yd+" yards × "+totalW+"\" wide";const resultLabel="wrap skirt with "+o+"\" overlap + ties";
const faqItems=[{q:"How much overlap for a wrap skirt?",a:"6-8 inches overlap prevents gapping. Add tie lengths (about 20 inches each side)."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"Wrap Skirt Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Skirt #364</span><h1>Wrap Skirt Calculator</h1><p>Wrap skirt with overlap.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={length} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Overlap (in)</label><input type="number" className="input-field" value={overlap} onChange={e=>sO(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link"><Shirt size={13} /> All Skirts</a></div></aside></div></div>);}