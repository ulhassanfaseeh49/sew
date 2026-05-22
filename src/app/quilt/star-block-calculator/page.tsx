"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Star } from "lucide-react";
export default function Page(){
const[fin,sF]=useState("12");const[type,sT]=useState("ohio");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fin)||12;const grid=f/3;const hstCut=grid+0.875;const sqCut=grid+0.5;const hasResult=f>0;const resultValue="HST: "+hstCut.toFixed(2)+"\" / Sq: "+sqCut.toFixed(2)+"\"";const resultLabel=type+" star at "+f+"\"";
const faqItems=[{q:"Which star block is easiest?",a:"Sawtooth Star uses only HSTs and squares — great for beginners."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Star Block Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Star size={14} strokeWidth={1.5} /> Quilt #155</span><h1>Star Block Calculator</h1><p>Cutting dimensions for star blocks.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished size</label><input type="number" className="input-field" value={fin} onChange={e=>sF(e.target.value)}/></div><div className="input-group"><label className="input-label">Type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="ohio">Ohio Star</option><option value="sawtooth">Sawtooth Star</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}