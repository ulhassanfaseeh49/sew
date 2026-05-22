"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Scissors } from "lucide-react";
export default function Page(){
const[pieces,sP]=useState("3");const[avgW,sW]=useState("8");const[avgH,sH]=useState("12");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseInt(pieces)||3;const w=parseFloat(avgW)||8;const h=parseFloat(avgH)||12;const area=p*w*h;const yd=Math.ceil(area/(20*36)*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=p+" pieces of interfacing";
const faqItems=[{q:"Fusible or sew-in interfacing?",a:"Fusible is easier and works for most projects. Use sew-in for textured fabrics or when you need drape."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Interfacing Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Notion #196</span><h1>Interfacing Calculator</h1><p>Select interfacing type and calculate yardage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pieces</label><input type="number" className="input-field" value={pieces} onChange={e=>sP(e.target.value)} min="1"/></div><div className="input-group"><label className="input-label">Avg width (in)</label><input type="number" className="input-field" value={avgW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Avg height (in)</label><input type="number" className="input-field" value={avgH} onChange={e=>sH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}