"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[type,sT]=useState("continuous");const[opening,sO]=useState("8");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const o=parseFloat(opening)||8;const dims=type==="continuous"?{w:1.5,l:o*2+1}:type==="faced"?{w:2.5,l:o+2}:{w:1.5,l:o+2};const hasResult=true;const resultValue=dims.l.toFixed(1)+"\" × "+dims.w+"\"";const resultLabel=type+" placket strip";
const faqItems=[{q:"What type of placket is most common?",a:"Button-front placket for shirts, continuous bound for sleeve openings."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Placket Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><ClipboardCopy size={14} strokeWidth={1.5} /> Garment #219</span><h1>Placket Calculator</h1><p>Placket dimensions for various types.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="continuous">Continuous bound</option><option value="faced">Faced</option><option value="button">Button</option></select></div><div className="input-group"><label className="input-label">Opening length (in)</label><input type="number" className="input-field" value={opening} onChange={e=>sO(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}