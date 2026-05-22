"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Drama, Printer } from "lucide-react";
export default function Page(){
const[span,sS]=useState("48");const[type,sT]=useState("fabric");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(span)||48;const perWing=s/2;const area=perWing*perWing*0.75;const yd=Math.ceil(area*2/(44*36)*4)/4;const hasResult=true;const resultValue=type==="foam"?Math.ceil(area*2/720)+" foam sheets":yd+" yards fabric";const resultLabel=s+"\" wingspan ("+perWing+"\" per wing)";
const faqItems=[{q:"How do I make wings stand up?",a:"Use wire frame (coat hangers or floral wire), attach fabric with hot glue, use a backpack-style harness."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Wing Span Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Costume #343</span><h1>Wing Span Calculator</h1><p>Materials for costume wings.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total wingspan (in)</label><input type="number" className="input-field" value={span} onChange={e=>sS(e.target.value)}/></div><div className="input-group"><label className="input-label">Material</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="fabric">Fabric on wire</option><option value="foam">EVA foam</option><option value="cellophane">Cellophane/organza</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link"><Drama size={13} /> All Costume</a></div></aside></div></div>);}