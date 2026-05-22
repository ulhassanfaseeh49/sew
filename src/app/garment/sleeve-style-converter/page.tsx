"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, RefreshCw, Shirt } from "lucide-react";
export default function Page(){
const[type,sT]=useState("setin-to-raglan");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const steps=type==="setin-to-raglan"?"1. Mark shoulder point on bodice\n2. Draw raglan line from armhole to neckline\n3. Cut and transfer shoulder area to sleeve":"1. Measure raglan seam length\n2. Draw armhole curve on bodice\n3. Create separate sleeve cap";const hasResult=true;const resultValue=type==="setin-to-raglan"?"Set-in → Raglan":"Raglan → Set-in";const resultLabel="See method steps below";
const faqItems=[{q:"Is converting sleeves difficult?",a:"It requires intermediate pattern making skills. A muslin test is highly recommended."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Sleeve Style Converter"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Garment #224</span><h1>Sleeve Style Converter</h1><p>Convert between set-in and raglan sleeves.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Conversion</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="setin-to-raglan">Set-in → Raglan</option><option value="raglan-to-setin">Raglan → Set-in</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Steps</span><strong style={{fontWeight:"normal",fontSize:"0.85rem",whiteSpace:"pre-line"}}>{steps}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}