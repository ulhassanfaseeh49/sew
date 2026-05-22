"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ribbon, Ruler } from "lucide-react";
export default function Page(){
const[edges,sE]=useState("");const[extra,sX]=useState("10");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const e=parseFloat(edges)||0;const x=parseFloat(extra)||10;const total=e*(1+x/100);const yd=Math.ceil(total/36*4)/4;const hasResult=e>0;const resultValue=yd+" yards";const resultLabel=total.toFixed(0)+"\" total with "+x+"% extra";
const faqItems=[{q:"How much extra bias tape should I buy?",a:"10-15% extra for joins, corners, and mistakes."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Bias Tape Yardage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Bias #281</span><h1>Bias Tape Yardage</h1><p>How much bias tape needed.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total edge length (in)</label><input type="number" className="input-field" placeholder="120" value={edges} onChange={e=>sE(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Extra % for joins</label><input type="number" className="input-field" value={extra} onChange={e=>sX(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link"><Ribbon size={13} /> All Bias</a></div></aside></div></div>);}