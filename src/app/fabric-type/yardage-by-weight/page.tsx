"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale } from "lucide-react";
export default function Page(){
const[weightOz,sW]=useState("");const[gsm,sG]=useState("150");const[widthIn,sWi]=useState("44");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const wOz=parseFloat(weightOz)||0;const g=parseFloat(gsm)||150;const wi=parseFloat(widthIn)||44;const wGrams=wOz*28.35;const areaM2=wGrams/g;const areaSqIn=areaM2*1550;const lengthIn=areaSqIn/wi;const yd=lengthIn/36;const hasResult=wOz>0;const resultValue=yd.toFixed(2)+" yards";const resultLabel=wOz+"oz of "+g+" GSM fabric at "+wi+"\" wide";
const faqItems=[{q:"Why calculate yardage from weight?",a:"Useful for buying scrap fabric sold by the pound, or estimating how much fabric is on a partial bolt."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Yardage by Weight"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #427</span><h1>Yardage by Weight</h1><p>Calculate yardage from fabric weight.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric weight (oz)</label><input type="number" className="input-field" placeholder="8" value={weightOz} onChange={e=>sW(e.target.value)} min="0" step="0.1"/></div><div className="input-group"><label className="input-label">Fabric GSM</label><input type="number" className="input-field" value={gsm} onChange={e=>sG(e.target.value)}/></div><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={widthIn} onChange={e=>sWi(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}