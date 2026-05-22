"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, RefreshCw, Scissors } from "lucide-react";
export default function Page(){
const[threadYd,sT]=useState("");const[bobbinCap,sB]=useState("70");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const t2=parseFloat(threadYd)||0;const bc=parseFloat(bobbinCap)||70;const bobbins=Math.ceil(t2/bc);const hasResult=t2>0;const resultValue=bobbins+" bobbins";const resultLabel=t2+" yards ÷ "+bc+" per bobbin";
const faqItems=[{q:"How do I wind a bobbin evenly?",a:"Use medium speed, guide thread back and forth. Most machines have auto-stop when full."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Bobbin Thread Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Notion #181</span><h1>Bobbin Thread Calculator</h1><p>Calculate bobbins needed for a project.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Thread needed (yards)</label><input type="number" className="input-field" placeholder="200" value={threadYd} onChange={e=>sT(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Bobbin capacity (yd)</label><input type="number" className="input-field" value={bobbinCap} onChange={e=>sB(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}