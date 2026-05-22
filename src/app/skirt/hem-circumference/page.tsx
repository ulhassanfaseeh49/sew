"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[waistR,sR]=useState("");const[skirtLen,sL]=useState("24");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const r=parseFloat(waistR)||0;const l=parseFloat(skirtLen)||24;const hemR=r+l;const hemCirc=2*Math.PI*hemR;const hasResult=r>0;const resultValue=Math.round(hemCirc)+"\" hem circumference";const resultLabel="hem radius: "+hemR.toFixed(1)+"\"";
const faqItems=[{q:"How does hem size affect drape?",a:"Larger hem = more drape and movement. Full circles have huge hems that create beautiful flowing movement."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"Hem Circumference"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Skirt #359</span><h1>Hem Circumference</h1><p>Hem size for circle skirts.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist radius (in)</label><input type="number" className="input-field" placeholder="4.5" value={waistR} onChange={e=>sR(e.target.value)}/></div><div className="input-group"><label className="input-label">Skirt length (in)</label><input type="number" className="input-field" value={skirtLen} onChange={e=>sL(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link"><Shirt size={13} /> All Skirts</a></div></aside></div></div>);}