"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shirt } from "lucide-react";
export default function Page(){
const[width,sW]=useState("");const[numPleats,sN]=useState("6");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(width)||0;const n=parseInt(numPleats)||6;const spacing=w/n;const hasResult=w>0;const resultValue=spacing.toFixed(2)+"\" between pleats";const resultLabel=n+" pleats across "+w+"\"";
const faqItems=[{q:"Should pleats be evenly spaced?",a:"Usually yes for skirts. For design purposes, you can vary spacing for visual interest."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Pleat Spacing Tool"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Garment #206</span><h1>Pleat Spacing Tool</h1><p>Even pleat spacing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total width (in)</label><input type="number" className="input-field" placeholder="24" value={width} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of pleats</label><input type="number" className="input-field" value={numPleats} onChange={e=>sN(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}