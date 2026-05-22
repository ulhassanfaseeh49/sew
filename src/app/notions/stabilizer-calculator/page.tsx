"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[hoopW,sW]=useState("5");const[hoopH,sH]=useState("7");const[designs,sD]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(hoopW)||5;const h=parseFloat(hoopH)||7;const d=parseInt(designs)||1;const pieces=d;const area=pieces*(w+2)*(h+2);const yd=Math.ceil(area/(20*36)*4)/4;const hasResult=true;const resultValue=yd+" yards ("+pieces+" pieces)";const resultLabel=(w+2)+"x"+(h+2)+"\" per hooping";
const faqItems=[{q:"What type of stabilizer do I need?",a:"Tear-away for wovens, cut-away for knits, wash-away for freestanding lace."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Stabilizer Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Notion #197</span><h1>Stabilizer Calculator</h1><p>Stabilizer for embroidery and applique.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Hoop width (in)</label><input type="number" className="input-field" value={hoopW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Hoop height (in)</label><input type="number" className="input-field" value={hoopH} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Number of hoopings</label><input type="number" className="input-field" value={designs} onChange={e=>sD(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}