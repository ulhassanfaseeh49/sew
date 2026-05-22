"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle } from "lucide-react";
export default function Page(){
const[totalSqIn,sT]=useState("");const[usedSqIn,sU]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tot=parseFloat(totalSqIn)||0;const used=parseFloat(usedSqIn)||0;const waste=tot-used;const pct=tot>0?(waste/tot*100):0;const hasResult=tot>0&&used>0;const resultValue=pct.toFixed(1)+"% waste";const resultLabel=waste+" sq in wasted of "+tot+" sq in total";
const faqItems=[{q:"What is a good waste percentage?",a:"10-15% is normal for garments. 5% is excellent. Zero-waste patterns aim for under 2%."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Waste Percentage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Recycle size={14} strokeWidth={1.5} /> Eco #450</span><h1>Waste Percentage Calculator</h1><p>Calculate fabric waste percentage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total fabric area (sq in)</label><input type="number" className="input-field" placeholder="2000" value={totalSqIn} onChange={e=>sT(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Used/cut area (sq in)</label><input type="number" className="input-field" placeholder="1500" value={usedSqIn} onChange={e=>sU(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}