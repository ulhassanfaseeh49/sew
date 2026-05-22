"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Scissors } from "lucide-react";
export default function Page(){
const[elasticW,sE]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const ew=parseFloat(elasticW)||1;const casing=ew+0.5;const foldOver=casing+0.25;const hasResult=true;const resultValue=casing.toFixed(2)+"\" casing width";const resultLabel="for "+ew+"\" elastic (fold "+foldOver.toFixed(2)+"\" total)";
const faqItems=[{q:"Why add extra to casing width?",a:"The casing needs to be slightly wider than the elastic so it can slide through easily."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Elastic Casing Width"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Notion #199</span><h1>Elastic Casing Width</h1><p>Casing width from elastic width.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Elastic width (in)</label><select className="input-field" value={elasticW} onChange={e=>sE(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.75">3/4&quot;</option><option value="1">1&quot;</option><option value="1.5">1-1/2&quot;</option><option value="2">2&quot;</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Elastic</span><strong>{ew}&quot;</strong></div><div className={styles.resultRow}><span>Casing</span><strong>{casing.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Fold allowance</span><strong>{foldOver.toFixed(2)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}