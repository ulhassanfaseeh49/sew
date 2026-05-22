"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Drama, Printer } from "lucide-react";
export default function Page(){
const[waist,sW]=useState("");const[length,sL]=useState("24");const[circles,sC]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const l=parseFloat(length)||24;const c=parseFloat(circles)||1;const waistR=w/(2*Math.PI*c);const totalR=waistR+l;const fabricSq=totalR*2+2;const yd=Math.ceil(fabricSq/36*c*4)/4;const hasResult=w>0;const resultValue=yd+" yards ("+fabricSq.toFixed(0)+"\" square × "+c+")";const resultLabel=c+" circle skirt, "+l+"\" long";
const faqItems=[{q:"Why use more than one circle?",a:"Double or triple circles create more drama and volume. Each extra circle adds 360 degrees of sweep."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Circle Skirt (Costume)"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⭕</span> Costume #338</span><h1>Circle Skirt (Costume)</h1><p>Circle skirt for costumes with extra fullness.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={length} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Circles</label><select className="input-field" value={circles} onChange={e=>sC(e.target.value)}><option value="0.5">Half circle</option><option value="1">Full circle</option><option value="1.5">1.5 circles</option><option value="2">Double circle</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link"><Drama size={13} /> All Costume</a></div></aside></div></div>);}