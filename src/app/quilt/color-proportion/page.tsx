"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[main,sM]=useState("60");const[accent,sA]=useState("25");const[bg,sBg]=useState("15");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const m2=parseFloat(main)||0;const a=parseFloat(accent)||0;const b=parseFloat(bg)||0;const total=m2+a+b;const hasResult=total>0;const resultValue=total===100?"Balanced":"Total: "+total+"% (should be 100%)";const resultLabel="color distribution";
const faqItems=[{q:"What is the 60-30-10 rule?",a:"Use 60% dominant color, 30% secondary, and 10% accent for visual balance."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Color Proportion Tool"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Quilt #135</span><h1>Color Proportion Tool</h1><p>Calculate fabric color proportions in a quilt.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Main (%)</label><input type="number" className="input-field" value={main} onChange={e=>sM(e.target.value)} min="0" max="100"/></div><div className="input-group"><label className="input-label">Accent (%)</label><input type="number" className="input-field" value={accent} onChange={e=>sA(e.target.value)} min="0" max="100"/></div><div className="input-group"><label className="input-label">Background (%)</label><input type="number" className="input-field" value={bg} onChange={e=>sBg(e.target.value)} min="0" max="100"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Main</span><strong>{m2}%</strong></div><div className={styles.resultRow}><span>Accent</span><strong>{a}%</strong></div><div className={styles.resultRow}><span>Background</span><strong>{b}%</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}