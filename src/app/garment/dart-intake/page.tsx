"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shirt } from "lucide-react";
export default function Page(){
const[bust,sB]=useState("");const[patBust,sP]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(bust)||0;const p=parseFloat(patBust)||0;const excess=p-b;const dartIntake=excess>0?excess:0;const hasResult=b>0&&p>0;const resultValue=dartIntake.toFixed(2)+"\" total dart intake";const resultLabel="spread across all darts";
const faqItems=[{q:"How many darts are typical?",a:"2 bust darts is most common. Some patterns use 4 (2 front + 2 back) for fitted garments."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Dart Intake Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Garment #202</span><h1>Dart Intake Calculator</h1><p>How much fabric a dart takes in.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Body bust (in)</label><input type="number" className="input-field" placeholder="36" value={bust} onChange={e=>sB(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Pattern bust (flat)</label><input type="number" className="input-field" placeholder="38" value={patBust} onChange={e=>sP(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}