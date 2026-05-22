"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale } from "lucide-react";
export default function Page(){
const[oz,sO]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const o=parseFloat(oz)||0;const gsm=o/0.02949;const cat=gsm<150?"Lightweight":gsm<250?"Medium weight":gsm<350?"Heavyweight":"Very heavy";const hasResult=o>0;const resultValue=Math.round(gsm)+" GSM";const resultLabel=o+" oz/yd² = "+cat;
const faqItems=[{q:"Where is oz/yd² used?",a:"Primarily in the US and UK textile industry. Most international markets use GSM."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"oz/yd² to GSM Converter"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #416</span><h1>oz/yd² to GSM Converter</h1><p>Convert ounces per square yard to GSM.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">oz/yd² (ounces per square yard)</label><input type="number" className="input-field" placeholder="5" value={oz} onChange={e=>sO(e.target.value)} min="0" step="0.1"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}