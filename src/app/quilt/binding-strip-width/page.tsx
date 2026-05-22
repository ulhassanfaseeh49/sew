"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler } from "lucide-react";
export default function Page(){
const[fin,sF]=useState("0.5");const[fold,sFold]=useState("double");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fin)||0.5;const cut=fold==="double"?f*4+0.5:f*2+0.5;const hasResult=true;const resultValue=cut.toFixed(2)+"\" cut width";const resultLabel=fold+"-fold for "+f+"\" finished";
const faqItems=[{q:"What width binding strips?",a:"2.5 inches for double-fold is the most popular."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Binding Strip Width"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Quilt #139</span><h1>Binding Strip Width</h1><p>Cut width for desired finished binding.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished width</label><select className="input-field" value={fin} onChange={e=>sF(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option></select></div><div className="input-group"><label className="input-label">Fold</label><select className="input-field" value={fold} onChange={e=>sFold(e.target.value)}><option value="single">Single</option><option value="double">Double</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Cut width</span><strong>{cut.toFixed(2)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}