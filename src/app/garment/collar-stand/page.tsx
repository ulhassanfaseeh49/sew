"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[neckCirc,sN]=useState("");const[type,sT]=useState("shirt");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const n=parseFloat(neckCirc)||0;const standH=type==="mandarin"?1.5:type==="peter-pan"?0:1.25;const cutLen=n+3;const hasResult=n>0;const resultValue=cutLen.toFixed(1)+"\" × "+standH+"\"";const resultLabel=type+" collar stand";
const faqItems=[{q:"What is a collar stand?",a:"The vertical piece between the neckline seam and the collar fall. It holds the collar upright."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Collar Stand Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Shirt size={14} strokeWidth={1.5} /> Garment #220</span><h1>Collar Stand Calculator</h1><p>Collar stand dimensions by collar type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Neck circumference (in)</label><input type="number" className="input-field" placeholder="15" value={neckCirc} onChange={e=>sN(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Collar type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="shirt">Shirt collar</option><option value="mandarin">Mandarin/band</option><option value="peter-pan">Peter Pan</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}