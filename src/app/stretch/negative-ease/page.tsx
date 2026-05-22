"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Minus, Printer, Scissors } from "lucide-react";
export default function Page(){
const[body,sB]=useState("");const[garment,sG]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(body)||0;const g=parseFloat(garment)||0;const ease=g-b;const pct=b>0?(ease/b*100):0;const hasResult=b>0&&g>0;const resultValue=ease.toFixed(1)+"\" ease ("+pct.toFixed(1)+"%)";const resultLabel=ease<0?"Negative ease (fitted)":"Positive ease (loose)";
const faqItems=[{q:"How much negative ease is typical?",a:"2-4 inches for fitted knit tops. Swimwear uses more (up to 15-20% negative ease)."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Negative Ease Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Minus size={14} strokeWidth={1.5} /> Stretch #302</span><h1>Negative Ease Calculator</h1><p>Negative ease for knit garments.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Body measurement (in)</label><input type="number" className="input-field" placeholder="36" value={body} onChange={e=>sB(e.target.value)}/></div><div className="input-group"><label className="input-label">Garment measurement (in)</label><input type="number" className="input-field" placeholder="34" value={garment} onChange={e=>sG(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link"><Scissors size={13} /> All Stretch</a></div></aside></div></div>);}