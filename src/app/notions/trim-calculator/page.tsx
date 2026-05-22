"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors, Sparkles } from "lucide-react";
export default function Page(){
const[length,sL]=useState("");const[layers,sLy]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(length)||0;const ly=parseInt(layers)||1;const total=l*ly;const yd=Math.ceil(total/36*4)/4;const hasResult=l>0;const resultValue=yd+" yards";const resultLabel=ly+" row(s) × "+l+"\"";
const faqItems=[{q:"Should I buy extra trim?",a:"Always buy 10-15% extra for corners, matching, and mistakes."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Trim Yardage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Sparkles size={14} strokeWidth={1.5} /> Notion #195</span><h1>Trim Yardage Calculator</h1><p>Yardage for any trim type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" placeholder="60" value={length} onChange={e=>sL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Layers/rows</label><input type="number" className="input-field" value={layers} onChange={e=>sLy(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}